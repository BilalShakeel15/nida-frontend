import React, { useEffect, useState, useRef } from "react";

const HeroCarousel = () => {
    const API = process.env.REACT_APP_API_URL;
    // const BASE_URL = `${API}/uploads/`;

    const [banner, setBanner] = useState([]);
    const [current, setCurrent] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        const fetchBanner = async () => {
            // Pehle sessionStorage check karo
            const cached = sessionStorage.getItem('bannerData');
            if (cached) {
                setBanner(JSON.parse(cached));
                return; // DB call nahi hogi
            }

            try {
                const res = await fetch(`${API}/api/admin/getbanner`);
                const json = await res.json();
                const data = json?.temp_banner || [];
                setBanner(data);
                // Cache kar do
                sessionStorage.setItem('bannerData', JSON.stringify(data));
            } catch (err) {
                console.error("Banner fetch error:", err);
                setBanner([]);
            }
        };
        fetchBanner();
    }, []);

    useEffect(() => {
        if (banner.length <= 1) return;
        startAutoSlide();
        return stopAutoSlide;
    }, [banner, current]);

    const startAutoSlide = () => {
        stopAutoSlide();
        intervalRef.current = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banner.length);
        }, 4500);
    };

    const stopAutoSlide = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    // Always show 4 panels, cycling through all available slides
    const getPanelIndex = (offset) => {
        if (!banner.length) return null;
        return (current + offset) % banner.length;
    };

    const fallbackPanel = (
        <div style={{
            width: '100%', height: '100%',
            backgroundColor: '#ffc3c3',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            <div style={{
                width: 36, height: 36,
                border: '3px solid #d4358c',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
            }} />
        </div>
    );

    return (
        <>
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>

            <section className="modern-hero">
                <div className="hero-address">
                    <span>Pakistan's 1st creative designer</span>
                </div>

                <div className="hero-text">
                    <h1>
                        Beautifully handcrafted cards <br />
                        and floral paper art designed for meaningful gifting.
                    </h1>
                </div>
                <button className="shop-btn hero-cta">Shop Now</button>

                <div
                    className="gallery-wall"
                    onMouseEnter={stopAutoSlide}
                    onMouseLeave={startAutoSlide}
                >
                    {[0, 1, 2, 3].map((pos) => {
                        const index = getPanelIndex(pos);
                        const img = index !== null ? banner[index] : null;

                        return (
                            <div className={`gallery-panel panel-${pos + 1}`} key={pos}>
                                {img ? (
                                    <img
                                        src={img}
                                        alt={`gallery-${pos}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : fallbackPanel}
                            </div>
                        );
                    })}
                </div>

                <div className="carousel-dots">
                    {banner.length > 0
                        ? banner.map((_, i) => (
                            <span
                                key={i}
                                className={`dot ${current === i ? "active" : ""}`}
                                onClick={() => setCurrent(i)}
                            />
                        ))
                        : [0, 1, 2, 3].map((i) => (
                            <span key={i} className="dot" />
                        ))
                    }
                </div>
            </section>
        </>
    );
};

export default HeroCarousel;