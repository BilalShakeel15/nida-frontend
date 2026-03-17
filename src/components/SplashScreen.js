import React, { useEffect, useState } from 'react';
import logo from '../images/nida logo.png';

const SplashScreen = ({ onFinish }) => {
    const [visible, setVisible] = useState(false);
    const [leaving, setLeaving] = useState(false);

    useEffect(() => {
        // Trigger animate-in on next frame
        const enterTimer = setTimeout(() => setVisible(true), 50);
        // Start fade-out after 2s
        const exitTimer = setTimeout(() => setLeaving(true), 2000);
        // Tell parent splash is done
        const doneTimer = setTimeout(() => onFinish(), 2700);

        return () => {
            clearTimeout(enterTimer);
            clearTimeout(exitTimer);
            clearTimeout(doneTimer);
        };
    }, []);

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(255, 195, 195, 0.88)',
            opacity: leaving ? 0 : 1,
            transition: 'opacity 0.7s ease',
            pointerEvents: 'none',
        }}>
            {/* Logo */}
            <img
                src={logo}
                alt="Nida Logo"
                style={{
                    height: '80px',
                    display: 'block',
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'scale(1) translateY(0)' : 'scale(0.6) translateY(30px)',
                    transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
            />

            {/* Site name */}
            <div style={{
                fontFamily: 'Amatic SC, cursive',
                fontSize: 'clamp(1.4rem, 5vw, 2.4rem)',
                fontWeight: 'bold',
                color: '#2e2e2e',
                letterSpacing: '0.05em',
                textAlign: 'center',
                padding: '0 1rem',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s',
            }}>
                NIDA HANDMADE CARDS
            </div>

            {/* Tagline */}
            <div style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.95rem',
                color: '#d4358c',
                fontWeight: '500',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(12px)',
                transition: 'all 0.6s ease 0.3s',
            }}>
                Crafted with love ♥
            </div>
        </div>
    );
};

export default SplashScreen;