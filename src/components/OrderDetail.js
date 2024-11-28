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

    // Columns for the table
    const columns = [
        {
            title: "Info Type",
            dataIndex: "infoType",
            key: "infoType",
            render: (text) => <span className="font-medium text-gray-700">{text}</span>,
        },
        {
            title: "Details",
            dataIndex: "details",
            key: "details",
            render: (text) => <span className="text-gray-600">{text}</span>,
        },
    ];

    // DataSource for the table
    const dataSource = [
        {
            key: "1",
            infoType: "Name",
            details: order.name,
        },
        {
            key: "2",
            infoType: "Address",
            details: order.address,
        },
        {
            key: "3",
            infoType: "Date",
            details: formattedTime,
        },
        {
            key: "6",
            infoType: "Shipping",
            details: "5$"
        },
        {
            key: "4",
            infoType: "Order Total",
            details: `$${order.orderTotal.toFixed(2)}`,
        },
        {
            key: "5",
            infoType: "Status",
            details: <span className="text-green-600">Shipping</span>,
        },
    ];

    const productColumns = [
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
            title: "Size",
            dataIndex: "size",
            key: "size",
            align: "center",
            render: (size) => <span className="text-gray-700">{size}</span>,
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
        // {
        //     title: "Total Price",
        //     dataIndex: "totalPrice",
        //     key: "totalPrice",
        //     render: (_, record) => `$${(record.price * record.amount).toFixed(2)}`,
        //     align: "right",
        // },
    ];

    const productDataSource = order.cartItems.map((item) => ({
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
                        General Information
                    </h3>
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        pagination={false}
                        bordered
                        className="mb-6"
                    />
                </div>
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Products
                    </h3>
                    <Table
                        dataSource={productDataSource}
                        columns={productColumns}
                        pagination={false}
                        scroll={{ x: "1000px" }} // Enable horizontal scroll
                    />
                </div>
            </div>
        </div>
    );
};
