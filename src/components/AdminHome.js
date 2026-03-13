// src/components/AdminHome.js 53
import React, { useEffect, useState } from 'react';
import './AdminHome.css';

const AdminHome = () => {
  const API = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('admin');
  const [stats, setStats] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, topRes] = await Promise.all([
          fetch(`${API}/api/dashboard/stats`, { headers: { 'auth-token': token } }),
          fetch(`${API}/api/dashboard/top-products`, { headers: { 'auth-token': token } }),
        ]);
        const statsData = await statsRes.json();
        const topData = await topRes.json();
        console.log(topData);

        if (statsData.success) setStats(statsData.stats);
        if (topData.success) setTopProducts(topData.topProducts.slice(0, 5));
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statusColor = { pending: '#f59e0b', confirmed: '#3b82f6', shipped: '#8b5cf6', completed: '#10b981' };
  const statusLabel = { pending: 'Pending', confirmed: 'Confirmed', shipped: 'Shipped', completed: 'Completed' };

  if (loading) {
    return (
      <div className="adm-loader">
        <div className="adm-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const ordersByStatus = stats?.orders?.byStatus || [];
  const trend = stats?.orders?.trend7Days || [];

  return (
    <div className="adm-dashboard">
      {/* Header */}
      <div className="adm-header">
        <div>
          <h1 className="adm-title">Dashboard</h1>
          <p className="adm-subtitle">Welcome back, Nida! Here's what's happening today.</p>
        </div>
        <div className="adm-date">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="adm-cards">
        <div className="adm-card adm-card--pink">
          <div className="adm-card__icon">🛒</div>
          <div className="adm-card__info">
            <span className="adm-card__label">Total Orders</span>
            <span className="adm-card__value">{stats?.orders?.total ?? 0}</span>
            <span className="adm-card__sub">+{stats?.orders?.thisMonth ?? 0} this month</span>
          </div>
        </div>
        <div className="adm-card adm-card--rose">
          <div className="adm-card__icon">📦</div>
          <div className="adm-card__info">
            <span className="adm-card__label">Total Products</span>
            <span className="adm-card__value">{stats?.products?.total ?? 0}</span>
            <span className="adm-card__sub">{stats?.products?.outOfStock ?? 0} out of stock</span>
          </div>
        </div>
        <div className="adm-card adm-card--fuchsia">
          <div className="adm-card__icon">👥</div>
          <div className="adm-card__info">
            <span className="adm-card__label">Customers</span>
            <span className="adm-card__value">{stats?.users?.total ?? 0}</span>
            <span className="adm-card__sub">+{stats?.users?.thisMonth ?? 0} this month</span>
          </div>
        </div>
        <div className="adm-card adm-card--amber">
          <div className="adm-card__icon">⚠️</div>
          <div className="adm-card__info">
            <span className="adm-card__label">Low Stock</span>
            <span className="adm-card__value">{stats?.products?.lowStock ?? 0}</span>
            <span className="adm-card__sub">Items need restock</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="adm-grid">
        {/* Order Trend */}
        <div className="adm-panel adm-panel--wide">
          <div className="adm-panel__head">
            <h3>Orders — Last 7 Days</h3>
          </div>
          <div className="adm-chart">
            {trend.map((day, i) => {
              const max = Math.max(...trend.map(d => d.orders), 1);
              const height = (day.orders / max) * 100;
              return (
                <div className="adm-bar-wrap" key={i}>
                  <span className="adm-bar-val">{day.orders}</span>
                  <div className="adm-bar" style={{ height: `${Math.max(height, 4)}%` }}></div>
                  <span className="adm-bar-label">{day.date.slice(5)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Orders by Status */}
        <div className="adm-panel">
          <div className="adm-panel__head">
            <h3>Order Status</h3>
          </div>
          <div className="adm-status-list">
            {ordersByStatus.map((s, i) => (
              <div className="adm-status-row" key={i}>
                <div className="adm-status-dot" style={{ background: statusColor[s._id] || '#aaa' }}></div>
                <span className="adm-status-name">{statusLabel[s._id] || s._id}</span>
                <span className="adm-status-count">{s.count}</span>
              </div>
            ))}
            {ordersByStatus.length === 0 && <p className="adm-empty">No orders yet</p>}
          </div>
        </div>
      </div>

      {/* Recent Orders + Top Products */}
      <div className="adm-grid adm-grid--equal">
        {/* Recent Orders */}
        <div className="adm-panel">
          <div className="adm-panel__head">
            <h3>Recent Orders</h3>
            <a href="/orders" className="adm-link">View all →</a>
          </div>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(stats?.recentOrders || []).slice(0, 7).map((order, i) => (
                  <tr key={i}>
                    <td>
                      <div className="adm-cust-name">{order.name}</div>
                      <div className="adm-cust-email">{order.email}</div>
                    </td>
                    <td>{order.cc}</td>
                    <td>
                      <span className="adm-badge" style={{ background: statusColor[order.status] + '22', color: statusColor[order.status] }}>
                        {statusLabel[order.status]}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!stats?.recentOrders?.length) && <tr><td colSpan="3" className="adm-empty">No orders yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="adm-panel">
          <div className="adm-panel__head">
            <h3>Top Selling Products</h3>
          </div>
          <div className="adm-products-list">
            {topProducts.map((p, i) => (
              <div className="adm-product-row" key={i}>
                <div className="adm-product-rank">#{i + 1}</div>
                <img
                  className="adm-product-img"
                  src={p.images?.[0] ? `${API}/uploads/${p.images[0]}` : 'https://via.placeholder.com/48'}
                  alt={p.title}
                />
                <div className="adm-product-info">
                  <span className="adm-product-title">{p.title}</span>
                  <span className="adm-product-cat">{p.category}</span>
                </div>
                <div className="adm-product-sold">
                  <span className="adm-sold-num">{p.totalSold}</span>
                  <span className="adm-sold-label">sold</span>
                </div>
              </div>
            ))}
            {topProducts.length === 0 && <p className="adm-empty">No sales data yet</p>}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="adm-panel adm-quick">
        <div className="adm-panel__head"><h3>Quick Actions</h3></div>
        <div className="adm-actions">
          {[
            { label: '+ Add Product', href: '/addproduct', color: '#d4358c' },
            { label: '+ Add Category', href: '/addcategory', color: '#8b5cf6' },
            { label: '📋 View Orders', href: '/orders', color: '#3b82f6' },
            { label: '🖼 Update Banner', href: '/banner', color: '#f59e0b' },
            { label: '✅ Delivered', href: '/confirmorders', color: '#10b981' },
            { label: '📦 All Products', href: '/allproducts', color: '#ec4899' },
          ].map((a, i) => (
            <a key={i} href={a.href} className="adm-action-btn" style={{ '--btn-color': a.color }}>
              {a.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;