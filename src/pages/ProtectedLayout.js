import { message } from "antd";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const ProtectedLayout = () => {
  const [loading, setLoading] = useState(true); // Trạng thái tải
  const [isActive, setIsActive] = useState(false); // Trạng thái isActive
  const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!localStorage.getItem("email")) {
        setLoading(false)
        setIsActive(true)
        return;
      }

      try {
        const response = await fetch("https://kltn-server.vercel.app/api/v1/get-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: localStorage.getItem("email") }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user status");
        }

        const data = await response.json();
        if (!data.user.isActive) {
          localStorage.removeItem("username");
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          setLoading(false)
          setIsActive(true)
          navigate("/login");
          return;
        }
        setLoading(false)
        setIsActive(true)
        // Kiểm tra trạng thái isActive
      } catch (error) {
        console.error("Error verifying token:", error);
            setIsActive(true); // Nếu có lỗi, giả định là không hợp lệ
      } finally {
        setLoading(false); // Kết thúc tải
      }
    };

    checkUserStatus();
  }, [navigate]); // Chỉ gọi lại khi `navigate` thay đổi

  // Hiển thị loading nếu đang kiểm tra
  if (loading) {
    return; // Thêm trạng thái tải
  }
  if (isActive)
    // Nếu hợp lệ, render các route bên trong
    return <Outlet />;

  return;
};

export default ProtectedLayout;
