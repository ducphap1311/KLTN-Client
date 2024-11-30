// frontend/src/components/Register.js

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Register.scss";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export const Register = () => {
  const navigate = useNavigate();
  const [registerStatus, setRegisterStatus] = useState("idle"); // 'idle', 'pending', 'success', 'rejected'
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef();

  useEffect(() => {
    if (showPassword) {
      passwordRef.current.type = "text";
    } else {
      passwordRef.current.type = "password";
    }
  }, [showPassword]);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .max(20, "User name must be 20 characters or less")
        .required("User name required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email address required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password required"),
      confirmPassword: Yup.string()
        .required("Confirm password is required") // Thêm dòng này để bắt buộc nhập
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),
    validationSchema: Yup.object({
      username: Yup.string()
        .max(20, "User name must be 20 characters or less")
        .required("User name required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email address required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password required"),
      confirmPassword: Yup.string()
        .required("Confirm password is required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),
    onSubmit: async (values) => {
      setRegisterStatus("pending");
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      };

      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/register", // Đảm bảo URL đúng
          requestOptions
        );
        if (!response.ok) {
          const errorData = await response.json();
          if ((errorData.msg = "Email already in use")) {
          }
          throw new Error(errorData.msg || "Registration failed");
        }
        const responseData = await response.json();
        setRegisterStatus("success");
      } catch (error) {
        console.error(error.message.toString());
        setRegisterStatus("email");
        // setRegisterStatus("rejected");
      }
    },
  });


  return (
    <div className="register">
      <form onSubmit={formik.handleSubmit} className="register-form">
        <h2 className="register-title">Register</h2>
        <p className="register-subtitle">
          Please register using account details below.
        </p>
        <div className="username-container">
          <Input
            type="text"
            id="username"
            name="username"
            placeholder="User Name"
            className="username-input"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.username && formik.errors.username ? (
            <p className="username-error">{formik.errors.username}</p>
          ) : null}
        </div>
        <div className="email-container">
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Email Address"
            className="email-input"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email ? (
            <p className="email-error">{formik.errors.email} </p>
          ) : null}
        </div>
        <div className="password-container">
          <Input.Password // Sử dụng thẻ input thay vì Input.Password để dễ dàng thao tác với ref
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            className="password-input"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            ref={passwordRef}
          />
          {formik.touched.password && formik.errors.password ? (
            <p className="password-error">{formik.errors.password}</p>
          ) : null}
        </div>
        <div className="password-container">
          <Input.Password // Sử dụng thẻ input thay vì Input.Password để dễ dàng thao tác với ref
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="password-input"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            // ref={passwordRef}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <p className="password-error">{formik.errors.confirmPassword}</p>
          ) : null}
        </div>
        {/* <div className="show-password-container">   
                    <input
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                    /> Show Password
                </div> */}
        {registerStatus === "email" ? (
          <p className="register-rejected">Email already in used</p>
        ) : registerStatus === "rejected" ? (
          <p className="register-rejected">
            Registration failed. Please try again.
          </p>
        ) : registerStatus === "pending" ? (
          <p className="register-pending">
            <Spin
              indicator={
                <LoadingOutlined style={{ color: "rgb(255, 0, 115)" }} spin />
              }
              size="large"
            />
          </p>
        ) : registerStatus === "success" ? (
          <p className="register-success text-[#354acf] my-2">
            Registration successful! Please check your email to verify your
            account.
          </p>
        ) : null}
        <button
          type="submit"
          className="register-btn"
          disabled={registerStatus === "pending"}
        >
          Register
        </button>
        <p className="options">
          Already have an Account?
          <Link to="/login" className="link-to-login">
            Login now
          </Link>
        </p>
        <div>
          <GoogleLogin  locale="en" onSuccess={(response) => {
                      if(response.credential) {
                        localStorage.setItem("token", response.credential)
                        const decoded = jwtDecode(response.credential)
                        console.log(decoded);
                        localStorage.setItem("username", decoded.name)
                        navigate("/")
                      }
                  }} onError={() => console.log("Login failed")
                  }/>
        </div>

      </form>
    </div>
  );
};
