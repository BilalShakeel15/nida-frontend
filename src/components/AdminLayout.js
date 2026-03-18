import React from 'react';
import AdminNavbar from './AdminNavbar';

const AdminLayout = ({ children }) => {
    return (
        <>
            <AdminNavbar />
            <div style={{ paddingTop: '' }}>
                {children}
            </div>
        </>
    );
};

export default AdminLayout;