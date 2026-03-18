//214
import React, { useContext, useEffect, useState } from 'react';
import productContext from '../context/products/productContext';
import { useLocation, useNavigate } from 'react-router-dom';
import CurrencyDropdown from './CurrencyDropdown';
import { useCurrency } from '../context/CurrencyContext';
import './Allproducts.css';

const Shop = () => {
    const API = process.env.REACT_APP_API_URL;
    const location = useLocation();
    const { searchTerm } = location.state || {};
    const { curr, setCurr, convertedPrice, update_buy, update_booked } = useCurrency();
    const host = API;
    const item = localStorage.getItem('item');
    const navigate = useNavigate();
    const { products, Allproducts, deleteProduct } = useContext(productContext);
    const [hoveredImageIndexes, setHoveredImageIndexes] = useState({});
    const [hoveredCard, setHoveredCard] = useState(null);
    const [rates, setRates] = useState({});
    const [sortOption, setSortOption] = useState('default');
    const [searchQuery, setSearchQuery] = useState('');

    const handleMouseEnter = (productId) => {
        setHoveredImageIndexes(prevState => ({ ...prevState, [productId]: 1 }));
    };

    const handleMouseLeave = (productId) => {
        setHoveredImageIndexes(prevState => ({ ...prevState, [productId]: 0 }));
    };

    useEffect(() => {
        const fetchProducts = async () => { await Allproducts(); };
        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchRates = async () => {
            const ratesResponse = await fetch('https://api.exchangerate-api.com/v4/latest/PKR');
            const ratesData = await ratesResponse.json();
            setRates(ratesData.rates);
        };
        fetchRates();
    }, []);

    const filteredProducts = products
        .filter(product => {
            const categoryMatch = searchTerm
                ? product.category.toLowerCase().includes(searchTerm.toLowerCase())
                : product.category.toLowerCase() === (item || '').toLowerCase();
            const searchMatch = searchQuery.trim()
                ? product.title.toLowerCase().includes(searchQuery.toLowerCase())
                : true;
            return categoryMatch && searchMatch;
        })
        .sort((a, b) => {
            if (sortOption === 'priceAsc') return a.price - b.price;
            if (sortOption === 'priceDesc') return b.price - a.price;
            if (sortOption === 'dateNewest') return new Date(b.date) - new Date(a.date);
            if (sortOption === 'dateOldest') return new Date(a.date) - new Date(b.date);
            return 0;
        });

    const info = async (id) => {
        const response = await fetch(`${host}/api/product/getproduct/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        const json = await response.json();
        navigate('/productinfo', { state: { product: json.get_product } });
    };

    const capitalizeFirstChar = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const handlecart = (e, id, title, price, image) => {
        e.stopPropagation();
        update_buy();
        update_booked(id, title, convertedPrice(price), image);
    };

    const handleViewProduct = (e, productId) => {
        e.stopPropagation();
        info(productId);
    };

    return (
        <>
            <div className="header-container" style={{ marginTop: "3.2rem" }}>
                <h1 className='shop-heading'>
                    {`${searchTerm ? searchTerm : capitalizeFirstChar(item)}`}
                </h1>

                {/* ✅ Search LEFT — Dropdowns RIGHT */}
                <div className="filter-bar products-page">

                    {/* LEFT: Search */}
                    <div className="shop-search-wrap">
                        <i className="fas fa-search shop-search-icon"></i>
                        <input
                            type="text"
                            className="shop-search-input"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button className="shop-search-clear" onClick={() => setSearchQuery('')}>
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </div>

                    {/* RIGHT: Currency + Sort */}
                    <div className="filter-bar-right">
                        <CurrencyDropdown currency={curr} setCurrency={setCurr} rates={rates} />
                        <select
                            className="sort-dropdown"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="default">Sort By</option>
                            <option value="priceAsc">Price: Low to High</option>
                            <option value="priceDesc">Price: High to Low</option>
                            <option value="dateNewest">Newest First</option>
                            <option value="dateOldest">Oldest First</option>
                        </select>
                    </div>

                </div>
            </div>

            <div className="new-card-container mb-5" style={{ marginTop: "2rem" }}>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <div
                            className="new-product-card"
                            key={product._id}
                            onMouseEnter={() => setHoveredCard(product._id)}
                            onMouseLeave={() => setHoveredCard(null)}
                            onClick={() => info(product._id)}
                        >
                            <div className="product-image-wrapper">
                                <img
                                    src={`${API}/uploads/${product.images[hoveredImageIndexes[product._id] || 0]}`}
                                    alt={product.title}
                                    className="product-main-image"
                                    onMouseEnter={() => handleMouseEnter(product._id)}
                                    onMouseLeave={() => handleMouseLeave(product._id)}
                                />
                                <button className="wishlist-btn" onClick={(e) => e.stopPropagation()}>
                                    <i className="far fa-heart"></i>
                                </button>
                                {/* Replace: <span className="product-badge">New</span> */}
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
                                {hoveredCard === product._id && (
                                    <div className="hover-overlay">
                                        <div className="action-buttons">
                                            <button
                                                className="action-btn view-btn"
                                                onClick={(e) => handleViewProduct(e, product._id)}
                                                title="Quick View"
                                            >
                                                <i className="far fa-eye"></i>
                                            </button>
                                            <button
                                                className="action-btn cart-btn"
                                                onClick={(e) => handlecart(e, product._id, product.title, product.price, product.images[0])}
                                                title="Add to Cart"
                                            >
                                                <i className="fas fa-shopping-cart"></i>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="product-info">
                                <p className="product-category">{product.category || 'Flowers'}</p>
                                <h3 className="product-title">{product.title}</h3>
                                {/* Replace: <p className="product-price">{convertedPrice(product.price)} {curr}</p> */}
                                {product.salePrice ? (
                                    <div className="product-price-wrap">
                                        <span className="product-price-original">{convertedPrice(product.price)} {curr}</span>
                                        <span className="product-price product-price-sale">{convertedPrice(product.salePrice)} {curr}</span>
                                    </div>
                                ) : (
                                    <p className="product-price">{convertedPrice(product.price)} {curr}</p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-products">No products available</p>
                )}
            </div>
        </>
    );
};

export default Shop;