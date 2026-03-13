// src/components/Banner.js 137
import React, { useState, useEffect } from 'react';
import './Banner.css';

const Banner = () => {
  const API = process.env.REACT_APP_API_URL;
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [banner, setBanner] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetch(`${API}/api/admin/getbanner`, {
          headers: { 'auth-token': localStorage.getItem('admin') }
        });
        const json = await response.json();
        setBanner(json.temp_banner || []);
      } catch (error) { console.error(error); }
    };
    fetchBanner();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    setImageFiles(prev => [...prev, ...files]);
  };

  const handleRemoveNew = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageFiles.length === 0) return alert('Please select images first');
    setLoading(true);
    const formData = new FormData();
    imageFiles.forEach(file => formData.append('images', file));
    try {
      const response = await fetch(`${API}/api/admin/banner`, {
        method: 'POST',
        headers: { 'auth-token': localStorage.getItem('admin') },
        body: formData
      });
      const json = await response.json();
      if (json.success) {
        const res = await fetch(`${API}/api/admin/getbanner`, { headers: { 'auth-token': localStorage.getItem('admin') } });
        const updated = await res.json();
        setBanner(updated.temp_banner || []);
        setSelectedImages([]);
        setImageFiles([]);
      }
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleDeleteBanner = async () => {
    if (!window.confirm('Are you sure you want to delete all banner images?')) return;
    try {
      const response = await fetch(`${API}/api/admin/banner`, {
        method: 'DELETE',
        headers: { 'auth-token': localStorage.getItem('admin') }
      });
      const json = await response.json();
      if (json.success) setBanner([]);
    } catch (error) { console.error(error); }
  };

  return (
    <div className="bn-page">
      <div className="bn-header">
        <div>
          <h1 className="bn-title">Banner Management</h1>
          <p className="bn-subtitle">Manage your homepage carousel images</p>
        </div>
        {banner.length > 0 && (
          <button className="bn-delete-all" onClick={handleDeleteBanner}>🗑 Delete All</button>
        )}
      </div>

      {/* Current Banner */}
      <div className="bn-card">
        <div className="bn-card__head">
          Current Banner Images
          <span className="bn-count">{banner.length} images</span>
        </div>
        {banner.length === 0 ? (
          <div className="bn-empty">No banner images uploaded yet</div>
        ) : (
          <div className="bn-current-grid">
            {banner.map((img, i) => (
              <div key={i} className="bn-current-item">
                <img src={`${API}/uploads/${img}`} alt={`Banner ${i + 1}`} />
                <span className="bn-item-num">{i + 1}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload New */}
      <div className="bn-card">
        <div className="bn-card__head">Upload New Banner</div>
        <form onSubmit={handleSubmit} className="bn-form">
          <input type="file" accept="image/*" multiple onChange={handleImageChange} hidden id="bnImages" />
          <label htmlFor="bnImages" className="bn-upload-btn">
            <span>🖼</span> Select Images (replaces current banner)
          </label>

          {selectedImages.length > 0 && (
            <div className="bn-new-grid">
              {selectedImages.map((src, i) => (
                <div key={i} className="bn-new-item">
                  <img src={src} alt="" />
                  <button type="button" className="bn-remove" onClick={() => handleRemoveNew(i)}>×</button>
                </div>
              ))}
            </div>
          )}

          <button type="submit" className="bn-submit" disabled={loading || selectedImages.length === 0}>
            {loading ? '⏳ Uploading...' : `Upload ${selectedImages.length > 0 ? `(${selectedImages.length} images)` : ''}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Banner;