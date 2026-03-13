import React, { useState } from 'react'
import productContext from './productContext';
const ProductStates = (props) => {
    const API = process.env.REACT_APP_API_URL;
    const host = API;
    const productsInitial = []
    const [products, setProducts] = useState(productsInitial)
    const [product, setProduct] = useState(productsInitial)
    const token = localStorage.getItem('admin')

    const get_product = async (id) => {
        // API Call
        const response = await fetch(`${host}/api/product/getproduct/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const json = await response.json();

        setProduct(json.get_product);
    };
    const Allproducts = async () => {
        // API Call
        const response = await fetch(`${host}/api/product/getallproducts`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",

            },
        });
        const json = await response.json();

        setProducts(json.get_products);
    };
    const deleteProduct = async (id) => {
        const response = await fetch(`${host}/api/product/deleteproduct/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "apllication/json",
                'auth-token': localStorage.getItem('admin')
            }
        });
        await response.json();
    }
    const deletecategory = async (i) => {
        const response = await fetch(`${host}/api/admin/deletecategory/${i}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "apllication/json",
                'auth-token': token
            }
        });
        await response.json();
    }
    const add_category = async (n, c) => {
        try {

            const response = await fetch(`${API}/api/admin/category`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({ n, c })
            });
            const json = await response.json();
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <productContext.Provider value={{ products, Allproducts, deleteProduct, product, get_product, add_category, deletecategory }}>
            {props.children}
        </productContext.Provider>
    )


}

export default ProductStates