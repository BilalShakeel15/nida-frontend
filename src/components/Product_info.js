import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import productContext from '../context/products/productContext';
import { useCurrency } from '../context/CurrencyContext';
import Toast from './Toast';
import './Product_info.css';
import ScrollToTop from './ScrollToTop';

const ProductInfo = () => {
  const API = process.env.REACT_APP_API_URL;
  const { curr, setCurr, convertedPrice, update_buy, update_booked, increment_wishlist, decrement_wishlist } = useCurrency();
  const host = API;
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const location = useLocation();
  const { product } = location.state || {};
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [hoveredImageIndexes, setHoveredImageIndexes] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
  const token = localStorage.getItem('token');
  console.log(product);


  const { products, Allproducts } = useContext(productContext);

  const handleMouseEnter = (productId) => {
    setHoveredImageIndexes(prevState => ({
      ...prevState,
      [productId]: 1,
    }));
  };



  const handleMouseLeave = (productId) => {
    setHoveredImageIndexes(prevState => ({
      ...prevState,
      [productId]: 0,
    }));
  };

  const handleViewProduct = (e, productId) => {
    e.stopPropagation();
    info(productId);
  };
  // const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth" // or "smooth"
    });
  }, [product]);
  useEffect(() => {
    const fetchProducts = async () => {
      await Allproducts();
    };
    fetchProducts();

    // Check if product is in wishlist if user is logged in
    if (token && product) {
      checkWishlistStatus();
    }
  }, [product, token]);

  const checkWishlistStatus = async () => {
    if (!token || !product) return;

    try {
      const response = await fetch(`${host}/api/wishlist/check/${product._id}`, {
        headers: {
          'auth-token': token
        }
      });
      const data = await response.json();
      setIsInWishlist(data.isInWishlist);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const toggleWishlist = async () => {
    if (!token) {
      setToast({ message: 'Please login to add products to wishlist', type: 'warning' });
      return;
    }

    setIsLoading(true);
    try {
      if (isInWishlist) {
        await fetch(`${host}/api/wishlist/remove/${product._id}`, {
          method: 'DELETE',
          headers: {
            'auth-token': token
          }
        });
        setIsInWishlist(false);
        decrement_wishlist();
      } else {
        await fetch(`${host}/api/wishlist/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token
          },
          body: JSON.stringify({ productId: product._id })
        });
        setIsInWishlist(true);
        increment_wishlist();
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      setToast({ message: 'Error updating wishlist. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // const image_temp = `${API}/uploads/`;
  const [mainImage, setMainImage] = useState(`${product?.images[0]}`);
  useEffect(() => {
    setMainImage(`${product?.images[0]}`);
    setActiveThumb(0); // reset active thumbnail
  }, [product]);
  const handleThumbnailClick = (image, index) => {
    setMainImage(`${image}`);
    setActiveThumb(index);
  };

  if (!product) {
    return <div>No product data available</div>;
  }

  const similarProducts = products.filter(p => p.category === product.category && p._id !== product._id);

  const info = async (id) => {
    const response = await fetch(`${host}/api/product/getproduct/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    const product = json.get_product;

    navigate('/productinfo', { state: { product } });
  };

  const handlecart = (e, id, title, price, image) => {
    e.stopPropagation();
    update_buy();
    update_booked(id, title, convertedPrice(price), image);
  };

  const handleAddToCart = () => {
    update_buy();
    update_booked(product._id, product.title, convertedPrice(product.price), product.images[0]);
    setToast({ message: 'Product added to cart!', type: 'success' });
  };

  const incrementQty = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const closeToast = () => {
    setToast(null);
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
      <div className="pi-wrapper">
        <div className="pi-main">
          {/* Left Image Section */}
          <div className="pi-gallery">
            <div className="pi-main-img-wrapper">
              <img src={mainImage} className="pi-main-img" alt={product.title} />

              {/* Wishlist Heart Button */}
              {/* <button
                className="pi-wishlist-btn"
                onClick={toggleWishlist}
                disabled={isLoading}
              >
                <i className={isInWishlist ? "fas fa-heart" : "far fa-heart"}></i>
              </button> */}

              {/* Bestseller Badge */}
              {product.tag && (
                <span
                  className="product-badge"
                  style={{
                    background:
                      product.tag === 'New' ? '#22c55e' :
                        product.tag === 'Popular' ? '#f97316' :
                          product.tag === 'Limited' ? '#ef4444' :
                            product.tag === 'Sale' ? '#d4358c' : '#999'
                  }}
                >
                  {product.tag}
                </span>
              )}
            </div>

            <div className="pi-thumbs">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  className={`pi-thumb-wrapper ${activeThumb === i ? 'active' : ''}`}
                  onClick={() => handleThumbnailClick(img, i)}
                >
                  <img
                    src={img}
                    className="pi-thumb"
                    alt={`${product.title} ${i + 1}`}
                  />
                </div>
              ))}
            </div>
            {/* Feature Cards */}
            <div className="pi-features">
              <div className="pi-feature-card">
                <i className="fas fa-shipping-fast"></i>
                <div className="pi-feature-title">Free Shipping</div>
                <div className="pi-feature-desc">On orders over $50</div>
              </div>
              <div className="pi-feature-card">
                <i className="fas fa-award"></i>
                <div className="pi-feature-title">Quality Assured</div>
                <div className="pi-feature-desc">100% handmade</div>
              </div>
              <div className="pi-feature-card">
                <i className="fas fa-undo"></i>
                <div className="pi-feature-title">Easy Returns</div>
                <div className="pi-feature-desc">30-day guarantee</div>
              </div>
            </div>
          </div>

          {/* Right Info Section */}
          <div className="pi-details">
            <span className="pi-tag">Handmade Flowers</span>
            <h1 className="pi-title">{product.title}</h1>

            {/* <div className="pi-rating">
              <div className="pi-stars">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <span className="pi-rating-text">4.9</span>
              <span className="pi-rating-count">(127 reviews)</span>
            </div> */}

            <p className="pi-desc">{product.description}</p>

            {/* Replace karo yeh pura div: */}
            <div className="pi-price-section">
              <div className="pi-price-main">
                {product.salePrice ? (
                  <>
                    <span className="pi-price">Rs. {convertedPrice(product.salePrice)}</span>
                    <span className="pi-old">Rs. {convertedPrice(product.price)}</span>
                    <span className="pi-save">
                      Save {Math.round((1 - product.salePrice / product.price) * 100)}%
                    </span>
                  </>
                ) : (
                  <span className="pi-price">Rs. {convertedPrice(product.price)}</span>
                )}
              </div>
              <div className="pi-stock-status">Ready to ship</div>
            </div>

            <h4 className="pi-highlights-title">Product Highlights:</h4>
            <ul className="pi-highlights">
              {(product?.highlights && product.highlights.length > 0
                ? product.highlights
                : [
                  "100% handcrafted with premium materials",
                  "Set includes 6 beautiful paper roses",
                  "Perfect for decorations and gifts",
                  "Durable and long-lasting",
                  "Made with love and attention to detail"
                ]
              ).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>


            {/* Quantity Section */}
            <div className="pi-qty-row">
              <span className="pi-qty-text">Quantity (packets):</span>

              <div className="pi-qty-pill">
                <button className="pi-pill-btn minus" onClick={decrementQty}>−</button>
                <span className="pi-pill-value">{quantity}</span>
                <button className="pi-pill-btn plus" onClick={incrementQty}>+</button>
              </div>

              <span className="pi-total-text">
                Total: <strong>Rs. {(convertedPrice(product.price) * quantity).toFixed(0)}</strong>
              </span>
            </div>


            {/* Buttons */}
            <div className="pi-buttons">
              <button className="pi-cart-btn" onClick={handleAddToCart}>
                <i className="fas fa-shopping-cart"></i>
                Add to Cart
              </button>
              <button
                className="pi-wishlist-btn-bottom"
                onClick={toggleWishlist}
                disabled={isLoading}
              >
                <i className={isInWishlist ? "fas fa-heart" : "far fa-heart"}></i>
              </button>
            </div>

            <button className="pi-buy-btn" onClick={() => {
              update_buy();
              update_booked(product._id, product.title, convertedPrice(product.salePrice || product.price), product.images[0]);
              navigate('/shoppingcart');
            }}>
              Buy Now
            </button>

            {/* Trust Badges */}
            <div className="pi-badges">
              <div className="pi-badge-item ">
                <i className="fas fa-check-circle secure-payment"></i>
                Secure Payment
              </div>
              <div className="pi-badge-item">
                <i className="fas fa-shield-alt verified-seller"></i>
                Verified Seller
              </div>
              <div className="pi-badge-item">
                <i className="fas fa-star top-rated"></i>
                Top Rated
              </div>
            </div>
          </div>
        </div>



        {/* Similar Products */}
        <h2 className="pi-similar-title">Similar Products</h2>
        <div className="new-card-container">
          {similarProducts.slice(0, 4).map(p => (
            <div
              className="new-product-card"
              key={p._id}
              onMouseEnter={() => setHoveredCard(p._id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => info(p._id)}
            >
              <div className="product-image-wrapper">
                <img
                  src={`${p.images[hoveredImageIndexes[p._id] || 0]}`}
                  alt={p.title}
                  className="product-main-image"
                  onMouseEnter={() => handleMouseEnter(p._id)}
                  onMouseLeave={() => handleMouseLeave(p._id)}
                />

                <button
                  className="wishlist-btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <i className="far fa-heart"></i>
                </button>

                {/* <span className="product-badge">New</span> ko replace karo: */}
                {p.tag && (
                  <span className="product-badge" style={{
                    background:
                      p.tag === 'New' ? '#22c55e' :
                        p.tag === 'Popular' ? '#f97316' :
                          p.tag === 'Limited' ? '#ef4444' :
                            p.tag === 'Sale' ? '#d4358c' : '#999'
                  }}>
                    {p.tag}
                  </span>
                )}

                {hoveredCard === p._id && (
                  <div className="hover-overlay">
                    <div className="action-buttons">
                      <button
                        className="action-btn view-btn"
                        onClick={(e) => handleViewProduct(e, p._id)}
                        title="Quick View"
                      >
                        <i className="far fa-eye"></i>
                      </button>
                      <button
                        className="action-btn cart-btn"
                        onClick={(e) => handlecart(e, p._id, p.title, p.price, p.images[0])}
                        title="Add to Cart"
                      >
                        <i className="fas fa-shopping-cart"></i>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="product-info">
                <p className="product-category">{p.category || 'Flowers'}</p>
                <h3 className="product-title">{p.title}</h3>
                {/* Price replace karo: */}
                {p.salePrice ? (
                  <div className="product-price-wrap">
                    <span className="product-price-original">{convertedPrice(p.price)} {curr}</span>
                    <span className="product-price product-price-sale">{convertedPrice(p.salePrice)} {curr}</span>
                  </div>
                ) : (
                  <p className="product-price">{convertedPrice(p.price)} {curr}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductInfo;