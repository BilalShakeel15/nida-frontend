// 622
import React, { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import Toast from './Toast';
import CityDropdown from './CityDropdown';  // ✅ NEW
import './ShoppingCart.css';

const ShoppingCart = () => {
  const API = process.env.REACT_APP_API_URL;
  const { booked, curr, removeItem, decrement_buy, setBooked } = useCurrency();
  const image_temp = `${API}/uploads/`;
  const [details, setDetails] = useState({ name: "", email: "", contact: "", address: "" });
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState("Pakistan");
  const [city, setCity] = useState("");  // ✅ city state separate
  const [deliveryFee, setDeliveryFee] = useState(0);

  useEffect(() => {
    if (city === "Karachi") {
      setDeliveryFee(200);
    } else if (city && city !== "") {
      setDeliveryFee(400);
    } else {
      setDeliveryFee(0);
    }
  }, [city]);

  const updateQuantity = (index, action) => {
    setBooked(prevBooked => {
      return prevBooked.map((item, i) => {
        if (i === index) {
          const newQuantity = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
          if (newQuantity <= 0) return item;
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const remove = (index) => {
    removeItem(index);
    decrement_buy();
  };

  const calculateTotal = () => {
    return booked.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setToast({ message: 'File size must be less than 10MB', type: 'warning' });
        return;
      }
      setPaymentScreenshot(file);
    }
  };

  const uploadScreenshot = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await fetch(`${API}/api/admin/uploadScreenshot`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      console.error('Error uploading screenshot:', error);
      throw error;
    }
  };

  const checkout = async (e) => {
    e.preventDefault();
    const { name, email, contact, address } = details;

    if (!name || !email || !contact || !address) {
      setToast({ message: 'All fields are required', type: 'warning' });
      return;
    }
    if (!paymentScreenshot) {
      setToast({ message: 'Payment screenshot is required', type: 'warning' });
      return;
    }

    setIsUploading(true);

    try {
      const screenshotUrl = await uploadScreenshot(paymentScreenshot);
      const Ids = [];
      const q = [];
      booked.forEach(element => {
        Ids.push(element.id);
        q.push(element.quantity);
      });

      const response = await fetch(`${API}/api/admin/addOrder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Ids, q, name, email, contact,
          cc: city,
          address,
          paymentScreenshot: screenshotUrl
        })
      });

      const json = await response.json();
      if (json.success) {
        setToast({ message: 'Order placed successfully!', type: 'success' });
        setDetails({ name: "", email: "", contact: "", address: "" });
        setCity("");
        setPaymentScreenshot(null);
        setBooked([]);
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setToast({ message: 'Error placing order: ' + json.message, type: 'error' });
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      setToast({ message: 'Error during checkout. Please try again.', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const handledetails = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const closeToast = () => setToast(null);

  const handleContinueToCheckout = () => {
    if (booked.length === 0) {
      setToast({ message: 'Your cart is empty', type: 'warning' });
      return;
    }
    setStep(2);
  };

  const handleContinueToPayment = () => {
    const { name, email, contact, address } = details;
    if (!city) {
      setToast({ message: 'Please select a city', type: 'warning' });
      return;
    }
    if (!name || !email || !contact || !address) {
      setToast({ message: 'Please fill all shipping information', type: 'warning' });
      return;
    }
    setStep(3);
  };

  const grandTotal = calculateTotal() + deliveryFee;

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
      <div className="cart-wrapper">

        {/* Progress Steps */}
        <div className="cart-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-circle">
              {step > 1 ? <i className="fas fa-check"></i> : <i className="fas fa-shopping-cart"></i>}
            </div>
            <span className="step-label">Shopping Cart</span>
          </div>
          <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-circle">
              {step > 2 ? <i className="fas fa-check"></i> : <i className="fas fa-user"></i>}
            </div>
            <span className="step-label">Checkout Info</span>
          </div>
          <div className={`progress-line ${step >= 3 ? 'active' : ''}`}></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-circle">
              <i className="fas fa-upload"></i>
            </div>
            <span className="step-label">Payment Proof</span>
          </div>
        </div>

        <div className="cart-content">
          {/* STEP 1 */}
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
                    {booked.map((book, index) => (
                      <div className="cart-item" key={index}>
                        <img src={`${image_temp}${book.image}`} alt={book.title} className="item-image" />
                        <div className="item-details">
                          <h4 className="item-title">{book.title}</h4>
                          <p className="item-price-single">{book.price} {curr} <span>each</span></p>
                          <div className="item-quantity">
                            <span className="qty-label">Qty:</span>
                            <div className="qty-controls">
                              <button onClick={() => updateQuantity(index, 'decrease')} className="qty-btn">−</button>
                              <span className="qty-value">{book.quantity}</span>
                              <button onClick={() => updateQuantity(index, 'increase')} className="qty-btn">+</button>
                            </div>
                          </div>
                        </div>
                        <div className="item-right">
                          <button className="btn-remove" onClick={() => remove(index)}>
                            <i className="fas fa-trash"></i>
                          </button>
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
                  {booked.map((book, index) => (
                    <div className="summary-item" key={index}>
                      <img src={`${image_temp}${book.image}`} alt={book.title} />
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
                      <div className='secure-checkout-text'>
                        <p className="secure-title">Secure Checkout</p>
                        <p className="secure-subtitle">Your information is protected</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="cart-main-container">
              <div className="cart-items-section">
                <div className="card-header"><h2>Shipping Information</h2></div>

                <div className="form-section">
                  <div className="section-header">
                    <i className="fas fa-user"></i>
                    <h4>Personal Details</h4>
                  </div>
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
                  <div className="section-header">
                    <i className="fas fa-map-marker-alt"></i>
                    <h4>Shipping Address</h4>
                  </div>

                  <div className="form-group">
                    <label>Country *</label>
                    <select value={country} onChange={e => setCountry(e.target.value)} className="form-select">
                      <option value="Pakistan">Pakistan</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {country === "Other" && (
                    <div className="info-box warning">
                      <i className="fas fa-exclamation-triangle"></i>
                      <div>
                        <p><strong>International Orders Not Available</strong></p>
                        <p>We currently don't accept online payments outside Pakistan. Please contact us directly.</p>
                      </div>
                    </div>
                  )}

                  {country === "Pakistan" && (
                    <>
                      {/* ✅ CityDropdown replaces old <select> */}
                      <div className="form-group">
                        <label>City *</label>
                        <CityDropdown
                          value={city}
                          onChange={(selectedCity) => setCity(selectedCity)}
                          placeholder="Select your city..."
                        />
                        {city && city !== "Other" && (
                          <p className="delivery-info">
                            <i className="fas fa-truck"></i>
                            Delivery fee: <strong>{city === "Karachi" ? "PKR 200" : "PKR 400"}</strong>
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
                  <button className="btn-secondary" onClick={() => setStep(1)}>
                    <i className="fas fa-arrow-left"></i> Previous Step
                  </button>
                  <button className="btn-primary" onClick={handleContinueToPayment} disabled={country === "Other"}>
                    Continue to Payment Proof <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>

              <div className="order-summary">
                <div className="card-header small"><h3>Order Summary</h3></div>
                {booked.map((book, index) => (
                  <div className="summary-item" key={index}>
                    <img src={`${image_temp}${book.image}`} alt={book.title} />
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
                    <div className='secure-checkout-text'>
                      <p className="secure-title">Secure Checkout</p>
                      <p className="secure-subtitle">Your information is protected</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="cart-main-container">
              <div className="cart-items-section">
                <div className="card-header"><h2>Upload Payment Proof</h2></div>

                <div className="info-box">
                  <i className="fas fa-info-circle"></i>
                  <div>
                    <p><strong>Payment Instructions:</strong></p>
                    <ul>
                      <li>Make payment to our account using your preferred method</li>
                      <li>Take a screenshot of the payment confirmation</li>
                      <li>Upload the screenshot below</li>
                      <li>We'll verify your payment and process your order</li>
                    </ul>
                  </div>
                </div>

                <div className="payment-details">
                  <h4>Our Payment Details:</h4>
                  <div className="detail-row"><span className="detail-label">Bank Name:</span><span className="detail-value">ABC Bank</span></div>
                  <div className="detail-row"><span className="detail-label">Account Name:</span><span className="detail-value">Nida Handmade Cards</span></div>
                  <div className="detail-row"><span className="detail-label">Account Number:</span><span className="detail-value">1234 5678 9012 3456</span></div>
                  <div className="detail-row highlight"><span className="detail-label">Amount to Pay:</span><span className="detail-value">{grandTotal.toFixed(2)} {curr}</span></div>
                </div>

                <div className="upload-section">
                  <label className="upload-label">Upload Payment Screenshot *</label>
                  <div className="upload-area">
                    <input type="file" id="file-upload" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} style={{ display: 'none' }} />
                    <label htmlFor="file-upload" className="upload-box">
                      {paymentScreenshot ? (
                        <div className="preview-container">
                          <img src={URL.createObjectURL(paymentScreenshot)} alt="Payment screenshot" className="preview-image" />
                          <button className="btn-change-image" onClick={(e) => { e.preventDefault(); setPaymentScreenshot(null); }}>
                            Change Image
                          </button>
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
                  <button className="btn-secondary" onClick={() => setStep(2)}>
                    <i className="fas fa-arrow-left"></i> Previous Step
                  </button>
                  <button className="btn-primary" onClick={checkout} disabled={isUploading || !paymentScreenshot}>
                    {isUploading ? 'Processing...' : 'Place Order'} <i className="fas fa-check"></i>
                  </button>
                </div>
              </div>

              <div className="order-summary">
                <div className="card-header small"><h3>Order Summary</h3></div>
                {booked.map((book, index) => (
                  <div className="summary-item" key={index}>
                    <img src={`${image_temp}${book.image}`} alt={book.title} />
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
                    <div className='secure-checkout-text'>
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