import React from 'react'
import { Link } from 'react-router-dom'
const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg  " style={{ backgroundColor: "#FFC3C3" }}>
            <div className="container-fluid mx-4">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <Link className="nav-link active dropdown-toggle" aria-disabled="true" to="/shop" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Shop
                            </Link>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="#">Flowers</Link></li>
                                <li><Link className="dropdown-item" to="#">Leaves</Link></li>
                                <li><Link className="dropdown-item" to="#">Magic Glitter</Link></li>
                                <li><Link className="dropdown-item" to="#">Embellishments</Link></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" to="/gallery" aria-disabled="true">Gallery</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" to="/contact" aria-disabled="true">Contact</Link>
                        </li>
                    </ul>
                    <form className="d-flex input-group w-auto my-auto mb-3 mb-md-0 mx-4">
                        <div className="input-group">
                            <input autocomplete="off" type="search" className="form-control rounded-start-pill" placeholder="Search" style={{ border: "2px solid white", borderRight: "transparent" }} />
                            <div className='rounded-end-pill' style={{ border: "2px solid white", borderLeft: "transparent" }}>
                                <span className="input-group-text bg-white border-0 rounded-end-pill" style={{ height: "2.5rem" }}><i className="fas fa-search"></i></span>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
