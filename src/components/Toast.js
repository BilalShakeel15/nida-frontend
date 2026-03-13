import React, { useEffect } from 'react';

const Toast = ({ message, type = 'info', onClose, duration = 5000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getToastClasses = () => {
        const baseClasses = 'toast show position-fixed';
        const typeClasses = {
            success: 'bg-success text-white',
            error: 'bg-danger text-white',
            warning: 'bg-warning text-dark',
            info: 'bg-info text-white'
        };
        return `${baseClasses} ${typeClasses[type] || typeClasses.info}`;
    };

    const getIcon = () => {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    };

    return (
        <div
            className={getToastClasses()}
            style={{
                top: '20px',
                right: '20px',
                zIndex: 9999,
                minWidth: '300px'
            }}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
        >
            <div className="toast-header">
                <strong className="me-auto">{getIcon()} {type.charAt(0).toUpperCase() + type.slice(1)}</strong>
                <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={onClose}
                    aria-label="Close"
                ></button>
            </div>
            <div className="toast-body">
                {message}
            </div>
        </div>
    );
};

export default Toast;

