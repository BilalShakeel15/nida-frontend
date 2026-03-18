import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPinterest,
  FaXTwitter,
} from "react-icons/fa6";
import logo from '../images/nida logo.png';

const Footer = () => {
  const navigate = useNavigate();

  const handleAboutClick = () => {
    if (window.location.pathname === '/') {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    }
  };

  const handleCategoryClick = (categoryName) => {
    localStorage.setItem('item', categoryName);
    navigate('/shop');
  };

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Left Section */}
        <div className="footer-left">
          <div className="footer-logo">
            <img src={logo} alt="Nida Handmade Cards" />
            <h3>NIDA CRAFTERIA</h3>
          </div>
          <p>
            Nida CRAFTERIA is your creative companion for all things crafty.
            From handmade flowers to die cuts, every piece is designed to help
            you create memories that last.
          </p>

          <div className="footer-socials">
            <a href="https://x.com/nida_tanweer" target="_blank" rel="noreferrer"><FaXTwitter /></a>
            <a href="https://www.facebook.com/nidahandmadeflowers?mibextid=ZbWKwL" target="_blank" rel="noreferrer"><FaFacebookF /></a>
            <a href="https://www.instagram.com/nidaflowers?igsh=OWJnOTI5MHRjM3No" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://www.linkedin.com/in/nida-tanweer-a59246254/" target="_blank" rel="noreferrer"><FaLinkedinIn /></a>
            <a href="https://www.pinterest.com/uenida/" target="_blank" rel="noreferrer"><FaPinterest /></a>
          </div>

          <button className="shop-btn footer-cta" onClick={() => navigate("/categorydisplay")}>
            Shop Now
          </button>
        </div>

        {/* Right Section — Desktop only full, mobile compact */}
        <div className="footer-links">
          <div>
            <h4>Company</h4>
            <Link to="/">Home</Link>
            <span className="footer-link-btn" onClick={handleAboutClick}>About Us</span>
            <Link to="/categorydisplay">Shop</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div>
            <h4>Support</h4>
            <Link to="/contact">Contact us</Link>
            <Link to="/blogs">Blogs</Link>
          </div>

          <div className="footer-shop-col">
            <h4>Shop</h4>
            <span className="footer-link-btn" onClick={() => handleCategoryClick('Flowers')}>Flowers</span>
            <span className="footer-link-btn" onClick={() => handleCategoryClick('Glitters')}>Glitters</span>
            <span className="footer-link-btn" onClick={() => handleCategoryClick('Embellishments')}>Embellishments</span>
            <span className="footer-link-btn" onClick={() => handleCategoryClick('Shakers')}>Shakers</span>
            <span className="footer-link-btn" onClick={() => handleCategoryClick('Envelopes')}>Envelopes</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-container">
          © Nida Crafteria. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;