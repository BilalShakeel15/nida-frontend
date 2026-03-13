import React, { useEffect, useState } from 'react'
import logo from '../images/nida logo.png'
import '../App.css'
import { Link, useNavigate } from 'react-router-dom'
import { useCurrency } from '../context/CurrencyContext';
import wishlistIcon from "../images/wishlistIcon.png";
import cartIcon from "../images/cartIcon.png";


const Top = () => {
  const API = process.env.REACT_APP_API_URL;
  const { buy, booked, wishlistCount, fetchWishlist, logout_wishlist } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const navigate_to_shop = useNavigate();
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');


  const handleNavigation = (item) => {
    localStorage.setItem('item', item.name);

    navigate_to_shop('/shop');
  }

  const check_logout = () => {
    localStorage.removeItem('admin');
    navigate('/');
  }

  const user_logout = () => {
    localStorage.removeItem('token');
    logout_wishlist()
    setUser(null);
    navigate('/');
  }
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const searchitem = () => {
    navigate('/shop', { state: { searchTerm } });
  }
  useEffect(() => {
    // Fetch categories from the database
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API}/api/admin/getcategory`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        const json = await response.json();
        setCategories(json);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // Check if user is logged in
    if (token) {
      const checkUser = async () => {
        try {
          const response = await fetch(`${API}/api/auth/getuser`, {
            headers: {
              'auth-token': token
            }
          });
          const data = await response.json();
          if (data.success) {
            setUser(data.user);
          }
        } catch (error) {
          console.error('Error checking user:', error);
          localStorage.removeItem('token');
        }
      };
      checkUser();
      fetchWishlist()
      // console.log("loggedin", token, wishlistCount);

    }
  }, [token]);

  return (
    <>
      {!localStorage.getItem('admin') ? (<div className='fixed-top '>
        {/* <div>
          <header className="header">
            <div className="header-content">
              <div className="logo">
                <img src={logo} alt="Nida Crafteria Logo" />
                <div className='d-flex flex-column'>
                  <h3 style={{ textAlign: "justify", fontFamily: "Amatic SC", fontWeight: "bolder" }}>NIDA</h3>
                  <h3 style={{ fontFamily: "Amatic SC", fontWeight: "bolder" }}>CRAFTERIA</h3>
                </div>
                <div className='d-flex justify-content-center align-items-center mx-2'>
                  <h4 style={{ fontFamily: "Dancing Script", color: "rgb(53 44 44)", fontSize: "1.5rem", marginBottom: "20px" }}>designer of beautiful moments.</h4>
                </div>
              </div>
              <div className="right-section">
                <div className="auth-buttons">
                  {!user ? (
                    <>
                      <Link className=" " to="/login" role="button"><button className='login'>Login</button></Link>
                      <Link className=" " to="/signup" role="button"><button className='signup'>Signup</button></Link>
                    </>
                  ) : (
                    <div className="d-flex align-items-center">
                      <span className="me-3 text-dark">Welcome, {user.name}</span>
                      <Link className="me-2" to="/wishlist" role="button">
                        <button className='btn btn-sm wishlist-btn' style={{ backgroundColor: '#ffc3c3', color: 'black', border: '2px solid #ffc3c3' }}>
                          <i className="fas fa-heart"></i> Wishlist
                        </button>
                      </Link>
                      <button className='btn btn-outline-danger btn-sm' style={{ color: 'black' }} onClick={user_logout}>Logout</button>
                    </div>
                  )}
                </div>
                <div className="cart">
                  <Link className="text-reset me-3" to="/shoppingcart">
                    <div className="icon-container" style={{ position: 'relative', display: 'inline-block' }}>
                      <span><i className="fas fa-shopping-cart" style={{ fontSize: "x-large" }} ></i></span>
                      <span className="badge rounded-pill badge-notification bg-danger" style={{ position: 'absolute', top: '-10px', right: '-10px' }}>{buy}</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </header>

        </div> */}
        <nav className="navbar navbar-expand-lg navbar-top" style={{ backgroundColor: "#FFC3C3" }}>
          <div className="container-fluid">



            {/* Mobile Logo + Hamburger */}
            <div className="d-flex d-lg-none align-items-center w-100">
              {/* Hamburger on left */}
              <button
                className="navbar-toggler me-2"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              {/* Logo + Title next to hamburger */}
              <Link
                to="/"
                className="navbar-brand d-flex align-items-center"
                style={{ fontFamily: "Amatic SC", fontWeight: "bold", fontSize: "20px" }}
              >
                <img
                  src={logo}
                  alt="Nida Logo"
                  style={{ height: "38px" }}
                  className="me-2"
                />
                NIDA HANDMADE CARDS
              </Link>
            </div>


            {/* Collapsible Menu */}
            <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
              {/* Left Section */}
              <ul className="navbar-nav d-flex gap-3" style={{ fontFamily: "Inter", fontSize: "16px" }}>
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#about">About Us</a>
                </li>
                <li className="nav-item dropdown">
                  <Link className="nav-link" to="/categorydisplay">
                    Shop
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/contact">Contact</Link>
                </li>
              </ul>
              {/* Desktop Center Logo */}
              <div className="mx-auto d-none d-lg-block text-center">
                <Link to="/" className="navbar-brand d-flex align-items-center justify-content-center"
                  style={{ fontFamily: "Amatic SC", fontWeight: "bold", fontSize: "28px" }}>
                  <img src={logo} alt="Nida Logo" style={{ height: "62px" }} className="me-2" />
                  NIDA HANDMADE CARDS
                </Link>
              </div>

              {/* Right Section */}
              <ul className="navbar-nav d-flex align-items-center gap-3">
                <li className="nav-item icon-item">
                  <Link to="/wishlist" className="icon-link">
                    <img src={wishlistIcon} alt="Wishlist" />
                    {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
                  </Link>
                </li>

                <li className="nav-item icon-item">
                  <Link to="/shoppingcart" className="icon-link">
                    <img src={cartIcon} alt="Cart" />
                    {buy > 0 && <span className="badge">{buy}</span>}
                  </Link>
                </li>

                {!user ? (
                  <>
                    <li className="nav-item">
                      <Link to="/login" className="nav-link">
                        <button className="btn btn-light px-3 d-flex justify-content-center" style={{ width: "98px", height: "36px", fontSize: "16px", fontFamily: "Inter", backgroundColor: "#d4358c", color: "white", border: "2px solid #d4358c" }}>
                          Sign In
                        </button>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/signup" className="nav-link">
                        <button className="btn btn-outline-light px-3 d-flex justify-content-center" style={{ width: "98px", height: "36px", fontSize: "16px", fontFamily: "Inter", color: "black" }}>
                          Sign Up
                        </button>
                      </Link>
                    </li>
                  </>
                ) : (
                  <li className="nav-item d-flex align-items-center">
                    <span className="me-2">Welcome, {user.name}</span>
                    <button className="btn btn-outline-danger btn-sm" onClick={user_logout} style={{ width: "98px", height: "35px", fontSize: "16px", fontFamily: "Inter", backgroundColor: "#b71c6c", color: "white", marginLeft: "0.5rem" }}>Logout</button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>




      </div>
      ) : (
        // <nav className="navbar navbar-dark bg-dark fixed-top">
        //   <div className="container-fluid">

        //     <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
        //       <span className="navbar-toggler-icon"></span>
        //     </button>
        //     <div className="offcanvas offcanvas-start text-bg-dark" tabIndex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
        //       <div className="offcanvas-header">
        //         <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">Dark offcanvashii</h5>
        //         <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        //       </div>
        //       <div className="offcanvas-body">
        //         <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
        //           <li className="nav-item">
        //             <Link className="nav-link active" aria-current="page" to="/adminhome">Home</Link>
        //           </li>
        //           <li className="nav-item">
        //             <Link className="nav-link text-white" to="/orders">Orders</Link>
        //           </li>
        //           <li className="nav-item">
        //             <Link className="nav-link" to="/confirmorders">Delivered Orders</Link>
        //           </li>
        //           <li className="nav-item">
        //             <Link className="nav-link" to="/addproduct">Add Product</Link>
        //           </li>
        //           <li className="nav-item">
        //             <Link className="nav-link" to="/addcategory">Add Category</Link>
        //           </li>
        //           <li className="nav-item">
        //             <Link className="nav-link" to="/banner">Banner</Link>
        //           </li>
        //           <li className="nav-item">
        //             <Link className="nav-link" to="/allproducts">All Products</Link>
        //           </li>
        //           {/* <li className="nav-item dropdown">
        //             <Link className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        //               Dropdown
        //             </Link>
        //             <ul className="dropdown-menu dropdown-menu-dark">
        //               <li><Link className="dropdown-item" to="#">Action</Link></li>
        //               <li><Link className="dropdown-item" to="#">Another action</Link></li>
        //               <li>
        //                 <hr className="dropdown-divider" />
        //               </li>
        //               <li><Link className="dropdown-item" to="#">Something else here</Link></li>
        //             </ul>
        //           </li> */}
        //         </ul>
        //         {/* <form className="d-flex mt-3" role="search">
        //           <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
        //           <button className="btn btn-success" type="submit">Search</button>
        //         </form> */}
        //         <button className='btn btn-dark' onClick={check_logout}>Logout</button>
        //       </div>
        //     </div>
        //     <Link className="navbar-brand" to="#">Welcome Nida</Link>
        //   </div>
        // </nav>
        "")}
    </>
  )
}

export default Top
