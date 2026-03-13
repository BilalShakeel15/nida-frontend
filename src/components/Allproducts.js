import React, { useContext, useEffect, useState } from 'react';
import productContext from '../context/products/productContext';
import { useNavigate } from 'react-router-dom';
import CurrencyDropdown from './CurrencyDropdown';

const Allproducts = () => {
    const API = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const { products, Allproducts, deleteProduct } = useContext(productContext);
    const [hoveredImageIndexes, setHoveredImageIndexes] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [currency, setCurrency] = useState('PKR');
    const [rates, setRates] = useState({});

    const handleMouseEnter = (productId) => {
        setHoveredImageIndexes(prevState => ({
            ...prevState,
            [productId]: 1,
        }));
    };

    const handleMouseLeave = (productId) => {
        setHoveredImageIndexes(prevState => ({
            ...prevState,
            [productId]: 0,
        }));
    };

    useEffect(() => {
        const fetchProducts = async () => {
            await Allproducts();
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchRates = async () => {
            const ratesResponse = await fetch('https://api.exchangerate-api.com/v4/latest/PKR');
            const ratesData = await ratesResponse.json();
            setRates(ratesData.rates);
        };

        fetchRates();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handledel = async (id) => {
        await deleteProduct(id);
        navigate('/adminhome')
    };

    const handleupdate = (id, title, description, quantity, pieces, price, category) => {
        navigate(`/updateproduct`, {
            state: { id, title, description, quantity, pieces, price, category }
        });
    };

    const convertPrice = (price) => {
        const rate = rates[currency] || 1;
        return (price * rate).toFixed(2);
    };

    return (
        <>
            <div className="header-container" style={{ marginTop: "2rem" }}>
                <h1 className='' style={{ marginTop: "4rem" }}>Products</h1>
                <form className="d-flex input-group w-auto my-auto mb-3 mb-md-0 mx-4">
                    <div className="input-group mb-3">
                        <input autoComplete="off" type="search" className="form-control rounded-pill" placeholder="Search" value={searchTerm}
                            onChange={handleSearchChange} style={{ border: "2px solid black", width: "18rem" }} />
                        <div className='rounded-end-pill' style={{ border: "2px solid white", borderLeft: "transparent" }}></div>
                    </div>
                </form>
                <CurrencyDropdown currency={currency} setCurrency={setCurrency} rates={rates} />
            </div>
            <div className="card-container mb-5" style={{ marginTop: "2rem" }}>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <div className="product-card" key={product._id}>
                            <img
                                src={`${API}/uploads/${product.images[hoveredImageIndexes[product._id] || 0]}` || 'default_image.jpg'}
                                alt={product.name}
                                onMouseEnter={() => handleMouseEnter(product._id)}
                                onMouseLeave={() => handleMouseLeave(product._id)}
                            />
                            <div className="card-content">
                                <h3>{product.title}</h3>
                                <p>{convertPrice(product.price)} {currency}</p>
                                {!localStorage.getItem('admin') ? (
                                    <div className="cart">
                                        <button className="add-to-cart">ADD TO CART</button>
                                        <i className="bookmark fas fa-bookmark"></i>
                                    </div>
                                ) : (
                                    <div className="">
                                        <i className="fa-solid fa-pen-to-square bookmark" style={{ marginLeft: "0" }} onClick={() => handleupdate(product._id, product.title, product.description, product.quantity, product.pieces, product.price, product.category)}></i>
                                        <i className="fa-solid fa-trash bookmark mx-3" style={{ marginLeft: "0" }} onClick={() => handledel(product._id)}></i>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No products available</p>
                )}
            </div>
        </>
    );
};

export default Allproducts;
