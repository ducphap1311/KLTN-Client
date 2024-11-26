import React, { useEffect, useState } from "react";
import "../styles/Orders.scss";
import { Loading } from "./Loading";
import { Order } from "./Order";
import { Link } from "react-router-dom";

export const Orders = () => {
    const [orders, setOrders] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [errorUser, setErrorUser] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if(!token) {
            setIsLoading(false)
            return;
        };
        getOrders();
    }, []);

    const getOrders = async () => {
        try {
            const requestOptions = {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            };
            const response = await fetch(
                "http://localhost:5000/api/v3/orders",
                requestOptions
            );
            const responseData = await response.json();
            const data = responseData.orders;
            if(!data){
                throw new Error("Invalid user");
            }
            if (data.length === 0) {
                setIsLoading(false);
                return;
            }
            setOrders(data);
            setErrorUser(false);
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false);
            setErrorUser(true);
        }
    };

    if (isLoading) {
        return <Loading />;
    } else if (!token || errorUser) {
        return (
            <div className="login-to-continue">
                <p>Please login to continue</p>
                <Link to="/login" className="login-link">
                    Login here
                </Link>
            </div>
        );
    } else if (!orders) {
        return <h2 className="make-order">Please Make An Order</h2>;
    } else
        return (
            <div className="orders">
                <div className="orders-title">
                    <h2>Your Orders</h2>
                </div>
                <div className="orders-information">
                    <div className="total-orders">
                        <p>Total Orders: </p>
                        <span>{orders.length}</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="orders-list">
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Address</th>
                                    <th>Products</th>
                                    <th>Cost</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Detail</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => {
                                    return <Order key={order._id} {...order} />;
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
};
