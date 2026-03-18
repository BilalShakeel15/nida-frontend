import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Toast from './Toast';

const Signup = () => {
    const API = process.env.REACT_APP_API_URL;
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(false);
    const closeToast = () => setToast(null);

    if (localStorage.getItem('item')) {
        localStorage.removeItem('item');
    }

    const [credit, setCredit] = useState({ name: "", email: "", password: "", address: "" });
    const navigate = useNavigate();

    const onChange = (e) => {
        setCredit({ ...credit, [e.target.name]: e.target.value });
    };

    const handleChange = async (e) => {
        e.preventDefault();
        const { name, email, password, address } = credit;

        if (!name || !email || !password || !address) {
            setToast({ message: "All fields are required", type: "warning" });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credit)
            });

            const json = await response.json();

            if (json.success) {
                setToast({ message: "Signup successful!", type: "success" });
                setTimeout(() => navigate("/"), 1500);
            } else {
                setToast({ message: json.errors || "Signup failed. User may already exist.", type: "error" });
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

            <div className="signup-page">
                <div className="card p-4 shadow-lg container">
                    <h2 className="text-center mb-4">Sign Up</h2>
                    <form onSubmit={handleChange}>
                        <div className="mb-3">
                            <label htmlFor="exampleInputName" className="form-label">Name</label>
                            <input type="text" className="form-control" id="exampleInputName" name='name' onChange={onChange} value={credit.name} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail" className="form-label">Email address</label>
                            <input type="email" className="form-control" id="exampleInputEmail1" name='email' onChange={onChange} value={credit.email} />
                            <div className="form-text">We'll never share your email with anyone else.</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                            <input type="password" className="form-control" id="exampleInputPassword1" name='password' onChange={onChange} value={credit.password} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="textAreaExample1">Address</label>
                            <textarea className="form-control" id="textAreaExample1" name='address' onChange={onChange} value={credit.address} rows="3"></textarea>
                        </div>

                        <button
                            type="submit"
                            className="btn w-100 rounded-pill mb-3"
                            style={{ backgroundColor: "#d4358c", color: "white", border: "none", fontWeight: "bold", height: "44px" }}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="spinner-border spinner-border-sm" role="status" />
                            ) : "Sign Up"}
                        </button>
                    </form>

                    {/* Login CTA */}
                    <div className="text-center mt-2" style={{ fontSize: '15px', color: '#555' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#d4358c', fontWeight: '600', textDecoration: 'none' }}>
                            Log In
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signup;