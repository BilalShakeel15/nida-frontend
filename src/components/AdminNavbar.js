import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './AdminNavbar.css';

const AdminNavbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { label: 'Dashboard', path: '/adminhome', icon: '⊞' },
        { label: 'Orders', path: '/orders', icon: '📦' },
        { label: 'Confirmed', path: '/confirmorders', icon: '✅' },
        { label: 'Products', path: '/allproducts', icon: '🛍️' },
        { label: 'Add Product', path: '/addproduct', icon: '➕' },
        { label: 'Categories', path: '/addcategory', icon: '🗂️' },
        { label: 'Banner', path: '/banner', icon: '🖼️' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('admin');
        setMenuOpen(false);
        navigate('/');
        // Force scroll reset after navigation
        setTimeout(() => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            window.scrollTo({ top: 0, behavior: 'instant' });
        }, 50);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <nav className="admin-nav">
                <div className="admin-nav__brand">
                    <span className="admin-nav__logo">✦</span>
                    <div>
                        <span className="admin-nav__title">Nida Crafteria</span>
                        <span className="admin-nav__subtitle">Admin Panel</span>
                    </div>
                </div>

                {/* Desktop Links */}
                <div className="admin-nav__links">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`admin-nav__link ${isActive(item.path) ? 'admin-nav__link--active' : ''}`}
                        >
                            <span className="admin-nav__link-icon">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="admin-nav__right">
                    <div className="admin-nav__badge">Admin</div>
                    <button className="admin-nav__logout" onClick={handleLogout}>
                        Logout
                    </button>
                    {/* Hamburger */}
                    <button
                        className={`admin-nav__hamburger ${menuOpen ? 'open' : ''}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <div className={`admin-nav__drawer ${menuOpen ? 'admin-nav__drawer--open' : ''}`}>
                <div className="admin-nav__drawer-header">
                    <span className="admin-nav__title">Admin Panel</span>
                    <button className="admin-nav__drawer-close" onClick={() => setMenuOpen(false)}>✕</button>
                </div>
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`admin-nav__drawer-link ${isActive(item.path) ? 'admin-nav__drawer-link--active' : ''}`}
                        onClick={() => setMenuOpen(false)}
                    >
                        <span>{item.icon}</span>
                        {item.label}
                    </Link>
                ))}
                <button className="admin-nav__drawer-logout" onClick={handleLogout}>
                    🚪 Logout
                </button>
            </div>

            {menuOpen && <div className="admin-nav__overlay" onClick={() => setMenuOpen(false)} />}
        </>
    );
};

export default AdminNavbar;