import React from 'react';
import { Navigate } from 'react-router-dom';
import Toast from './Toast';
import { useState, useEffect } from 'react';

const ProtectedAdminRoute = ({ children }) => {
    const [showToast, setShowToast] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAdminStatus = () => {
            const adminToken = localStorage.getItem('admin');
            if (adminToken) {
                setIsAdmin(true);
            } else {
                setShowToast(true);
            }
            setIsLoading(false);
        };

        checkAdminStatus();
    }, []);

    const closeToast = () => {
        setShowToast(false);
    };

    if (isLoading) {
        return (
            <div className="container d-flex justify-content-center align-items-center" style={{ marginTop: "6rem", minHeight: "50vh" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <>
                {showToast && (
                    <Toast
                        message="Access Denied! You don't have permission to view this page. Please login as admin."
                        type="error"
                        onClose={closeToast}
                        duration={8000}
                    />
                )}
                <Navigate to="/" replace />
            </>
        );
    }

    return children;
};

export default ProtectedAdminRoute;




