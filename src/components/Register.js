import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/Register.scss";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Input, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';

// const validate = (values) => {
//     const errors = {};
//     if (!values.username) {
//         errors.username = "User name required";
//     } else if (values.username.length > 20) {
//         errors.username = "Must be 20 characters or less";
//     }

//     if (!values.email) {
//         errors.email = "Email address required";
//     } else if (
//         !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
//     ) {
//         errors.email = "Invalid email address";
//     }

//     if (!values.password) {
//         errors.password = "Password required";
//     }

//     return errors;
// };

export const Register = () => {
    const navigate = useNavigate();
    const [registerStatus, setRegisterStatus] = useState();
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
                    "http://localhost:5000/api/v2/register",
                    requestOptions
                );
                if (!response.ok) {
                    throw new Error("Invalid email or password");
                }
                const responseData = await response.json();
                const { token, username } = responseData;
                localStorage.setItem("token", token);
                localStorage.setItem("username", username);
                navigate("/");
            } catch (error) {
                setRegisterStatus("rejected");
            }
        },
    });
    return (
        <div className="register">
            <form onSubmit={formik.handleSubmit} className="register-form">
                <h2 className="register-title">Register</h2>
                <p className="register-subtitle">
                    Please register using account detail bellow.
                </p>
                <div className="username-container">
                    <input
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
                        <p className="username-error">
                            {formik.errors.username}
                        </p>
                    ) : null}
                </div>
                <div className="email-container">
                    <input
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
                    <Input.Password
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
                        <p className="password-error">
                            {formik.errors.password}
                        </p>
                    ) : null}
                </div>
                <div className="show-password-container">
                </div>
                {registerStatus === "rejected" ? (
                    <p className="register-rejected">Invalid email or email used</p>
                ) : registerStatus === "pending" ? (
                    <p
                        className="register-pending"
                    >
                        <Spin indicator={<LoadingOutlined style={{color: "rgb(255, 0, 115)"}} spin />} size="large" />
                    </p>
                ) : null}
                <button type="submit" className="register-btn">
                    Register
                </button>
                <p className="options">
                    Already have an Account?
                    <Link to="/login" className="link-to-login">
                        Login now
                    </Link>
                </p>
            </form>
        </div>
    );
};
