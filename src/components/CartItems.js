// src/components/CartItem.js

import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    increaseItem,
    decreaseItem,
    removeItem,
} from "../features/cart/cartSlice";
import "../styles/CartItems.scss";

export const CartItems = () => {
    const dispatch = useDispatch();
    const { total, cartItems } = useSelector((store) => store.cart);
    const token = localStorage.getItem("token");

    if (cartItems.length !== 0) {
        return (
            <div className="cart-items">
                <div className="cart-items-container">
                    <div className="cart-items-header">
                        <h2 className="header-title">Your Cart Items</h2>
                        <Link to="/products">
                            <p className="back-to-shop-link">
                                Back to Shopping
                            </p>
                        </Link>
                    </div>
                    <div className="cart-items-list">
                        <div className="title">
                            <h3 className="title-name">Product</h3>
                            <h3 className="title-price">Price</h3>
                            <h3 className="title-size">Size</h3>
                            <h3 className="title-quantity">Quantity</h3>
                            <h3 className="title-total">Total</h3>
                        </div>
                        {cartItems.map((item, index) => {
                            const { _id, images, name, price, amount, size } = item;
                            return (
                                <div key={index} className="item">
                                    <div className="item-info">
                                        <Link to={`/products/${_id}`}>
                                            <img
                                                src={images[0]}
                                                alt="img"
                                                className="product-img"
                                            />
                                        </Link>
                                        <div className="product-info1">
                                            <div>
                                                <Link to={`/products/${_id}`} className="product-name">
                                                    <h2 className="product-name">
                                                        {name}
                                                    </h2>
                                                </Link>
                                                <button
                                                    className="remove-btn"
                                                    onClick={() => {
                                                        dispatch(
                                                            removeItem({ id: _id, size })
                                                        );
                                                    }}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                            <div>
                                                <p className="product-price">
                                                    ${price.toFixed(2)}
                                                </p>
                                                <p className="product-size">
                                                    Size: {size}
                                                </p>
                                                <div className="product-quantity">
                                                    <button
                                                        className="btn increase-btn"
                                                        onClick={() =>
                                                            dispatch(
                                                                increaseItem({ id: _id, size })
                                                            )
                                                        }
                                                    >
                                                        <i className="fas fa-plus"></i>
                                                    </button>
                                                    <span>{amount}</span>
                                                    <button
                                                        className="btn decrease-btn"
                                                        onClick={() =>
                                                            dispatch(
                                                                decreaseItem({ id: _id, size })
                                                            )
                                                        }
                                                    >
                                                        <i className="fas fa-minus"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="item-price">${price.toFixed(2)}</p>
                                    <p className="item-size">{size}</p>
                                    <div className="item-quantity">
                                        <div className="quantity-container">
                                            <button
                                                className="btn increase-btn"
                                                onClick={() =>
                                                    dispatch(increaseItem({ id: _id, size }))
                                                }
                                            >
                                                <i className="fas fa-plus"></i>
                                            </button>
                                            <span>{amount}</span>
                                            <button
                                                className="btn decrease-btn"
                                                onClick={() =>
                                                    dispatch(decreaseItem({ id: _id, size }))
                                                }
                                            >
                                                <i className="fas fa-minus"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <p className="item-total">
                                        ${(price * amount).toFixed(2)}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                    <div className="cart-items-check-out">
                        <div className="sub-total">
                            <p className="total">
                                <span>Sub-total:</span>
                                <span className="total-number">${total.toFixed(2)}</span>
                            </p>
                            <p className="tax">
                                Tax and shipping cost will be calculated later
                            </p>
                        </div>
                        {token ? (
                            <Link to="/checkout">
                                <button>Check-out</button>
                            </Link>
                        ) : (
                            <Link to="/login" onClick={() => {
                                localStorage.removeItem('username');
                            }}>
                                <button>Login</button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        );
    }else {
        return (
            <div className="empty-cart">
                <h2>Your cart is empty</h2>
                <Link to="/products" className="fill-link">
                    Fill it
                </Link>
            </div>
        );
    };
};
