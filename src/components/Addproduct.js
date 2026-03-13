// src/components/Addproduct.js 247
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Addproduct.css';

const Addproduct = () => {
    const API = process.env.REACT_APP_API_URL;
    const [product, setProduct] = useState({
        images: [], title: '', description: '', price: '',
        quantity: '', pieces: '', category: '', highlights: []
    });
    const [highlightInput, setHighlightInput] = useState('');
    const [imagePreviews, setImagePreviews] = useState([]);
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
        const { name, value, files } = e.target;
        if (name === 'images') {
            const selectedFiles = Array.from(files);
            setProduct(p => ({ ...p, images: [...p.images, ...selectedFiles] }));
            setImagePreviews(prev => [...prev, ...selectedFiles.map(f => URL.createObjectURL(f))]);
        } else {
            setProduct(p => ({ ...p, [name]: value }));
        }
    };

    const handleImageRemove = (index) => {
        setProduct(p => ({ ...p, images: p.images.filter((_, i) => i !== index) }));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleHighlightKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!highlightInput.trim()) return;
            setProduct(p => ({ ...p, highlights: [...p.highlights, highlightInput.trim()] }));
            setHighlightInput('');
        }
    };

    const removeHighlight = (index) => {
        setProduct(p => ({ ...p, highlights: p.highlights.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        product.images.forEach(img => formData.append('images', img));
        formData.append('title', product.title);
        formData.append('description', product.description);
        formData.append('price', product.price);
        formData.append('quantity', product.quantity);
        formData.append('pieces', product.pieces);
        formData.append('category', product.category);
        formData.append('highlights', JSON.stringify(product.highlights));

        try {
            const response = await fetch(`${API}/api/product/addproduct`, {
                method: 'POST',
                headers: { 'auth-token': localStorage.getItem('admin') },
                body: formData
            });
            const json = await response.json();
            if (json.success) navigate('/adminhome');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ap-page">
            <div className="ap-container">
                <div className="ap-header">
                    <h1 className="ap-title">Add New Product</h1>
                    <p className="ap-subtitle">Fill in the details to list a new product</p>
                </div>

                <form onSubmit={handleSubmit} className="ap-form">
                    {/* Image Upload */}
                    <div className="ap-section">
                        <label className="ap-label">Product Images</label>
                        <input type="file" name="images" onChange={onChange} multiple hidden id="uploadImages" accept="image/*" />
                        <label htmlFor="uploadImages" className="ap-upload-btn">
                            <span>📸</span> Upload Images (max 5)
                        </label>
                        {imagePreviews.length > 0 && (
                            <div className="ap-previews">
                                {imagePreviews.map((src, i) => (
                                    <div key={i} className="ap-preview">
                                        <img src={src} alt="" />
                                        <button type="button" className="ap-remove" onClick={() => handleImageRemove(i)}>×</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Basic Fields */}
                    <div className="ap-section">
                        <label className="ap-label">Product Title</label>
                        <input className="ap-input" placeholder="e.g. Handmade Paper Flowers Set" name="title" onChange={onChange} required />
                    </div>

                    <div className="ap-section">
                        <label className="ap-label">Description</label>
                        <textarea className="ap-input ap-textarea" placeholder="Describe the product..." name="description" onChange={onChange} rows="3" required />
                    </div>

                    <div className="ap-row">
                        <div className="ap-section">
                            <label className="ap-label">Price (Rs.)</label>
                            <input type="number" className="ap-input" placeholder="0" name="price" onChange={onChange} required min="0" />
                        </div>
                        <div className="ap-section">
                            <label className="ap-label">Quantity</label>
                            <input type="number" className="ap-input" placeholder="0" name="quantity" onChange={onChange} required min="0" />
                        </div>
                        <div className="ap-section">
                            <label className="ap-label">Pieces</label>
                            <input type="number" className="ap-input" placeholder="0" name="pieces" onChange={onChange} required min="1" />
                        </div>
                    </div>

                    <div className="ap-section">
                        <label className="ap-label">Category</label>
                        <select className="ap-input ap-select" name="category" value={product.category} onChange={onChange} required>
                            <option value="">Select a category</option>
                            {categories.map((cat, i) => (
                                <option key={i} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Highlights */}
                    <div className="ap-section">
                        <label className="ap-label">Product Highlights</label>
                        <p className="ap-hint">Press Enter to add each highlight</p>
                        {product.highlights.length > 0 && (
                            <div className="ap-tags">
                                {product.highlights.map((h, i) => (
                                    <div key={i} className="ap-tag">
                                        <span>✔ {h}</span>
                                        <button type="button" onClick={() => removeHighlight(i)}>×</button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <input
                            type="text"
                            className="ap-input"
                            placeholder="e.g. Handcrafted with love"
                            value={highlightInput}
                            onChange={(e) => setHighlightInput(e.target.value)}
                            onKeyDown={handleHighlightKeyDown}
                        />
                    </div>

                    <button type="submit" className="ap-submit" disabled={loading}>
                        {loading ? '⏳ Adding Product...' : '+ Add Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Addproduct;