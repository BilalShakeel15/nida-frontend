import React, { useState } from 'react';
import Toast from './Toast';
import './Contact.css';

const Contact = () => {
  const API = process.env.REACT_APP_API_URL;
  const [toast, setToast] = useState(null);
  const [credit, setCredit] = useState({ name: "", email: "", msg: "" });

  const closeToast = () => setToast(null);

  const onchange = (e) => {
    setCredit({ ...credit, [e.target.name]: e.target.value });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    const { name, email, msg } = credit;

    if (!name || !email || !msg) {
      setToast({ message: "All fields are required", type: "warning" });
      return;
    }

    try {
      const response = await fetch(`${API}/api/msg/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credit),
      });

      if (!response.ok) throw new Error("Network error");
      const data = await response.json();

      if (data.success) {
        setToast({ message: "Message sent! We'll get back to you soon ✦", type: "success" });
        setCredit({ name: "", email: "", msg: "" });
      } else {
        setToast({ message: data.message || "Something went wrong", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: "Could not send. Please try again.", type: "error" });
    }
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      <div className="navbar-space"></div>

      <div className="contact-page">

        {/* ════ HERO ════ */}
        <section className="contact-hero">

          {/* Left — heading */}
          <div className="contact-hero-left">
            <span className="hero-eyebrow">✦ Nida Handmade Cards</span>
            <h1>Let's <em>talk</em><br />flowers &amp; cards</h1>
            <p>
              Custom orders, gifting questions, or just a hello —
              we'd love to hear from you. Every message is read with care.
            </p>
          </div>

          {/* Right — decorative stats */}
          <div className="contact-hero-right">
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-number">24h</span>
                <span className="hero-stat-label">Response time</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <span className="hero-stat-number">100%</span>
                <span className="hero-stat-label">Handmade</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <span className="hero-stat-number">♥</span>
                <span className="hero-stat-label">Made with love</span>
              </div>
            </div>
          </div>

        </section>

        {/* ════ MAIN ════ */}
        <div className="contact-main">

          {/* ── Info Panel ── */}
          <aside className="contact-info-panel">

            <div className="info-section-label">Contact Details</div>

            <div className="contact-detail-row">
              <div className="detail-icon-wrap">
                <i className="fas fa-envelope"></i>
              </div>
              <div>
                <span className="detail-label">Email</span>
                <span className="detail-value">hello@nidahandmade.com</span>
              </div>
            </div>

            <div className="contact-detail-row">
              <div className="detail-icon-wrap">
                <i className="fab fa-instagram"></i>
              </div>
              <div>
                <span className="detail-label">Instagram</span>
                <span className="detail-value">@nidahandmadecards</span>
              </div>
            </div>

            <div className="contact-detail-row">
              <div className="detail-icon-wrap">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div>
                <span className="detail-label">Location</span>
                <span className="detail-value">Karachi, Pakistan</span>
              </div>
            </div>

            <div className="contact-detail-row">
              <div className="detail-icon-wrap">
                <i className="fas fa-clock"></i>
              </div>
              <div>
                <span className="detail-label">Response Time</span>
                <span className="detail-value">Within 24 hours</span>
              </div>
            </div>

            {/* Decorative quote */}
            <div className="contact-quote">
              <p>Every card is made with intention — just like your message to us.</p>
              <cite>— Nida</cite>
            </div>

          </aside>

          {/* ── Form Panel ── */}
          <section className="contact-form-panel">

            <div className="form-panel-header">
              <h2>Send us a message</h2>
              <p>We read every single one. Fill in below and we'll be in touch.</p>
            </div>

            <form className="cf-form" onSubmit={handlesubmit}>

              <div className="cf-row">
                <div className="cf-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={credit.name}
                    onChange={onchange}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="cf-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={credit.email}
                    onChange={onchange}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="cf-field">
                <label>Message</label>
                <textarea
                  name="msg"
                  value={credit.msg}
                  onChange={onchange}
                  rows={6}
                  placeholder="Tell us about your order, custom card idea, or anything on your mind..."
                  required
                />
              </div>

              <div className="cf-checkbox">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">I agree to the terms and conditions</label>
              </div>

              <div className="cf-submit">
                <button type="submit" className="send-btn">
                  Send Message
                  <i className="fas fa-paper-plane"></i>
                </button>
                <span className="submit-note">
                  <i className="fas fa-lock"></i>
                  Your info is safe with us
                </span>
              </div>

            </form>
          </section>

        </div>
      </div>
    </>
  );
};

export default Contact;