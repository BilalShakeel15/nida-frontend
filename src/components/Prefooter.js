import React from 'react';
import { useNavigate } from 'react-router-dom';

const Prefooter = () => {
    const navigate = useNavigate();
    return (
        <>
            {/* Banner Section */}
            <div className="banner-section">
                <div className="banner-inner">
                    <div className="banner-left">
                        <p className="banner-subtitle">Adding a personal touch to every occasion</p>
                        <h2 className="banner-title">From Our Hands to Your Heart</h2>
                    </div>
                    <div className="banner-right">
                        <button
                            className="shop-btn footer-cta"
                            onClick={() => navigate("/categorydisplay")}
                        >
                            Shop Now
                        </button>                    </div>
                </div>
            </div> {/* ✅ closing banner-section div */}
        </>
    );
};

export default Prefooter;
