import React, { useState, useEffect, useRef } from "react";
import "../styles/Navbar.scss";
import logo from "../assets/logo.png";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";

export const Navbar = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    const [showDropDown, setShowDropDown] = useState(false);
    const [name, setName] = useState("");
    const [productsOption, setProductsOption] = useState([]);
    const { amount } = useSelector((store) => store.cart);
    const userName = localStorage.getItem("username") || null;
    const searchFocus = useRef();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    };

    const getProductsOption = async () => {
        if (name !== "") {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/v1/products?name=${name}`
                );
                const responseData = await response.json();
                const data = responseData.products;
                setProductsOption(data.filter(dt => dt.isActive));
            } catch (error) {
                console.log(error);
            }
        } else {
            setProductsOption([]);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("token");
    };

    useEffect(() => {
        // searchFocus.current.focus();
    });

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            getProductsOption();
        }, 500);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [name]);

    return (
        <div className="navbar">
            <div className="navbar-header">
                <div className="menu-btn-container">
                    <button
                        className="menu-btn"
                        onClick={() => setShowSidebar(true)}
                    >
                        <i className="fa-solid fa-bars text-black"></i>
                    </button>
                </div>
                <div className="navbar-logo-container">
                    <Link to="/">
                        <img src={logo} alt="logo" className="w-20" />
                    </Link>
                </div>
                <div className="navbar-search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        ref={searchFocus}
                    />
                    <button className="search-icon-btn">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                    {productsOption.length > 0 && (
                        <div className="products-option">
                            {productsOption.map((product) => {
                                return (
                                    <Link
                                        to={`/products/${product._id}`}
                                        key={product._id}
                                        className="link-name"
                                        onClick={() => setName("")}
                                    >
                                        <img src={product.image} alt='img' className='image' />
                                        <span className="name">
                                            {product.name}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
                <div className="navbar-usercart-container">
                    <div className="navbar-user">
                        {userName ? (
                            <>
                                <p
                                    className="username"
                                    onClick={() =>
                                        setShowDropDown(!showDropDown)
                                    }
                                >
                                    {userName}
                                </p>
                                <div
                                    className={`login-register-container ${
                                        showDropDown && "show-dropdown registered"
                                    }`}
                                >
                                    {/* <Link to="/profile">My Profile</Link> */}
                                    <Link to="/orders">My Orders</Link>
                                    <Link to="/login" onClick={handleLogout}>
                                        Logout
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <>
                                <button
                                    className="user-icon-btn"
                                    onClick={() =>
                                        setShowDropDown(!showDropDown)
                                    }
                                >
                                    <i className="fa-solid fa-user"></i>
                                </button>
                                <div
                                    className={`login-register-container ${
                                        showDropDown && "show-dropdown"
                                    }`}
                                >
                                    <Link to="/login">Login</Link>
                                    <Link to="/register">Register</Link>
                                </div>
                            </>
                        )}
                    </div>

                    <Link to="/cart" className="navbar-cart">
                        <button className="cart-icon-btn">
                            <i className="fa-solid fa-cart-shopping"></i>
                            <p className="amount">{amount}</p>
                        </button>
                    </Link>
                </div>
            </div>
            <ul className="navbar-links">
                <li>
                    <NavLink to="/" className="link">
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/about-us" className="link">
                        About Us
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/products" className="link">
                        Products
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/contact" className="link">
                        Contact
                    </NavLink>
                </li>
            </ul>
            <div className={`sidebar ${showSidebar && "show-sidebar"}`}>
                <div
                    className={`sidebar-container ${
                        showSidebar && "show-sidebar-container"
                    }`}
                >
                    <div className="sidebar-search">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <button className="search-icon-btn">
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </button>
                        {productsOption.length > 0 && (
                            <div className="products-option">
                                {productsOption.map((product) => {
                                    return (
                                        <Link
                                        to={`/products/${product._id}`}
                                        key={product._id}
                                        className="link-name"
                                        onClick={() => {
                                            setName("")
                                            setShowSidebar(false)
                                        }}
                                    >
                                        <img src={product.image} alt='img' className='image' />
                                        <span className="name">
                                            {product.name}
                                        </span>
                                    </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <ul className="sidebar-links">
                        <li>
                            <Link to="/" className="link">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/about-us" className="link">
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link to="/products" className="link">
                                Products
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className="link">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>
                <button
                    className="close-sidebar-btn"
                    onClick={() => setShowSidebar(false)}
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>
            <button onClick={scrollToTop} className="navbar-scroll-to-top-btn">
                <i className="fa-solid fa-arrow-up"></i>
            </button>
        </div>
    );
};
