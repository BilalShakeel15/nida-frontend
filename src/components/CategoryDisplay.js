import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import productContext from "../context/products/productContext";

const CategoryDisplay = () => {
    const API = process.env.REACT_APP_API_URL;
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    const { products, Allproducts } = useContext(productContext);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${API}/api/admin/getcategory`);
                const data = await res.json();
                console.log(data);

                setCategories(data);
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };
        fetchCategories();
        Allproducts(); // fetch all products for counting
    }, []);

    // count products per category
    const countByCategory = (categoryName) => {
        return products.filter(
            (product) => product.category.toLowerCase() === categoryName.toLowerCase()
        ).length;
    };

    const handleNavigation = (item) => {
        localStorage.setItem("item", item.name);
        navigate("/shop");
    };

    return (
        <div className="categorydisplay-container container">
            <h2 className="categorydisplay-heading">Shop By Categories</h2>
            <div className="categorydisplay-underline"></div>

            <div className="categorydisplay-grid">
                {categories.map((item, index) => (
                    <div
                        key={index}
                        className="categorydisplay-card"
                        onClick={() => handleNavigation(item)}
                    >
                        <img
                            src={item.image}
                            alt={item.name}
                            className="categorydisplay-image"
                        />
                        <div className="categorydisplay-overlay">
                            <span className="categorydisplay-name">
                                {item.name}{" "}
                                <span className="categorydisplay-count">
                                    ({countByCategory(item.name)})
                                </span>
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryDisplay;
