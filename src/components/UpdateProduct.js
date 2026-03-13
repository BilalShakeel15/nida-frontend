import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from './Footer';

const UpdateProduct = () => {
    const API = process.env.REACT_APP_API_URL;
    const { state } = useLocation();
    const { id, title, description, quantity, pieces, price, category } = state || {};

    const [product, setProduct] = useState({
        title: title || '',
        description: description || '',
        price: price || '',
        quantity: quantity || '',
        pieces: pieces || '',
        category: category || ''
    });

    const navigate = useNavigate();

    const onChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleChange = async (e) => {
        e.preventDefault();

        try {
            console.log(JSON.stringify(product));

            const response = await fetch(`${API}/api/product/updateproduct/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('admin')
                },
                body: JSON.stringify(product)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const json = await response.json();

            if (json.success) {
                navigate("/adminhome");
            } else {
                console.log("Product update failed:", json.errors);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <div className="signup-page" style={{ marginTop: "3rem" }}>
                <div className="card p-4 shadow-lg container">
                    <h2 className="text-center mb-4">Update Product</h2>
                    <form onSubmit={handleChange}>
                        <div className="mb-3">
                            <label htmlFor="exampleInputTitle" className="form-label">Title</label>
                            <input
                                type="text"
                                className="form-control"
                                id="exampleInputTitle"
                                name="title"
                                onChange={onChange}
                                value={product.title}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputDescription" className="form-label">Description</label>
                            <textarea
                                className="form-control"
                                id="exampleInputDescription"
                                name="description"
                                onChange={onChange}
                                value={product.description}
                                rows="4"
                                required
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputTitle" className="form-label">Category</label>
                            <input
                                type="text"
                                className="form-control"
                                id="exampleInputTitle"
                                name="title"
                                onChange={onChange}
                                value={product.category}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputPrice" className="form-label">Price</label>
                            <input
                                type="number"
                                className="form-control"
                                id="exampleInputPrice"
                                name="price"
                                onChange={onChange}
                                value={product.price}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputQuantity" className="form-label">Quantity</label>
                            <input
                                type="number"
                                className="form-control"
                                id="exampleInputQuantity"
                                name="quantity"
                                onChange={onChange}
                                value={product.quantity}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputPieces" className="form-label">Pieces</label>
                            <input
                                type="number"
                                className="form-control"
                                id="exampleInputPieces"
                                name="pieces"
                                onChange={onChange}
                                value={product.pieces}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary w-100 rounded-pill mb-3"
                            style={{ backgroundColor: "#FFC3C3", color: "black", border: "none" }}
                        >
                            Update Product
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default UpdateProduct;
