import React, { useEffect, useState, useRef } from "react";
// import "./HeroCarousel.css";

const HeroCarousel = () => {
    const API = process.env.REACT_APP_API_URL;
    const BASE_URL = `${API}/uploads/`;

    const [banner, setBanner] = useState([]);
    const [current, setCurrent] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const res = await fetch(`${API}/api/admin/getbanner`);
                const json = await res.json();
                setBanner(json?.temp_banner || []);
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

    const slides = banner.length ? banner : ["", "", "", ""];

    return (
        <section className="modern-hero">
            <div className="hero-address">
                <span>Pakistan’s 1st creative designer</span>
            </div>

            <div className="hero-text">
                <h1>
                    Beautifully handcrafted cards <br />
                    and floral paper art designed for meaningful gifting.

                </h1>
            </div>


            <div
                className="gallery-wall"
                onMouseEnter={stopAutoSlide}
                onMouseLeave={startAutoSlide}
            >
                {[0, 1, 2, 3].map((pos) => {
                    const index = (current + pos) % slides.length;
                    const img = slides[index];

                    return (
                        <div className={`gallery-panel panel-${pos + 1}`} key={pos}>
                            {img ? (
                                <img src={`${BASE_URL}${img}`} alt={`gallery-${pos}`} />
                            ) : (
                                <div className="fallback">Gallery {pos + 1}</div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="carousel-dots">
                {slides.map((_, i) => (
                    <span
                        key={i}
                        className={`dot ${current === i ? "active" : ""}`}
                        onClick={() => setCurrent(i)}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroCarousel;
