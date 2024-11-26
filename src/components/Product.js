import React, { memo } from "react";
import "../styles/Product.scss";
import { Link } from "react-router-dom";
import { addItem } from "../features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Product = ({ product }) => {
    const dispatch = useDispatch();
    const {cartItems} = useSelector(store => store.cart)

    const addToCart = async (_id, amount, totalAmount) => {
        if (totalAmount === 0) {
            toast("The product is out of stock", {
                type: "error",
                draggable: false,
            });
            return;
        }
        if (amount > totalAmount) {
            toast("Not enough products to add", {
                type: "error",
                draggable: false,
            });
            return;
        } else {
            let flag = false;
            cartItems.forEach((item) => {
                if (item._id === _id) {
                    if (item.amount + amount > totalAmount) {
                        flag = true;
                        toast(
                            "The selected quantity exceed your purchase limit",
                            {
                                type: "error",
                                draggable: false,
                            }
                        );
                    }
                }
            });
            if (!flag) {
                toast("Add to cart successfully", {
                    type: "success",
                    draggable: false,
                });
                dispatch(addItem({ id: _id, amount, totalAmount }));
            } else {
                return;
            }
        }
        
        // try {
        //     const requestOptions = {
        //         method: "PUT",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify({
        //             totalAmount: totalAmount - 1,
        //         }),
        //     };
        //     const response = await fetch(
        //         `http://localhost:5000/api/v1/products/${_id}`,
        //         requestOptions
        //     );
        //     console.log(response);
        //     dispatch(addItem({ id: _id, amount }));
        //     toast("Add to cart successfully!", {
        //         type: "success",
        //         draggable: false,
        //     });
        // } catch (error) {
        //     console.log(error);
        // }
    };

    return (
        <div key={product._id} className="product-info">
            <Link to={`/products/${product._id}`}>
                <img
                    src={product.images[0]}
                    alt="product-img"
                    className="product-img"
                />
            </Link>
            <p className="product-name">{product.name}</p>
            <p className="product-price">
                <i className="fa-solid fa-dollar-sign"></i>
                {product.price}
            </p>
            <button
                className="add-btn"
                onClick={() => addToCart(product._id, 1, product.totalAmount)}
            >
                Add To Cart
            </button>
        </div>
    );
};

export default memo(Product);
