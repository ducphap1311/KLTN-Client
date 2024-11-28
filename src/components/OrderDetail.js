import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Table } from "antd";
import { Loading } from "./Loading";

export const OrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState();

    useEffect(() => {
        getSingleOrder();
    }, []);

    const getSingleOrder = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/v1/orders/${id}`
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
    }

    const date = new Date(order.createdAt);
    const formattedTime = `${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    })} - ${date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    })}`;

    const columns = [
        {
            title: "Products",
            dataIndex: "product",
            key: "product",
            render: (_, record) => (
                <div className="flex items-center space-x-4">
                    <Link to={`/products/${record._id}`}>
                        <img
                            src={record.images[0]}
                            alt={record.name}
                            className="w-16 h-16 object-cover rounded-md"
                        />
                    </Link>
                    <Link
                        to={`/products/${record._id}`}
                        className="font-medium text-gray-700 hover:text-blue-600"
                    >
                        {record.name}
                    </Link>
                </div>
            ),
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            render: (text) => (
                <span className="capitalize text-gray-600">{text}</span>
            ),
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            align: "center",
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price) => `$${price.toFixed(2)}`,
            align: "right",
        },
        {
            title: "Total Price",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (_, record) => `$${(record.price * record.amount).toFixed(2)}`,
            align: "right",
        },
    ];

    const dataSource = order.cartItems.map((item) => ({
        key: item._id,
        ...item,
    }));

    return (
        <div className="container mx-auto px-4 py-8 max-w-[1200px]">
            <div className="bg-white rounded-lg p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                        Your Order Information
                    </h2>
                    <Link
                        to="/orders"
                        className="text-blue-600 hover:underline text-sm"
                    >
                        Back to orders
                    </Link>
                </div>
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Shipping Information
                    </h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                        <li>
                            <span className="font-medium">Name: </span>
                            {order.name}
                        </li>
                        <li>
                            <span className="font-medium">Address: </span>
                            {order.address}
                        </li>
                        <li>
                            <span className="font-medium">Date: </span>
                            {formattedTime}
                        </li>
                        <li>
                            <span className="font-medium">Order Total: </span>
                            ${order.orderTotal.toFixed(2)}
                        </li>
                        <li>
                            <span className="font-medium">Status: </span>
                            <span className="text-green-600">Shipping</span>
                        </li>
                    </ul>
                </div>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                    className="order-items-table"
                />
            </div>
        </div>
    );
};
