import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context with default values
const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
    const API = process.env.REACT_APP_API_URL;
    const [curr, setCurr] = useState('PKR');
    const [r, setR] = useState({});
    const [buy, setBuy] = useState(0);
    const [booked, setBooked] = useState([])
    const [wishlistCount, setwishlistCount] = useState(0)
    const token = localStorage.getItem('token');

    const fetchWishlist = async () => {
        console.log(localStorage.getItem('token'));

        console.log("in fetch list", token);

        try {
            const response = await fetch(`${API}/api/wishlist/get`, {
                headers: {
                    'auth-token': localStorage.getItem('token')
                }
            });
            const data = await response.json();
            if (data.success) {
                setwishlistCount(data.wishlist.length);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            // setLoading(false);
        }
    };
    const increment_wishlist = () => {
        setwishlistCount(wishlistCount + 1)
    }
    const logout_wishlist = () => {
        setwishlistCount(0)
    }
    const decrement_wishlist = () => {
        setwishlistCount(wishlistCount - 1)
    }
    const decrement_buy = () => {
        setBuy(buy - 1);
    }

    const update_booked = (id, title, price, image, quantity = 1) => {
        const temp = { id, title, price, image, quantity }
        setBooked((prevBooked) => [...prevBooked, temp]);
    }
    const removeItem = (index) => {
        setBooked(prev => prev.filter((_, i) => i !== index));
    };

    const update_buy = () => {
        setBuy(buy + 1);
        console.log(buy);

    }
    // Fetch exchange rates and update rates state
    const fetchRates = async () => {
        try {
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/PKR');
            if (!response.ok) throw new Error('Rate fetch failed');
            const data = await response.json();
            setR(data.rates);
        } catch (err) {
            console.error('Currency rates unavailable:', err);
            // rates will default to 1 (PKR), app still works
        }
    };

    // Fetch rates on component mount
    useEffect(() => {
        fetchRates();
    }, []);

    const convertedPrice = (price) => {
        const rate = r[curr] || 1;
        return (price * rate).toFixed(2);
    };

    return (
        <CurrencyContext.Provider value={{ curr, setCurr, convertedPrice, buy, update_buy, booked, update_booked, removeItem, decrement_buy, setBooked, wishlistCount, fetchWishlist, increment_wishlist, decrement_wishlist, logout_wishlist }}>
            {children}
        </CurrencyContext.Provider>
    );
};
