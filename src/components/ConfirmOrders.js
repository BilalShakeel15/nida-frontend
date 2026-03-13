// src/components/ConfirmOrders.js 100
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ConfirmOrders.css';

const ConfirmOrders = () => {
    const API = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [orderlist, setOrder] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchorderlist = async () => {
            const response = await fetch(`${API}/api/admin/getconfirmorders`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'auth-token': localStorage.getItem('admin') },
            });
            const json = await response.json();
            setOrder(json.get_orderdetails || []);
        };
        fetchorderlist();
    }, []);

    const handleorder = (order) => navigate('/orderdetail', { state: { order } });

    const filteredOrders = orderlist.filter(order =>
        order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.cc?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="co-page">
            <div className="co-header">
                <div>
                    <h1 className="co-title">Delivered Orders</h1>
                    <p className="co-subtitle">{orderlist.length} completed orders</p>
                </div>
                <div className="co-search-wrap">
                    <span className="co-search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search by name, email, city..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="co-search"
                    />
                </div>
            </div>

            <div className="co-table-wrap">
                <table className="co-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Customer</th>
                            <th>Contact</th>
                            <th>Location</th>
                            <th>Address</th>
                            <th>Payment</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length === 0 ? (
                            <tr><td colSpan="7" className="co-empty">No delivered orders yet</td></tr>
                        ) : (
                            filteredOrders.map((order, index) => (
                                <tr key={order._id} onClick={() => handleorder(order)} className="co-row">
                                    <td className="co-num">{index + 1}</td>
                                    <td>
                                        <div className="co-cust-name">{order.name}</div>
                                        <div className="co-cust-email">{order.email}</div>
                                    </td>
                                    <td>{order.contact}</td>
                                    <td>{order.cc}</td>
                                    <td className="co-address">{order.address}</td>
                                    <td onClick={e => e.stopPropagation()}>
                                        {order.paymentScreenshot ? (
                                            <img
                                                src={`${API}/uploads/${order.paymentScreenshot}`}
                                                alt="Payment"
                                                className="co-payment-thumb"
                                                onClick={() => window.open(`${API}/uploads/${order.paymentScreenshot}`, '_blank')}
                                                title="Click to view full size"
                                            />
                                        ) : (
                                            <span className="co-no-payment">No screenshot</span>
                                        )}
                                    </td>
                                    <td>
                                        <span className="co-badge">✅ Delivered</span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ConfirmOrders;