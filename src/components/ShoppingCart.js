// 622
import React, { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import Toast from './Toast';
import CityDropdown from './CityDropdown';
import './ShoppingCart.css';
import nayapayLogo from '../images/nayapay-logo.png';
import easypaissaLogo from '../images/Easypaisa-logo.png';
import bankLogo from '../images/bank-logo.png';


// ── Payment method config ──────────────────────────────────────
const PAYMENT_METHODS = [
  {
    id: 'nayapay',
    label: 'NayaPay',
    color: '#6C3CE1',
    bg: '#f0ebff',
    border: '#c9b8f7',
    logo: nayapayLogo,
    details: [
      { label: 'Account Name', value: 'Umm E Nida' },
      { label: 'NayaPay Number', value: '0332-8249366' },
      { label: 'IBAN', value: 'PK15NAYA1234503328249366' },
    ],
  },
  // {
  //   id: 'easypaisa',
  //   label: 'EasyPaisa',
  //   color: '#2CB34A',
  //   bg: '#e8f8ec',
  //   border: '#a3ddb0',
  //   logo: easypaissaLogo,
  //   details: [
  //     { label: 'Account Name', value: 'Nida Handmade Cards' },
  //     { label: 'EasyPaisa Number', value: '0332-8249366' },
  //     { label: 'Store ID', value: 'EP-2024-NIDA' },
  //   ],
  // },
  {
    id: 'bank',
    label: 'Bank Al Habib',
    color: '#C8102E',
    bg: '#fff0f2',
    border: '#f5b8c0',
    logo: bankLogo,
    details: [
      { label: 'Bank Name', value: 'Bank Al Habib' },
      { label: 'Account Name', value: 'Umm-e-Nida' },
      { label: 'Account Number', value: '1254 0095016730 029' },
      { label: 'IBAN', value: 'PK31BAHL1254009501673002' },
      { label: 'Branch Code', value: '1254-Billys heights' },
    ],
  },
];

const ShoppingCart = () => {
  const API = process.env.REACT_APP_API_URL;
  const { booked, curr, removeItem, decrement_buy, setBooked } = useCurrency();
  const image_temp = `${API}/uploads/`;
  const [details, setDetails] = useState({ name: '', email: '', contact: '', address: '' });
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState('Pakistan');
  const [city, setCity] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('nayapay'); // ← NEW

  useEffect(() => {
    if (city === 'Karachi') setDeliveryFee(200);
    else if (city) setDeliveryFee(400);
    else setDeliveryFee(0);
  }, [city]);

  const updateQuantity = (index, action) => {
    setBooked(prev =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const q = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
        return q <= 0 ? item : { ...item, quantity: q };
      })
    );
  };

  const remove = (index) => { removeItem(index); decrement_buy(); };
  const calculateTotal = () => booked.reduce((t, i) => t + i.price * i.quantity, 0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setToast({ message: 'File size must be less than 10MB', type: 'warning' });
      return;
    }
    setPaymentScreenshot(file);
  };

  const uploadScreenshot = async (file) => {
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch(`${API}/api/admin/uploadScreenshot`, { method: 'POST', body: fd });
    const data = await res.json();
    return data.imageUrl;
  };

  const checkout = async (e) => {
    e.preventDefault();
    const { name, email, contact, address } = details;
    if (!name || !email || !contact || !address) {
      setToast({ message: 'All fields are required', type: 'warning' }); return;
    }
    if (!paymentScreenshot) {
      setToast({ message: 'Payment screenshot is required', type: 'warning' }); return;
    }
    setIsUploading(true);
    try {
      const screenshotUrl = await uploadScreenshot(paymentScreenshot);
      const Ids = [], q = [];
      booked.forEach(el => { Ids.push(el.id); q.push(el.quantity); });
      const res = await fetch(`${API}/api/admin/addOrder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Ids, q, name, email, contact, cc: city, address, paymentScreenshot: screenshotUrl }),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ message: 'Order placed successfully!', type: 'success' });
        setDetails({ name: '', email: '', contact: '', address: '' });
        setCity(''); setPaymentScreenshot(null); setBooked([]);
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setToast({ message: 'Error placing order: ' + json.message, type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Error during checkout. Please try again.', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const handledetails = (e) => setDetails({ ...details, [e.target.name]: e.target.value });
  const closeToast = () => setToast(null);

  const handleContinueToCheckout = () => {
    if (!booked.length) { setToast({ message: 'Your cart is empty', type: 'warning' }); return; }
    setStep(2);
  };

  const handleContinueToPayment = () => {
    if (!city) { setToast({ message: 'Please select a city', type: 'warning' }); return; }
    const { name, email, contact, address } = details;
    if (!name || !email || !contact || !address) {
      setToast({ message: 'Please fill all shipping information', type: 'warning' }); return;
    }
    setStep(3);
  };

  const grandTotal = calculateTotal() + deliveryFee;
  const selectedMethod = PAYMENT_METHODS.find(m => m.id === paymentMethod);

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
      <div className="cart-wrapper">

        {/* Progress Steps */}
        <div className="cart-progress">
          {[
            { label: 'Shopping Cart', icon: 'fa-shopping-cart', n: 1 },
            { label: 'Checkout Info', icon: 'fa-user', n: 2 },
            { label: 'Payment Proof', icon: 'fa-upload', n: 3 },
          ].map((s, idx) => (
            <React.Fragment key={s.n}>
              <div className={`progress-step ${step >= s.n ? 'active' : ''} ${step > s.n ? 'completed' : ''}`}>
                <div className="step-circle">
                  {step > s.n
                    ? <i className="fas fa-check"></i>
                    : <i className={`fas ${s.icon}`}></i>}
                </div>
                <span className="step-label">{s.label}</span>
              </div>
              {idx < 2 && <div className={`progress-line ${step > s.n ? 'active' : ''}`}></div>}
            </React.Fragment>
          ))}
        </div>

        <div className="cart-content">

          {/* ── STEP 1 ─────────────────────────────── */}
          {step === 1 && (
            <div className="cart-main-container">
              <div className="cart-items-section">
                <div className="card-header">
                  <h2>Shopping Cart ({booked.length} items)</h2>
                </div>
                {booked.length === 0 ? (
                  <div className="empty-cart">
                    <i className="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <button className="btn-continue-shopping" onClick={() => window.location.href = '/'}>
                      <i className="fas fa-arrow-left"></i> Continue Shopping
                    </button>
                  </div>
                ) : (
                  <>
                    {booked.map((book, i) => (
                      <div className="cart-item" key={i}>
                        <img src={`${book.image}`} alt={book.title} className="item-image" />
                        <div className="item-details">
                          <h4 className="item-title">{book.title}</h4>
                          <p className="item-price-single">{book.price} {curr} <span>each</span></p>
                          <div className="item-quantity">
                            <span className="qty-label">Qty:</span>
                            <div className="qty-controls">
                              <button onClick={() => updateQuantity(i, 'decrease')} className="qty-btn">−</button>
                              <span className="qty-value">{book.quantity}</span>
                              <button onClick={() => updateQuantity(i, 'increase')} className="qty-btn">+</button>
                            </div>
                          </div>
                        </div>
                        <div className="item-right">
                          <button className="btn-remove" onClick={() => remove(i)}><i className="fas fa-trash"></i></button>
                          <p className="item-total-price">{(book.price * book.quantity).toFixed(2)} {curr}</p>
                        </div>
                      </div>
                    ))}
                    <button className="btn-continue-shopping-inline" onClick={() => window.location.href = '/'}>
                      <i className="fas fa-arrow-left"></i> Continue Shopping
                    </button>
                    <button className="btn-checkout" onClick={handleContinueToCheckout}>
                      Continue to Checkout Info
                    </button>
                  </>
                )}
              </div>

              {booked.length > 0 && (
                <div className="order-summary">
                  <div className="card-header small"><h3>Order Summary</h3></div>
                  {booked.map((book, i) => (
                    <div className="summary-item" key={i}>
                      <img src={`${book.image}`} alt={book.title} />
                      <div className="summary-item-info">
                        <p className="summary-item-title">{book.title}</p>
                        <p className="summary-item-qty">Qty: {book.quantity}</p>
                      </div>
                      <p className="summary-item-price">{(book.price * book.quantity).toFixed(2)} {curr}</p>
                    </div>
                  ))}
                  <div className="summary-totals">
                    <div className="summary-row"><span>Sub-Total</span><span>{calculateTotal().toFixed(2)} {curr}</span></div>
                    <div className="summary-row"><span>Shipping</span><span>{deliveryFee.toFixed(2)} {curr}</span></div>
                    <div className="summary-row total"><span>Total</span><span>{grandTotal.toFixed(2)} {curr}</span></div>
                    <div className="secure-checkout">
                      <i className="fas fa-check-circle"></i>
                      <div className="secure-checkout-text">
                        <p className="secure-title">Secure Checkout</p>
                        <p className="secure-subtitle">Your information is protected</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 2 ─────────────────────────────── */}
          {step === 2 && (
            <div className="cart-main-container">
              <div className="cart-items-section">
                <div className="card-header"><h2>Shipping Information</h2></div>
                <div className="form-section">
                  <div className="section-header"><i className="fas fa-user"></i><h4>Personal Details</h4></div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input type="text" name="name" placeholder="John Doe" value={details.name} onChange={handledetails} className="form-input" />
                    </div>
                    <div className="form-group">
                      <label>Email Address *</label>
                      <div className="input-with-icon">
                        <i className="fas fa-envelope"></i>
                        <input type="email" name="email" placeholder="john@example.com" value={details.email} onChange={handledetails} className="form-input" />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <div className="input-with-icon">
                      <i className="fas fa-phone"></i>
                      <input type="tel" name="contact" placeholder="+92 300 0000000" value={details.contact} onChange={handledetails} className="form-input" />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <div className="section-header"><i className="fas fa-map-marker-alt"></i><h4>Shipping Address</h4></div>
                  <div className="form-group">
                    <label>Country *</label>
                    <select value={country} onChange={e => setCountry(e.target.value)} className="form-select">
                      <option value="Pakistan">Pakistan</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {country === 'Other' && (
                    <div className="info-box warning">
                      <i className="fas fa-exclamation-triangle"></i>
                      <div>
                        <p><strong>International Orders Not Available</strong></p>
                        <p>We currently don't accept online payments outside Pakistan. Please contact us directly.</p>
                      </div>
                    </div>
                  )}
                  {country === 'Pakistan' && (
                    <>
                      <div className="form-group">
                        <label>City *</label>
                        <CityDropdown value={city} onChange={setCity} placeholder="Select your city..." />
                        {city && city !== 'Other' && (
                          <p className="delivery-info">
                            <i className="fas fa-truck"></i>
                            Delivery fee: <strong>{city === 'Karachi' ? 'PKR 200' : 'PKR 400'}</strong>
                          </p>
                        )}
                      </div>
                      <div className="form-group">
                        <label>Street Address *</label>
                        <input type="text" name="address" placeholder="123 Main Street, Apt 4B" value={details.address} onChange={handledetails} className="form-input" />
                      </div>
                    </>
                  )}
                </div>

                <div className="checkout-actions">
                  <button className="btn-secondary" onClick={() => setStep(1)}><i className="fas fa-arrow-left"></i> Previous Step</button>
                  <button className="btn-primary" onClick={handleContinueToPayment} disabled={country === 'Other'}>
                    Continue to Payment Proof <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>

              <div className="order-summary">
                <div className="card-header small"><h3>Order Summary</h3></div>
                {booked.map((book, i) => (
                  <div className="summary-item" key={i}>
                    <img src={`${book.image}`} alt={book.title} />
                    <div className="summary-item-info">
                      <p className="summary-item-title">{book.title}</p>
                      <p className="summary-item-qty">Qty: {book.quantity}</p>
                    </div>
                    <p className="summary-item-price">{(book.price * book.quantity).toFixed(2)} {curr}</p>
                  </div>
                ))}
                <div className="summary-totals">
                  <div className="summary-row"><span>Sub-Total</span><span>{calculateTotal().toFixed(2)} {curr}</span></div>
                  <div className="summary-row"><span>Shipping</span><span>{deliveryFee.toFixed(2)} {curr}</span></div>
                  <div className="summary-row total"><span>Total</span><span>{grandTotal.toFixed(2)} {curr}</span></div>
                  <div className="secure-checkout">
                    <i className="fas fa-check-circle"></i>
                    <div className="secure-checkout-text">
                      <p className="secure-title">Secure Checkout</p>
                      <p className="secure-subtitle">Your information is protected</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3 ─────────────────────────────── */}
          {step === 3 && (
            <div className="cart-main-container">
              <div className="cart-items-section">
                <div className="card-header"><h2>Upload Payment Proof</h2></div>

                {/* Instructions box */}
                <div className="info-box" style={{ margin: '1.5rem 2rem 0' }}>
                  <i className="fas fa-info-circle"></i>
                  <div>
                    <p><strong>Payment Instructions:</strong></p>
                    <ul>
                      <li>Choose your preferred payment method below</li>
                      <li>Make payment using the details shown</li>
                      <li>Take a screenshot of the payment confirmation</li>
                      <li>Upload the screenshot — we'll verify & process your order</li>
                    </ul>
                  </div>
                </div>

                {/* ── Payment Method Selector ── */}
                <div className="pm-section">
                  <p className="pm-heading">Choose Payment Method</p>
                  <div className="pm-options">
                    {PAYMENT_METHODS.map((method) => (
                      <label
                        key={method.id}
                        className={`pm-card ${paymentMethod === method.id ? 'pm-card--selected' : ''}`}
                        style={{
                          '--pm-color': method.color,
                          '--pm-bg': method.bg,
                          '--pm-border': method.border,
                        }}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id)}
                          style={{ display: 'none' }}
                        />
                        {/* Icon circle */}
                        <div className="pm-icon" style={{ backgroundColor: '#fff', border: `2px solid ${method.color}` }}>
                          <img src={method.logo} alt={method.label}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '10px', padding: '4px' }} />
                        </div>
                        <span className="pm-label">{method.label}</span>
                        {/* Selected tick */}
                        {paymentMethod === method.id && (
                          <span className="pm-tick"><i className="fas fa-check"></i></span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* ── Bank Details (dynamic) ── */}
                <div className="payment-details" style={{ borderLeft: `4px solid ${selectedMethod.color}` }}>
                  <div className="pd-header">
                    <div className="pm-icon pm-icon--sm" style={{ backgroundColor: '#fff', border: `2px solid ${selectedMethod.color}` }}>
                      <img src={selectedMethod.logo} alt={selectedMethod.label}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '7px', padding: '3px' }} />
                    </div>
                    <h4>{selectedMethod.label} Payment Details</h4>
                  </div>
                  {selectedMethod.details.map((d, i) => (
                    <div className="detail-row" key={i}>
                      <span className="detail-label">{d.label}:</span>
                      <span className="detail-value">{d.value}</span>
                    </div>
                  ))}
                  <div className="detail-row highlight">
                    <span className="detail-label">Amount to Pay:</span>
                    <span className="detail-value">{grandTotal.toFixed(2)} {curr}</span>
                  </div>
                </div>

                {/* Upload */}
                <div className="upload-section">
                  <label className="upload-label">Upload Payment Screenshot *</label>
                  <div className="upload-area">
                    <input type="file" id="file-upload" accept="image/png,image/jpeg,image/jpg" onChange={handleFileChange} style={{ display: 'none' }} />
                    <label htmlFor="file-upload" className="upload-box">
                      {paymentScreenshot ? (
                        <div className="preview-container">
                          <img src={URL.createObjectURL(paymentScreenshot)} alt="Payment screenshot" className="preview-image" />
                          <button className="btn-change-image" onClick={(e) => { e.preventDefault(); setPaymentScreenshot(null); }}>Change Image</button>
                        </div>
                      ) : (
                        <>
                          <i className="fas fa-cloud-upload-alt"></i>
                          <p className="upload-text">Click to upload payment screenshot</p>
                          <p className="upload-hint">PNG, JPG up to 10MB</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="checkout-actions">
                  <button className="btn-secondary" onClick={() => setStep(2)}><i className="fas fa-arrow-left"></i> Previous Step</button>
                  <button className="btn-primary" onClick={checkout} disabled={isUploading || !paymentScreenshot}>
                    {isUploading ? 'Processing...' : 'Place Order'} <i className="fas fa-check"></i>
                  </button>
                </div>
              </div>

              <div className="order-summary">
                <div className="card-header small"><h3>Order Summary</h3></div>
                {booked.map((book, i) => (
                  <div className="summary-item" key={i}>
                    <img src={`${book.image}`} alt={book.title} />
                    <div className="summary-item-info">
                      <p className="summary-item-title">{book.title}</p>
                      <p className="summary-item-qty">Qty: {book.quantity}</p>
                    </div>
                    <p className="summary-item-price">{(book.price * book.quantity).toFixed(2)} {curr}</p>
                  </div>
                ))}
                <div className="summary-totals">
                  <div className="summary-row"><span>Sub-Total</span><span>{calculateTotal().toFixed(2)} {curr}</span></div>
                  <div className="summary-row"><span>Shipping</span><span>{deliveryFee.toFixed(2)} {curr}</span></div>
                  <div className="summary-row total"><span>Total</span><span>{grandTotal.toFixed(2)} {curr}</span></div>
                  <div className="secure-checkout">
                    <i className="fas fa-check-circle"></i>
                    <div className="secure-checkout-text">
                      <p className="secure-title">Secure Checkout</p>
                      <p className="secure-subtitle">Your information is protected</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default ShoppingCart;