// src/components/AddCategory.js 128
import React, { useState, useEffect, useContext } from 'react';
import productContext from '../context/products/productContext';
import './AddCategory.css';

const AddCategory = () => {
    const API = process.env.REACT_APP_API_URL;
    const { deletecategory } = useContext(productContext);
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory) return alert('Please enter category name');
        setLoading(true);
        const formData = new FormData();
        formData.append('n', 'categories');
        formData.append('c', newCategory);
        if (image) formData.append('image', image);
        const token = localStorage.getItem('admin');

        try {
            const response = await fetch(`${API}/api/admin/category`, {
                method: 'POST',
                headers: { 'auth-token': token },
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                setNewCategory('');
                setImage(null);
                setPreview(null);
                const res = await fetch(`${API}/api/admin/getcategory`);
                const updated = await res.json();
                setCategories(updated);
            }
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const del_category = async (index) => {
        if (!window.confirm('Delete this category?')) return;
        try {
            const token = localStorage.getItem('admin');
            await fetch(`${API}/api/admin/deletecategory/${index}`, {
                method: 'DELETE',
                headers: { 'auth-token': token },
            });
            setCategories(prev => prev.filter((_, i) => i !== index));
        } catch (error) { console.error(error); }
    };

    return (
        <div className="ac-page">
            <div className="ac-header">
                <h1 className="ac-title">Categories</h1>
                <p className="ac-subtitle">{categories.length} categories</p>
            </div>

            <div className="ac-layout">
                {/* Add Form */}
                <div className="ac-form-card">
                    <div className="ac-form-head">Add New Category</div>
                    <form onSubmit={handleAddCategory} className="ac-form">
                        <div className="ac-field">
                            <label className="ac-label">Category Name</label>
                            <input
                                type="text"
                                className="ac-input"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="e.g. Paper Flowers"
                                required
                            />
                        </div>

                        <div className="ac-field">
                            <label className="ac-label">Category Image</label>
                            <input type="file" accept="image/*" onChange={handleImageChange} hidden id="catImage" />
                            <label htmlFor="catImage" className="ac-upload-btn">
                                {preview ? '🔄 Change Image' : '📷 Upload Image'}
                            </label>
                            {preview && (
                                <div className="ac-preview-wrap">
                                    <img src={preview} alt="Preview" className="ac-preview-img" />
                                    <button type="button" className="ac-remove-preview" onClick={() => { setPreview(null); setImage(null); }}>×</button>
                                </div>
                            )}
                        </div>

                        <button type="submit" className="ac-submit" disabled={loading}>
                            {loading ? 'Adding...' : '+ Add Category'}
                        </button>
                    </form>
                </div>

                {/* Categories Grid */}
                <div className="ac-list-section">
                    <div className="ac-grid">
                        {categories.length === 0 ? (
                            <div className="ac-empty">No categories yet. Add one!</div>
                        ) : (
                            categories.map((cat, index) => (
                                <div className="ac-cat-card" key={index}>
                                    {cat.image ? (
                                        <img src={cat.image} alt={cat.name} className="ac-cat-img" />
                                    ) : (
                                        <div className="ac-cat-no-img">🌸</div>
                                    )}
                                    <div className="ac-cat-name">{cat.name}</div>
                                    <button className="ac-cat-delete" onClick={() => del_category(index)} title="Delete">
                                        🗑
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCategory;