import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Toast from './Toast';
import { useCurrency } from '../context/CurrencyContext';

const Login = () => {
    const API = process.env.REACT_APP_API_URL;
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(false);
    const { fetchWishlist } = useCurrency();
    const closeToast = () => setToast(null);

    if (localStorage.getItem('item')) {
        localStorage.removeItem('item');
    }

    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${API}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            const json = await response.json();

            if (json.success) {
                if (credentials.email === "nidacrafteria@gmail.com" && credentials.password === "password123") {
                    localStorage.setItem('admin', json.authToken);
                    setToast({ message: "Admin login successful!", type: "success" });
                    setTimeout(() => navigate('/adminhome'), 1500);
                    return;
                }
                localStorage.setItem('token', json.authToken);
                setToast({ message: "Login successful!", type: "success" });
                setTimeout(() => navigate('/'), 1500);
            } else {
                setToast({ message: "Incorrect email or password", type: "error" });
            }
        } catch (error) {
            setToast({ message: "Something went wrong. Try again!", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

            <div className="login-page">
                <div className="card-login p-4 shadow-lg container">
                    <h2 className="text-center mb-4">Log In</h2>
                    <form onSubmit={handleChange}>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail" className="form-label">Email address</label>
                            <input type="email" className="form-control" id="exampleInputEmail" name='email' onChange={onChange} value={credentials.email} required />
                            <div className="form-text">We'll never share your email with anyone else.</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword" className="form-label">Password</label>
                            <input type="password" className="form-control" id="exampleInputPassword" name='password' onChange={onChange} value={credentials.password} required />
                        </div>

                        <button
                            type="submit"
                            className="btn w-100 rounded-pill mb-3"
                            style={{ backgroundColor: "#d4358C", color: "white", border: "none", fontWeight: "bold", height: "44px" }}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="spinner-border spinner-border-sm" role="status" />
                            ) : "Log In"}
                        </button>
                    </form>

                    {/* Signup CTA */}
                    <div className="text-center mt-2" style={{ fontSize: '15px', color: '#555' }}>
                        Don't have an account?{' '}
                        <Link to="/signup" style={{ color: '#d4358c', fontWeight: '600', textDecoration: 'none' }}>
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;