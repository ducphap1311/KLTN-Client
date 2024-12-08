import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { Loading } from "./Loading";
import { Link } from "react-router-dom";

export const Orders = () => {
    const [orders, setOrders] = useState([]); // Sử dụng giá trị mặc định là mảng rỗng
    const [isLoading, setIsLoading] = useState(true);
    const [errorUser, setErrorUser] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            setIsLoading(false);
            return;
        }
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
                "http://localhost:5000/api/v1/orders",
                requestOptions
            );

            const responseData = await response.json();
            const data = responseData.orders || []; // Đảm bảo `data` là mảng rỗng nếu không có dữ liệu

            setOrders(data);
            setErrorUser(false);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setIsLoading(false);
            setErrorUser(true);
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    if (!token || errorUser) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <p className="text-gray-800 text-lg">Please login to continue</p>
                <Link
                    to="/login"
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Login here
                </Link>
            </div>
        );
    }

    if (!orders.length) { // Kiểm tra nếu orders rỗng
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 mt-32">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Please Make An Order
                </h2>
            </div>
        );
    }

    const columns = [
        {
            title:"Order ID",
            dataIndex: "key",
            key: "orderID",
            width: 150
        },
        {
            title: "Customer",
            dataIndex: "customerName",
            key: "customerName",
            width: 150
        },
        {
            title: "Phone number",
            dataIndex: "phone",
            key: "phone",
            width: 150
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            width: 500,
            
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (amount) => `${amount} items`,
            width: 150
        },
        {
            title: "Cost",
            dataIndex: "orderTotal",
            key: "orderTotal",
            render: (orderTotal) => `${orderTotal.toLocaleString('vi-VN')} VND`,
            width: 150
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            width: 150,
            key: "createdAt",
            render: (createdAt) => {
                const date = new Date(createdAt);
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
                return `${month} ${day}, ${year}`;
            },
        },
        {
            title: "Shipping status",
            dataIndex: "status",
            width: 150,
            key: "status",
            render: (status) => (
                <span
                    className={`px-2 py-1 rounded ${
                        status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : status === "Cancelled"? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                    {status}
                </span>
            ),
        },
        {
            title: "Payment status",
            dataIndex: "paymentStatus",
            width: 150,
            key: "isPaid",
            render: (isPaid) => (
                <span
                    className={`px-2 py-1 rounded ${
                        isPaid 
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                    {isPaid ? <>Paid</>: <>Unpaid</>}
                </span>
            ),
        },
        {
            title: "Detail",
            width: 150,
            key: "detail",
            render: (text, record) => (
                <Link
                    to={`/orders/${record.key}`}
                    className="text-blue-600 hover:underline"
                >
                    View Detail
                </Link>
            ),
        },
    ];

    const dataSource = orders.map((order) => ({
        key: order._id,
        phone: order.phone,
        customerName: order.name || "Unknown",
        address: order.address || "No Address",
        amount: order.amount || 0,
        orderTotal: order.orderTotal || 0,
        createdAt: order.createdAt,
        status: order.status || "Pending",
        paymentStatus: order.isPaid
    }));
    
    return (
        <div className="container mx-auto px-4 py-8 md:mt-32 mt-20">
            <div className="bg-white rounded-lg p-6">
                <div className="border-b pb-4 mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Your Orders
                    </h2>
                </div>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={{ pageSize: 5 }}
                    className="orders-table"
                    scroll={{ x: "max-content" }} 
                />
            </div>
        </div>
    );
};
