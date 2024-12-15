import React, { useState, useEffect, useRef } from "react";
import "../styles/Navbar.scss";
import logo from "../assets/logo.png";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";
import messenger from "../assets/messenger.png";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Button, Tooltip } from "antd";
import { AudioOutlined, AudioMutedOutlined } from "@ant-design/icons";

export const Navbar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const [name, setName] = useState(""); // Giá trị từ bàn phím
  const [productsOption, setProductsOption] = useState([]);
  const { amount } = useSelector((store) => store.cart);
  const userName = localStorage.getItem("username") || null;
  const searchFocus = useRef();

  // Hooks của react-speech-recognition
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  // Lấy dữ liệu tìm kiếm từ API
  const getProductsOption = async () => {
    if (name !== "") {
      try {
        const response = await fetch(
          `https://kltn-server.vercel.app/api/v1/products?name=${name}`
        );
        const responseData = await response.json();
        const data = responseData.products;
        setProductsOption(data.filter((dt) => dt.isActive));
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

  // Khi transcript thay đổi và người dùng kết thúc nói, cập nhật vào input
  useEffect(() => {
    if (!listening && transcript) {
      setName((prev) => `${prev} ${transcript}`.trim());
      resetTranscript(); // Reset sau khi đã lấy dữ liệu
    }
  }, [transcript, listening, resetTranscript]);

  // Gọi API tìm kiếm sau khi người dùng dừng nhập
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

  // Bắt đầu nghe
  const startListening = () => {
    SpeechRecognition.startListening({ language: "vi-VN" });
  };
  return (
    <div className="navbar">
      <div className="navbar-header">
        <div className="menu-btn-container">
          <button className="menu-btn" onClick={() => setShowSidebar(true)}>
            <i className="fa-solid fa-bars text-black"></i>
          </button>
        </div>
        <div className="navbar-logo-container">
          <Link to="/">
            <img src={logo} alt="logo" className="w-[135px]" />
          </Link>
        </div>
        <div className="navbar-search-container">
          {/* Input Search */}
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={name} // Giá trị tổng hợp từ bàn phím và giọng nói
            onChange={(e) => setName(e.target.value)} // Cho phép chỉnh sửa từ bàn phím
            ref={searchFocus}
          />
          {/* Nút tìm kiếm */}
          <button className="search-icon-btn mr-3">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
          {/* Nút microphone */}
          <Tooltip title={listening ? "Microphone is ON" : "Microphone is OFF"}>
            <Button
              type={listening ? "primary" : "default"}
              shape="circle"
              icon={
                listening ? (
                  <AudioOutlined className="text-white" style={{ fontSize: "16px" }} />
                ) : (
                  <AudioMutedOutlined className="text-gray-600" style={{ fontSize: "16px" }} />
                )
              }
              className={`transition-transform w-10 h-10 ${
                listening ? "bg-red-500 hover:bg-red-400" : "hover:bg-gray-200"
              }`}
              onClick={() => {
                setName("")
                startListening()
              }
              }
            />
          </Tooltip>
          {/* Hiển thị kết quả tìm kiếm */}
          {productsOption.length > 0 && (
            <div className="products-option">
              {productsOption.map((product) => (
                <Link
                  to={`/products/${product._id}`}
                  key={product._id}
                  className="link-name"
                  onClick={() => setName("")}
                >
                  <img src={product.image} alt="img" className="image" />
                  <span className="name">{product.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="navbar-usercart-container">
          <div className="navbar-user">
            {userName ? (
              <>
                <p
                  className="username"
                  onClick={() => setShowDropDown(!showDropDown)}
                >
                  {userName}
                </p>
                <div
                  className={`login-register-container ${
                    showDropDown && "show-dropdown registered"
                  }`}
                >
                  <Link to="/profile">My Profile</Link>
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
                  onClick={() => setShowDropDown(!showDropDown)}
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
        <li>
          <NavLink to="/blogs" className="link">
            Blogs
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
            <button className="search-icon-btn mr-4">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
            <Tooltip title={listening ? "Microphone is ON" : "Microphone is OFF"}>
            <Button
              type={listening ? "primary" : "default"}
              shape="circle"
              icon={
                listening ? (
                  <AudioOutlined className="text-white" style={{ fontSize: "16px" }} />
                ) : (
                  <AudioMutedOutlined className="text-gray-600" style={{ fontSize: "16px" }} />
                )
              }
              className={`transition-transform w-10 h-10 ${
                listening ? "bg-red-500 hover:bg-red-400" : "hover:bg-gray-200"
              }`}
              onClick={() => {
                setName("")
                startListening()
              }
              }
            />
          </Tooltip>
            {productsOption.length > 0 && (
              <div className="products-option">
                {productsOption.map((product) => {
                  return (
                    <Link
                      to={`/products/${product._id}`}
                      key={product._id}
                      className="link-name"
                      onClick={() => {
                        setName("");
                        setShowSidebar(false);
                      }}
                    >
                      <img src={product.image} alt="img" className="image" />
                      <span className="name">{product.name}</span>
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
      <button
        onClick={() => window.open("https://m.me/108098515472393", "_blank")}
        className="fixed bottom-[70px] w-11 right-5 text-white rounded-full"
        aria-label="Open chat"
      >
        <img
          src={messenger}
          alt="messenger"
          className="w-full hover:scale-110 transition-all"
        />
      </button>
    </div>
  );
};
