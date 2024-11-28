import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button } from "antd";
import {
    increaseItem,
    decreaseItem,
    removeItem,
} from "../features/cart/cartSlice";

export const CartItems = () => {
    const dispatch = useDispatch();
    const { total, cartItems } = useSelector((store) => store.cart);
    const token = localStorage.getItem("token");

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 mt-32">
                <div className="text-center">
                    <h2 className="text-4xl font-semibold text-gray-800">
                        Your cart is empty
                    </h2>
                    <Link
                        to="/products"
                        className="text-white bg-blue-600 mt-4 inline-block rounded-md px-5 py-2 text-xl hover:bg-blue-700"
                    >
                        Fill it
                    </Link>
                </div>
            </div>
        );
    }

    const columns = [
        {
            title: "Product",
            dataIndex: "product",
            key: "product",
            render: (text, record) => (
                <div className="flex items-center space-x-4">
                    <Link to={`/products/${record._id}`}>
                        <img
                            src={record.images[0]}
                            alt={record.name}
                            className="w-16 h-16 object-cover rounded-md border"
                        />
                    </Link>
                    <div>
                        <Link
                            to={`/products/${record._id}`}
                            className="font-medium text-gray-700 hover:text-blue-600"
                        >
                            {record.name}
                        </Link>
                        <button
                            onClick={() =>
                                dispatch(removeItem({ id: record._id, size: record.size }))
                            }
                            className="block text-sm text-red-500 hover:underline mt-1"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ),
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price) => `$${price.toFixed(2)}`,
        },
        {
            title: "Size",
            dataIndex: "size",
            key: "size",
        },
        {
            title: "Quantity",
            dataIndex: "amount",
            key: "amount",
            render: (amount, record) => (
                <div className="flex items-center space-x-2">
                    <Button
                        size="small"
                        onClick={() =>
                            dispatch(increaseItem({ id: record._id, size: record.size }))
                        }
                    >
                        +
                    </Button>
                    <span>{amount}</span>
                    <Button
                        size="small"
                        onClick={() =>
                            dispatch(decreaseItem({ id: record._id, size: record.size }))
                        }
                    >
                        -
                    </Button>
                </div>
            ),
        },
        {
            title: "Total",
            dataIndex: "total",
            key: "total",
            render: (text, record) => `$${(record.price * record.amount).toFixed(2)}`,
        },
    ];

    const dataSource = cartItems.map((item) => ({
        key: item._id,
        ...item,
    }));

    return (
        <div className="container mx-auto px-4 py-8 mt-24 max-w-[1200px]">
            <div className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-between border-b pb-4 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Your Cart Items
                    </h2>
                    <Link
                        to="/products"
                        className="text-blue-600 hover:underline font-medium"
                    >
                        Back to Shopping
                    </Link>
                </div>

                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                    className="cart-items-table"
                />

                <div className="mt-6 flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="text-lg text-gray-800 font-medium">
                        <p>
                            Sub-total:{" "}
                            <span className="text-blue-600 font-semibold">
                                ${total.toFixed(2)}
                            </span>
                        </p>
                        <p className="text-sm text-gray-500">
                            Tax and shipping costs will be calculated later.
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        {token ? (
                            <Link to="/checkout">
                                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
                                    Check-out
                                </button>
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => {
                                    localStorage.removeItem("username");
                                }}
                            >
                                <button className="px-6 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700">
                                    Login
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
