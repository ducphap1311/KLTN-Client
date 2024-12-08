import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

const APIMessageVerification = () => {
    const location = useLocation();
    const [messageApi, contextHolder] = message.useMessage()
    const navigate = useNavigate()

    useEffect(() => {
        // Tạo đối tượng URLSearchParams từ search string của URL
        const queryParams = new URLSearchParams(location.search);
        
        // Lấy giá trị của id từ query
        const id = queryParams.get('token');

        const verifyAPI = async () => {
            // Kiểm tra nếu không có id
            if (!id) {
                message.error('No verification ID provided');
                return;
            }

            try {
                const response = await fetch(`https://kltn-server.vercel.app/api/v1/verify-email?token=${id}`);
                
                if (response.ok) {
                    // Nếu thành công
                    messageApi.success('Verification successful!');
                    setTimeout(() => {
                        navigate("/login")
                    }, 2000)
                } else {
                    // Nếu thất bại
                    messageApi.error('Verification failed. Please try again.');
                }
            } catch (error) {
                // Nếu có lỗi mạng hoặc exception
                messageApi.error('An error occurred during verification.');
                console.error('Verification error:', error);
            }
        };

        verifyAPI();
    }, [location.search]);

    return <>
        {contextHolder}
    </>; // Không render gì cả, chỉ hiển thị message
};

export default APIMessageVerification;