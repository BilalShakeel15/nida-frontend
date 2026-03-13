import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from './Toast';

// import 'bootstrap/dist/css/bootstrap.min.css';

const Signup = () => {
    const API = process.env.REACT_APP_API_URL;
    const [toast, setToast] = useState(null);
    const closeToast = () => setToast(null);

    if (localStorage.getItem('item')) {
        console.log("Removing item");
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

        // Simple validation: all fields required
        if (!name || !email || !password || !address) {
            setToast({ message: "All fields are required", type: "warning" });
            return;
        }

        try {
            const response = await fetch(`${API}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
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
            console.error("Signup error:", error);
            setToast({ message: "Something went wrong. Try again!", type: "error" });
        }
    };


    return (
        <>
            {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}


            <div className="signup-page ">
                <div className="card p-4 shadow-lg container">
                    <h2 className="text-center mb-4">Sign Up</h2>
                    <form onSubmit={handleChange}>
                        <div className="mb-3">
                            <label htmlFor="exampleInputName" className="form-label">Name</label>
                            <input type="text" className="form-control" id="exampleInputName" name='name' onChange={onChange} value={credit.name} aria-describedby="nameHelp" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail" className="form-label">Email address</label>
                            <input type="email" className="form-control" id="exampleInputEmail1" name='email' onChange={onChange} value={credit.email} aria-describedby="emailHelp" />
                            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                            <input type="password" className="form-control" id="exampleInputPassword1" name='password' onChange={onChange} value={credit.password} required />
                        </div>
                        <div className="mb-3 form-check">
                            <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                            <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                        </div>
                        <div className="mb-3">
                            <label className="form-label" htmlFor="textAreaExample1">Address</label>
                            <textarea className="form-control" id="textAreaExample1" name='address' onChange={onChange} value={credit.address} rows="4"></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary w-100 rounded-pill mb-3" style={{ backgroundColor: "#FFC3C3", color: "black", border: "none" }}>Sign up</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Signup;