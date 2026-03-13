import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import first from '../images/second.jpg';

const ConfirmOrderDetails = () => {
  const API = process.env.REACT_APP_API_URL;
  const image_temp = `${API}/uploads/`;
  const [order, setOrder] = useState({});
  const [products, setProducts] = useState([]);
  const host = API;
  const location = useLocation();
  const { id } = location.state || {};
  let temp;

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`${host}/api/admin/confirmorderdetails/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const json = await response.json();
        setOrder(json.get_order);
        temp = order.productId;
      } catch (error) {
        console.error('Failed to fetch order details:', error);
      }
    };

    fetchOrder();
  }, []);

  useEffect(() => {
    const fetchProductDetails = async (id) => {
      try {
        const response = await fetch(`${host}/api/product/getproduct/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const json = await response.json();
        return json.get_product;
      } catch (error) {
        console.error('Error fetching product:', error);
        return null;
      }
    };

    const fetchAllDetails = async () => {
      if (order.productId) {
        const fetchedProducts = await Promise.all(
          order.productId.map((id) => fetchProductDetails(id))
        );
        // Filter out any null results in case of errors
        const uniqueProducts = [...new Map(fetchedProducts.map((item) => [item.id, item])).values()];
        setProducts(fetchedProducts);
      }
    };

    fetchAllDetails();
  }, [order.productId, host]);




  return (
    <div className="orderdetail-container container">
      <h2 className="orderdetail-title">Order Details</h2>
      <h4 className="orderdetail-count">Number of Products: {products.length}</h4>
      <div className="orderdetail-products">
        {products.map((product, index) => (
          <div key={index} className="orderdetail-product">
            <img src={`${image_temp}${product.images[0]}`} alt="" className="orderdetail-image" />
            <h3 className="orderdetail-name">{product.title}</h3>
            <p className="orderdetail-quantity">Quantity: {order.quantity[index]}</p>
            <p className="orderdetail-category">Category: {product.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConfirmOrderDetails;
