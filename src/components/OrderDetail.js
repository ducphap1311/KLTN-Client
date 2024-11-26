import React, { useState, useEffect } from "react";
import "../styles/OrderDetail.scss";
import { useParams } from "react-router-dom";
import { Loading } from "./Loading";
import { Link } from "react-router-dom";

export const OrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState();

    useEffect(() => {
        getSingleOrder();
    }, []);

    const getSingleOrder = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/v3/orders/${id}`
            );
            if (!response.ok) {
                throw new Error("Invalid order id");
            }
            const responseData = await response.json();
            const data = responseData.order;
            setOrder(data);
        } catch (error) {
            setOrder();
        }
    };
    if (!order) {
        return <Loading />;
    } else {
        const date = new Date(order.createdAt);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const day = date.getDate();
        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        const formattedTime = `${hours % 12}:${String(minutes).padStart(
            2,
            "0"
        )} ${hours >= 12 ? "pm" : "am"} - ${month} ${day}th, ${year}`;
        return (
            <div className="order-detail">
                <h2 className="order-detail-title">Your order informations</h2>
                <Link to="/orders" className="back-orders-link">
                    Back to orders
                </Link>
                <div className="detail-container">
                    <div className="shipping-informations">
                        <h3>Shipping Informations</h3>
                        <p>
                            <span>Name: </span>
                            {order.name}
                        </p>
                        <p>
                            <span>Address: </span>
                            {order.address}
                        </p>
                        <p>
                            <span>Date: </span>
                            {formattedTime}
                        </p>
                        <p>
                            <span>Order total: </span>$
                            {order.orderTotal.toFixed(2)}
                        </p>
                        <p>
                            <span>Status: </span>Shipping
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="order-info">
                            <thead>
                                <tr>
                                    <th>Products</th>
                                    <th>Category</th>
                                    <th>Amount</th>
                                    <th>Price</th>
                                    <th>Total price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.cartItems.map((item) => {
                                    const {
                                        images,
                                        name,
                                        amount,
                                        price,
                                        category,
                                    } = item;
                                    return (
                                        <tr key={item._id}>
                                            <td className="products-info">
                                                <Link
                                                    to={`/products/${item._id}`}
                                                >
                                                    <img
                                                        src={images[0]}
                                                        alt="product-img"
                                                        className="product-img"
                                                    />
                                                </Link>
                                                <Link
                                                    to={`/products/${item._id}`}
                                                    className="product-name"
                                                >
                                                    <p>{name}</p>
                                                </Link>
                                            </td>
                                            <td
                                                style={{
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                {category}
                                            </td>
                                            <td>{amount}</td>
                                            <td>${price}</td>
                                            <td>
                                                ${(price * amount).toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
};
