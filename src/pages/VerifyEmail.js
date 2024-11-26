// frontend/src/pages/VerifyEmail.js

import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
// import "../styles/VerifyEmail.scss"; // Tùy chọn: Tạo style riêng cho trang này

const VerifyEmail = () => {
    const location = useLocation();
    const [status, setStatus] = useState("loading"); // 'loading', 'success', 'error'

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const token = query.get("token");

        const verifyEmail = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/v1/verify-email?token=${token}`);
                const data = await response.json();
                if (response.ok) {
                    setStatus("success");
                } else {
                    setStatus("error");
                }
            } catch (error) {
                console.error(error);
                setStatus("error");
            }
        };

        if (token) {
            verifyEmail();
        } else {
            setStatus("error");
        }
    }, [location.search]);

    return (
        <div className="verify-email">
            {status === "loading" && (
                <Spin indicator={<LoadingOutlined style={{color: "rgb(255, 0, 115)"}} spin />} size="large" />
            )}
            {status === "success" && (
                <div>
                    <h2>Email Verified Successfully!</h2>
                    <p>Your email has been verified. You can now <Link to="/login">login</Link>.</p>
                </div>
            )}
            {status === "error" && (
                <div>
                    <h2>Verification Failed</h2>
                    <p>The verification link is invalid or has expired.</p>
                </div>
            )}
        </div>
    );
};

export default VerifyEmail;
