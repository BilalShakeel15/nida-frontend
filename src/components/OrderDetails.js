// src/components/OrderDetails.js 170
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderDetails.css';

const OrderDetails = () => {
  const API = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async (id) => {
      try {
        const response = await fetch(`${API}/api/product/getproduct/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const json = await response.json();
        return json.get_product;
      } catch {
        return null;
      }
    };

    const fetchAllDetails = async () => {
      if (order?.products?.length > 0) {
        const fetched = await Promise.all(order.products.map(item => fetchProductDetails(item.productId)));
        setProducts(fetched);
      }
      setLoading(false);
    };
    fetchAllDetails();
  }, [order]);

  const statusConfig = {
    pending: { label: 'Pending', color: '#f59e0b', bg: '#fffbeb' },
    confirmed: { label: 'Confirmed', color: '#3b82f6', bg: '#eff6ff' },
    shipped: { label: 'Shipped', color: '#8b5cf6', bg: '#f5f3ff' },
    completed: { label: 'Completed', color: '#10b981', bg: '#ecfdf5' },
  };
  const cfg = statusConfig[order?.status] || { label: order?.status, color: '#888', bg: '#f9f9f9' };

  if (!order) return (
    <div className="od-page">
      <div className="od-notfound">
        <span style={{ fontSize: '3rem' }}>🔍</span>
        <h2>Order Not Found</h2>
        <p>Please go back and select an order.</p>
        <button className="od-back-btn" onClick={() => navigate('/orders')}>← Back to Orders</button>
      </div>
    </div>
  );

  return (
    <div className="od-page">
      <div className="od-topbar">
        <button className="od-back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h1 className="od-title">Order Details</h1>
        <span className="od-badge" style={{ color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
      </div>

      <div className="od-grid">
        {/* Customer Info */}
        <div className="od-card">
          <div className="od-card__head">👤 Customer Information</div>
          <div className="od-info-list">
            <div className="od-info-row"><span>Name</span><strong>{order.name}</strong></div>
            <div className="od-info-row"><span>Email</span><strong>{order.email}</strong></div>
            <div className="od-info-row"><span>Contact</span><strong>{order.contact}</strong></div>
            <div className="od-info-row"><span>Location</span><strong>{order.cc}</strong></div>
            <div className="od-info-row od-info-row--full"><span>Address</span><strong>{order.address}</strong></div>
            <div className="od-info-row">
              <span>Order Date</span>
              <strong>{new Date(order.date || order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
            </div>
          </div>
        </div>

        {/* Payment Screenshot */}
        <div className="od-card">
          <div className="od-card__head">💳 Payment Screenshot</div>
          {order.paymentScreenshot ? (
            <div className="od-payment">
              <img
                src={`${API}/uploads/${order.paymentScreenshot}`}
                alt="Payment"
                className="od-payment-img"
                onClick={() => window.open(`${API}/uploads/${order.paymentScreenshot}`, '_blank')}
              />
              <p className="od-payment-hint">Click image to view full size</p>
            </div>
          ) : (
            <div className="od-no-payment">
              <span>🧾</span>
              <p>No payment screenshot provided</p>
            </div>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="od-card od-card--full">
        <div className="od-card__head">📦 Ordered Products ({products.length})</div>
        {loading ? (
          <div className="od-loading">Loading products...</div>
        ) : (
          <div className="od-products">
            {products.map((product, index) => (
              <div className="od-product" key={index}>
                <img
                  src={product?.images?.[0] ? `${API}/uploads/${product.images[0]}` : 'https://via.placeholder.com/100'}
                  alt={product?.title}
                  className="od-product-img"
                />
                <div className="od-product-info">
                  <h4 className="od-product-title">{product?.title}</h4>
                  <span className="od-product-cat">{product?.category}</span>
                  <span className="od-product-pieces">{product?.pieces} pcs set</span>
                </div>
                <div className="od-product-right">
                  <div className="od-qty-badge">Qty: {order.products?.[index]?.quantity}</div>
                  <div className="od-product-price">Rs. {product?.price?.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;