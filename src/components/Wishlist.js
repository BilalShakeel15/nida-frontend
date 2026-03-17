import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../context/CurrencyContext";
import "./Allproducts.css";

const Wishlist = () => {
    const API = process.env.REACT_APP_API_URL;
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredImageIndexes, setHoveredImageIndexes] = useState({});
    const [hoveredCard, setHoveredCard] = useState(null);

    const { convertedPrice, curr, update_buy, update_booked, decrement_wishlist } = useCurrency();
    const navigate = useNavigate();

    const host = API;
    const imageBase = `${API}/uploads/`;
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        fetchWishlist();
    }, [token]);

    const fetchWishlist = async () => {
        try {
            const res = await fetch(`${host}/api/wishlist/get`, {
                headers: { "auth-token": token },
            });
            const data = await res.json();
            if (data.success) setWishlist(data.wishlist);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const res = await fetch(`${host}/api/wishlist/remove/${productId}`, {
                method: "DELETE",
                headers: { "auth-token": token },
            });
            const data = await res.json();
            if (data.success) {
                setWishlist(wishlist.filter((p) => p._id !== productId));
                decrement_wishlist();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleMouseEnter = (id) => {
        setHoveredImageIndexes((prev) => ({ ...prev, [id]: 1 }));
    };

    const handleMouseLeave = (id) => {
        setHoveredImageIndexes((prev) => ({ ...prev, [id]: 0 }));
    };

    const handleView = (e, product) => {
        e.stopPropagation();
        navigate("/productinfo", { state: { product } });
    };

    const handleCart = (e, product) => {
        e.stopPropagation();
        update_buy();
        update_booked(product._id, product.title, product.price, product.images[0]);
    };

    if (loading) {
        return (
            <div className="container text-center" style={{ marginTop: "6rem" }}>
                <div className="spinner-border" />
            </div>
        );
    }

    return (
        <div className="wishlist-page">
            {/* Heading */}
            <div className="wishlist-header">
                <h1 className="shop-heading">My Wishlist</h1>
                <div className="wishlist-underline"></div>
            </div>

            {wishlist.length === 0 ? (
                <div className="text-center" style={{ padding: '2rem' }}>
                    <h3>Your wishlist is empty</h3>
                    <button
                        className="btn btn-primary mt-3"
                        style={{ backgroundColor: '#d4358c', border: 'none' }}
                        onClick={() => navigate("/shop")}
                    >
                        Go Shopping
                    </button>
                </div>
            ) : (
                <div className="new-card-container">
                    {wishlist.map((product) => (
                        <div
                            className="new-product-card"
                            key={product._id}
                            onMouseEnter={() => setHoveredCard(product._id)}
                            onMouseLeave={() => setHoveredCard(null)}
                            onClick={() => navigate("/productinfo", { state: { product } })}
                        >
                            <div className="product-image-wrapper">
                                <img
                                    src={`${imageBase}${product.images[hoveredImageIndexes[product._id] || 0]}`}
                                    alt={product.title}
                                    className="product-main-image"
                                    onMouseEnter={() => handleMouseEnter(product._id)}
                                    onMouseLeave={() => handleMouseLeave(product._id)}
                                />

                                <button
                                    className="wishlist-btn"
                                    title="Remove from wishlist"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFromWishlist(product._id);
                                    }}
                                >
                                    <i className="fas fa-trash"></i>
                                </button>

                                <span className="product-badge">Saved</span>

                                {hoveredCard === product._id && (
                                    <div className="hover-overlay">
                                        <div className="action-buttons">
                                            <button
                                                className="action-btn view-btn"
                                                onClick={(e) => handleView(e, product)}
                                            >
                                                <i className="far fa-eye"></i>
                                            </button>
                                            <button
                                                className="action-btn cart-btn"
                                                onClick={(e) => handleCart(e, product)}
                                            >
                                                <i className="fas fa-shopping-cart"></i>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="product-info">
                                <p className="product-category">{product.category}</p>
                                <h3 className="product-title">{product.title}</h3>
                                <p className="product-price">{convertedPrice(product.price)} {curr}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;