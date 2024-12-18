import { Spin } from "antd";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Navbar } from "./components/Navbar";

export const ProtectedRoute = () => {
  const [authorized, setAuthorized] = useState(undefined);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkAuthorization = async () => {
      if (!token) {
        setAuthorized(false);
        return;
      }

      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await fetch(
          "https://kltn-server.vercel.app/api/v1/dashboard",
          requestOptions
        );
        const responseData = await response.json();

        // Giả sử API trả về { msg: "success" } khi user hợp lệ
        if (responseData.msg === "success") {
          setAuthorized(true);
        } else {
          setAuthorized(false);
          localStorage.removeItem("username")
          localStorage.removeItem("email")
          localStorage.removeItem("")
        }
      } catch (error) {
        console.error(error);
        setAuthorized(false);
      }
    };

    checkAuthorization();
  }, [token]);

  if (authorized === undefined) {
    return <Navbar />; 
  }

  if (!authorized) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
