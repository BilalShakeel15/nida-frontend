import React, { useEffect, useState } from 'react'
import logo from '../images/nida logo.png'
import '../App.css'
import { Link, useNavigate } from 'react-router-dom'
import { useCurrency } from '../context/CurrencyContext';
import wishlistIcon from "../images/wishlistIcon.png";
import cartIcon from "../images/cartIcon.png";


const Top = () => {
  const API = process.env.REACT_APP_API_URL;
  const { buy, booked, wishlistCount, fetchWishlist, logout_wishlist } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const navigate_to_shop = useNavigate();
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem('token');

  const handleNavigation = (item) => {
    localStorage.setItem('item', item.name);
    navigate_to_shop('/shop');
    setMenuOpen(false);
  }

  const check_logout = () => {
    localStorage.removeItem('admin');
    navigate('/');
    setMenuOpen(false);
  }

  const user_logout = () => {
    localStorage.removeItem('token');
    logout_wishlist();
    setUser(null);
    navigate('/');
    setMenuOpen(false);
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const searchitem = () => {
    navigate('/shop', { state: { searchTerm } });
    setMenuOpen(false);
  }

  // Close menu on route change
  const handleLinkClick = () => {
    setMenuOpen(false);
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API}/api/admin/getcategory`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const json = await response.json();
        setCategories(json);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (token) {
      const checkUser = async () => {
        try {
          const response = await fetch(`${API}/api/auth/getuser`, {
            headers: { 'auth-token': token }
          });
          const data = await response.json();
          if (data.success) setUser(data.user);
        } catch (error) {
          console.error('Error checking user:', error);
          localStorage.removeItem('token');
        }
      };
      checkUser();
      fetchWishlist();
    }
  }, [token]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);
  const handleAboutClick = () => {
    setMenuOpen(false);
    if (window.location.pathname === '/') {
      // Same page — sirf scroll karo
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Doosra page — pehle home pe jao, phir scroll
      navigate('/');
      setTimeout(() => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      }, 400); // wait for page to load
    }
  };

  return (
    <>
      {!localStorage.getItem('admin') ? (
        <div className='fixed-top'>

          {/* ===== DESKTOP NAVBAR ===== */}
          <nav className="navbar navbar-expand-lg navbar-top d-none d-lg-flex" style={{ backgroundColor: "#FFC3C3" }}>
            <div className="container-fluid">
              <div className="collapse navbar-collapse justify-content-between show">
                {/* Left links */}
                <ul className="navbar-nav d-flex gap-3">
                  <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                  <li className="nav-item">
                    <span className="nav-link" style={{ cursor: 'pointer' }} onClick={() => handleAboutClick()}>About Us</span>
                  </li>
                  <li className="nav-item"><Link className="nav-link" to="/categorydisplay">Shop</Link></li>
                  <li className="nav-item"><Link className="nav-link" to="/contact">Contact</Link></li>
                </ul>

                {/* Center logo */}
                <div className="mx-auto text-center">
                  <Link to="/" className="navbar-brand d-flex align-items-center justify-content-center"
                    style={{ fontFamily: "Amatic SC", fontWeight: "bold", fontSize: "28px" }}>
                    <img src={logo} alt="Nida Logo" style={{ height: "62px" }} className="me-2" />
                    NIDA CRAFTERIA
                  </Link>
                </div>

                {/* Right icons */}
                <ul className="navbar-nav d-flex align-items-center gap-3">
                  <li className="nav-item icon-item">
                    <Link to="/wishlist" className="icon-link">
                      <img src={wishlistIcon} alt="Wishlist" />
                      {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
                    </Link>
                  </li>
                  <li className="nav-item icon-item">
                    <Link to="/shoppingcart" className="icon-link">
                      <img src={cartIcon} alt="Cart" />
                      {buy > 0 && <span className="badge">{buy}</span>}
                    </Link>
                  </li>
                  {!user ? (
                    <>
                      <li className="nav-item">
                        <Link to="/login" className="nav-link">
                          <button className="btn px-3 d-flex justify-content-center"
                            style={{ width: "98px", height: "36px", fontSize: "16px", fontFamily: "Inter", backgroundColor: "#d4358c", color: "white", border: "2px solid #d4358c", position: "relative", left: "4px" }}>
                            Sign In
                          </button>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/signup" className="nav-link">
                          <button className="btn px-3 d-flex justify-content-center"
                            style={{ width: "98px", height: "36px", fontSize: "16px", fontFamily: "Inter", color: "black", border: "1px solid white" }}>
                            Sign Up
                          </button>
                        </Link>
                      </li>
                    </>
                  ) : (
                    <li className="nav-item d-flex align-items-center">
                      <span className="me-2">Welcome, {user.name}</span>
                      <button className="btn btn-sm" onClick={user_logout}
                        style={{ width: "98px", height: "35px", fontSize: "16px", fontFamily: "Inter", backgroundColor: "#b71c6c", color: "white", marginLeft: "0.5rem" }}>
                        Logout
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </nav>

          {/* ===== MOBILE NAVBAR ===== */}
          <nav className="d-flex d-lg-none align-items-center justify-content-between px-3 py-2"
            style={{ backgroundColor: "#FFC3C3", height: "56px" }}>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                zIndex: 1100,
              }}
              aria-label="Toggle menu"
            >
              <span style={{
                display: 'block', width: '24px', height: '2px',
                backgroundColor: '#333',
                transition: 'all 0.3s ease',
                transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
              }} />
              <span style={{
                display: 'block', width: '24px', height: '2px',
                backgroundColor: '#333',
                transition: 'all 0.3s ease',
                opacity: menuOpen ? 0 : 1
              }} />
              <span style={{
                display: 'block', width: '24px', height: '2px',
                backgroundColor: '#333',
                transition: 'all 0.3s ease',
                transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
              }} />
            </button>

            {/* Mobile Logo */}
            <Link to="/" onClick={handleLinkClick}
              style={{ fontFamily: "Amatic SC", fontWeight: "bold", fontSize: "18px", textDecoration: "none", color: "#333", display: "flex", alignItems: "center" }}>
              <img src={logo} alt="Nida Logo" style={{ height: "36px" }} className="me-2" />
              NIDA CRAFTERIA
            </Link>

            {/* Mobile cart icons */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <Link to="/wishlist" onClick={handleLinkClick} className="icon-link">
                <img src={wishlistIcon} alt="Wishlist" />
                {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
              </Link>
              <Link to="/shoppingcart" onClick={handleLinkClick} className="icon-link">
                <img src={cartIcon} alt="Cart" />
                {buy > 0 && <span className="badge">{buy}</span>}
              </Link>
            </div>
          </nav>

          {/* ===== FULLSCREEN MOBILE MENU OVERLAY ===== */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#FFC3C3',
            zIndex: 1050,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '2rem',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? 'translateY(0)' : 'translateY(-20px)',
            pointerEvents: menuOpen ? 'all' : 'none',
          }}>

            {/* Close button */}
            {/* <button
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '28px',
                cursor: 'pointer',
                color: '#333',
                lineHeight: 1,
              }}
            >
              ✕
            </button> */}

            {/* Logo inside overlay */}
            <Link to="/" onClick={handleLinkClick}
              style={{ fontFamily: "Amatic SC", fontWeight: "bold", fontSize: "26px", textDecoration: "none", color: "#333", display: "flex", alignItems: "center", marginBottom: "1rem" }}>
              <img src={logo} alt="Nida Logo" style={{ height: "48px" }} className="me-2" />
              NIDA CRAFTERIA
            </Link>

            {/* Nav links */}
            {[
              { label: 'Home', to: '/' },
              // { label: 'About Us', to: '/#about' },
              { label: 'Shop', to: '/categorydisplay' },
              { label: 'Contact', to: '/contact' },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={handleLinkClick}
                style={{
                  textDecoration: 'none',
                  color: '#2e2e2e',
                  fontSize: '1.6rem',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: '600',
                  letterSpacing: '0.02em',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={e => e.target.style.color = '#d4358c'}
                onMouseLeave={e => e.target.style.color = '#2e2e2e'}
              >
                {item.label}
              </Link>
            ))}
            {/* About Us — separate because it uses onClick scroll */}
            <span
              onClick={handleAboutClick}
              style={{
                textDecoration: 'none',
                color: '#2e2e2e',
                fontSize: '1.6rem',
                fontFamily: 'Inter, sans-serif',
                fontWeight: '600',
                letterSpacing: '0.02em',
                cursor: 'pointer',
              }}
              onMouseEnter={e => e.target.style.color = '#d4358c'}
              onMouseLeave={e => e.target.style.color = '#2e2e2e'}
            >
              About Us
            </span>


            {/* Auth buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
              {!user ? (
                <>
                  <Link to="/login" onClick={handleLinkClick}>
                    <button style={{
                      width: '160px', height: '44px', fontSize: '16px',
                      fontFamily: 'Inter', backgroundColor: '#d4358c',
                      color: 'white', border: 'none', borderRadius: '8px',
                      cursor: 'pointer'
                    }}>
                      Sign In
                    </button>
                  </Link>
                  <Link to="/signup" onClick={handleLinkClick}>
                    <button style={{
                      width: '160px', height: '44px', fontSize: '16px',
                      fontFamily: 'Inter', backgroundColor: '#FFC3C3',
                      color: '#333', border: '1px solid white', borderRadius: '8px',
                      cursor: 'pointer'
                    }}>
                      Sign Up
                    </button>
                  </Link>
                </>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontFamily: 'Inter', fontSize: '1rem', marginBottom: '0.75rem' }}>
                    Welcome, <strong>{user.name}</strong>
                  </p>
                  <button onClick={user_logout} style={{
                    width: '160px', height: '44px', fontSize: '16px',
                    fontFamily: 'Inter', backgroundColor: '#b71c6c',
                    color: 'white', border: 'none', borderRadius: '8px',
                    cursor: 'pointer'
                  }}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      ) : ("")}
    </>
  )
}

export default Top