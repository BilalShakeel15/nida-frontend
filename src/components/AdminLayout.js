import React from 'react';
import AdminNavbar from './AdminNavbar';

const AdminLayout = ({ children }) => {
    return (
        <>
            <AdminNavbar />
            <div style={{ paddingTop: '62px' }}>
                {children}
            </div>
        </>
    );
};

export default AdminLayout;