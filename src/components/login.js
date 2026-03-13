import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from './Toast';
import { useCurrency } from '../context/CurrencyContext';


const Login = () => {
    const API = process.env.REACT_APP_API_URL;
    const [toast, setToast] = useState(null);
    const { fetchWishlist } = useCurrency()

    const closeToast = () => setToast(null);

    if (localStorage.getItem('item')) {
        console.log("Removing item");
        localStorage.removeItem('item');
    }
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleChange = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            const json = await response.json();

            if (json.success) {

                // ---- ADMIN LOGIN ----
                if (credentials.email === "nidacrafteria@gmail.com" && credentials.password === "password123") {
                    localStorage.setItem('admin', json.authToken);
                    setToast({ message: "Admin login successful!", type: "success" });
                    setTimeout(() => navigate('/adminhome'), 1500);
                    return;
                }

                // ---- NORMAL USER LOGIN ----
                localStorage.setItem('token', json.authToken);
                // fetchWishlist()
                setToast({ message: "Login successful!", type: "success" });
                setTimeout(() => navigate('/'), 1500);

            } else {
                // Incorrect credentials
                setToast({ message: "Incorrect email or password", type: "error" });
            }

        } catch (error) {
            console.error("Login Error:", error);
            setToast({ message: "Something went wrong. Try again!", type: "error" });
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
                            <input type="email" className="form-control" id="exampleInputEmail" name='email' onChange={onChange} value={credentials.email} aria-describedby="emailHelp" required />
                            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword" className="form-label">Password</label>
                            <input type="password" className="form-control" id="exampleInputPassword" name='password' onChange={onChange} value={credentials.password} required />
                        </div>
                        <button type="submit" className="btn btn w-100 rounded-pill mb-3" style={{ backgroundColor: "#d4358C", color: "black", border: "none", fontWeight: "bold" }}>Log In</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;
