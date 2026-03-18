import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from './Footer';

const TAG_COLORS = {
    'New': '#22c55e',
    'Popular': '#f97316',
    'Limited': '#ef4444',
    'Sale': '#d4358c',
    '': '#999'
};

const UpdateProduct = () => {
    const API = process.env.REACT_APP_API_URL;
    const { state } = useLocation();
    const { id, title, description, quantity, pieces, price, category, salePrice, tag, highlights } = state || {};

    const [product, setProduct] = useState({
        title: title || '',
        description: description || '',
        price: price || '',
        quantity: quantity || '',
        pieces: pieces || '',
        category: category || '',
        salePrice: salePrice || '',
        tag: tag || 'New',
        highlights: highlights || []
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${API}/api/admin/getcategory`);
                const data = await res.json();
                setCategories(data);
            } catch (err) { console.error(err); }
        };
        fetchCategories();
    }, []);

    const onChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${API}/api/product/updateproduct/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('admin')
                },
                body: JSON.stringify({
                    ...product,
                    salePrice: product.salePrice ? Number(product.salePrice) : null,
                    highlights: product.highlights
                })
            });

            const json = await response.json();
            if (json.success) navigate("/adminhome");
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%', padding: '10px 14px', borderRadius: '8px',
        border: '1px solid #ddd', fontSize: '15px', marginTop: '6px',
        fontFamily: 'Inter', outline: 'none'
    };

    const labelStyle = {
        fontSize: '14px', fontWeight: '600', color: '#333', display: 'block', marginBottom: '2px'
    };

    const sectionStyle = { marginBottom: '18px' };

    return (
        <>
            <div className="signup-page" style={{ marginTop: "3rem", alignItems: 'flex-start', paddingTop: '2rem' }}>
                <div className="card p-4 shadow-lg container" style={{ maxWidth: '600px' }}>
                    <h2 className="text-center mb-4">Update Product</h2>
                    <form onSubmit={handleChange}>

                        <div style={sectionStyle}>
                            <label style={labelStyle}>Title</label>
                            <input style={inputStyle} type="text" name="title" onChange={onChange} value={product.title} required />
                        </div>

                        <div style={sectionStyle}>
                            <label style={labelStyle}>Description</label>
                            <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} name="description" onChange={onChange} value={product.description} required />
                        </div>

                        {/* Category dropdown */}
                        <div style={sectionStyle}>
                            <label style={labelStyle}>Category</label>
                            <select style={inputStyle} name="category" value={product.category} onChange={onChange} required>
                                <option value="">Select a category</option>
                                {categories.map((cat, i) => (
                                    <option key={i} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '18px' }}>
                            <div>
                                <label style={labelStyle}>Price (Rs.)</label>
                                <input style={inputStyle} type="number" name="price" onChange={onChange} value={product.price} required min="0" />
                            </div>
                            <div>
                                <label style={labelStyle}>Quantity</label>
                                <input style={inputStyle} type="number" name="quantity" onChange={onChange} value={product.quantity} required min="0" />
                            </div>
                            <div>
                                <label style={labelStyle}>Pieces</label>
                                <input style={inputStyle} type="number" name="pieces" onChange={onChange} value={product.pieces} required min="1" />
                            </div>
                        </div>

                        {/* Tag selector */}
                        <div style={sectionStyle}>
                            <label style={labelStyle}>Product Tag</label>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                                {['New', 'Popular', 'Limited', 'Sale', ''].map(t => (
                                    <button
                                        type="button"
                                        key={t}
                                        onClick={() => setProduct(p => ({ ...p, tag: t }))}
                                        style={{
                                            padding: '6px 16px',
                                            borderRadius: '20px',
                                            border: `2px solid ${TAG_COLORS[t]}`,
                                            backgroundColor: product.tag === t ? TAG_COLORS[t] : 'transparent',
                                            color: product.tag === t ? '#fff' : TAG_COLORS[t],
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {t || 'None'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sale Price */}
                        <div style={sectionStyle}>
                            <label style={labelStyle}>Sale Price (Rs.) <span style={{ color: '#999', fontWeight: 400 }}>— optional</span></label>
                            <input
                                style={inputStyle}
                                type="number"
                                name="salePrice"
                                placeholder="Leave empty to remove sale"
                                onChange={onChange}
                                value={product.salePrice || ''}
                                min="0"
                            />
                            {product.salePrice && product.price && (
                                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ textDecoration: 'line-through', color: '#999' }}>Rs. {product.price}</span>
                                    <span style={{ color: '#d4358c', fontWeight: 700 }}>Rs. {product.salePrice}</span>
                                    <span style={{ background: '#fce7f3', color: '#d4358c', padding: '2px 8px', borderRadius: 6, fontSize: 13 }}>
                                        {Math.round((1 - product.salePrice / product.price) * 100)}% OFF
                                    </span>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn w-100 rounded-pill mb-3"
                            style={{ backgroundColor: "#d4358c", color: "white", border: "none", height: '44px', fontWeight: '600' }}
                            disabled={loading}
                        >
                            {loading
                                ? <span className="spinner-border spinner-border-sm" role="status" />
                                : 'Update Product'
                            }
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default UpdateProduct;