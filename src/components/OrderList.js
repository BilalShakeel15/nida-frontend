// src/components/OrderList.js 178
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderList.css';

const OrderList = () => {
  const API = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [orderlist, setOrder] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState(null);
  const token = localStorage.getItem('admin');

  useEffect(() => {
    const fetchorderlist = async () => {
      const response = await fetch(`${API}/api/admin/getorderlist`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'auth-token': token },
      });
      const json = await response.json();
      setOrder(json.get_orderdetails || []);
    };
    fetchorderlist();
  }, []);

  const handleorder = (order) => navigate('/orderdetail', { state: { order } });

  const updateOrderStatus = async (orderId, newStatus, e) => {
    e.stopPropagation();
    setUpdating(orderId);
    try {
      const response = await fetch(`${API}/api/admin/updateOrderStatus`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'auth-token': token },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        setOrder(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const filteredOrders = orderlist.filter(order =>
    order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.cc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusConfig = {
    pending: { label: 'Pending', color: '#f59e0b', bg: '#fffbeb' },
    confirmed: { label: 'Confirmed', color: '#3b82f6', bg: '#eff6ff' },
    shipped: { label: 'Shipped', color: '#8b5cf6', bg: '#f5f3ff' },
    completed: { label: 'Completed', color: '#10b981', bg: '#ecfdf5' },
  };

  return (
    <div className="ol-page">
      <div className="ol-header">
        <div>
          <h1 className="ol-title">Orders</h1>
          <p className="ol-subtitle">{orderlist.length} total orders</p>
        </div>
        <div className="ol-search-wrap">
          <span className="ol-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name, email, city, status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ol-search"
          />
        </div>
      </div>

      {/* Status Summary */}
      <div className="ol-summary">
        {Object.entries(statusConfig).map(([key, cfg]) => {
          const count = orderlist.filter(o => o.status === key).length;
          return (
            <div key={key} className="ol-summary-card" style={{ borderColor: cfg.color, background: cfg.bg }}>
              <span className="ol-summary-count" style={{ color: cfg.color }}>{count}</span>
              <span className="ol-summary-label">{cfg.label}</span>
            </div>
          );
        })}
      </div>

      <div className="ol-table-wrap">
        <table className="ol-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Customer</th>
              <th>Contact</th>
              <th>Location</th>
              <th>Address</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr><td colSpan="7" className="ol-empty">No orders found</td></tr>
            ) : (
              filteredOrders.map((order, index) => {
                const cfg = statusConfig[order.status] || { label: order.status, color: '#888', bg: '#f9f9f9' };
                return (
                  <tr key={order._id} onClick={() => handleorder(order)} className="ol-row">
                    <td className="ol-num">{index + 1}</td>
                    <td>
                      <div className="ol-cust-name">{order.name}</div>
                      <div className="ol-cust-email">{order.email}</div>
                    </td>
                    <td>{order.contact}</td>
                    <td>{order.cc}</td>
                    <td className="ol-address">{order.address}</td>
                    <td>
                      <span className="ol-badge" style={{ color: cfg.color, background: cfg.bg }}>
                        {cfg.label}
                      </span>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="ol-btns">
                        {order.status === 'pending' && (
                          <button className="ol-btn ol-btn--confirm"
                            disabled={updating === order._id}
                            onClick={(e) => updateOrderStatus(order._id, 'confirmed', e)}>
                            Confirm
                          </button>
                        )}
                        {order.status === 'confirmed' && (
                          <>
                            <button className="ol-btn ol-btn--ship"
                              disabled={updating === order._id}
                              onClick={(e) => updateOrderStatus(order._id, 'shipped', e)}>
                              Ship
                            </button>
                            <button className="ol-btn ol-btn--complete"
                              disabled={updating === order._id}
                              onClick={(e) => updateOrderStatus(order._id, 'completed', e)}>
                              Complete
                            </button>
                          </>
                        )}
                        {order.status === 'shipped' && (
                          <button className="ol-btn ol-btn--complete"
                            disabled={updating === order._id}
                            onClick={(e) => updateOrderStatus(order._id, 'completed', e)}>
                            Complete
                          </button>
                        )}
                        {order.status === 'completed' && (
                          <span className="ol-delivered">✅ Delivered</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;