import React, { useState, useEffect, useRef } from "react";
import closeImg from "../assets/close.png";
import "../styles/Login.scss";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Input } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const passwordRef = useRef();
    const [loginStatus, setLoginStatus] = useState();
    const [emailStatus, setEmailStatus] = useState();
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (showPassword) {
            passwordRef.current.type = "text";
        } else {
            passwordRef.current.type = "password";
        }
    }, [showPassword]);
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .required("Email address required")
                .email("Invalid email address"),
            password: Yup.string()
                .required("Password required")
                .min(8, "Password must be at least 8 characters"),
        }),
        onSubmit: async (values) => {
            setLoginStatus("pending");
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                }),
            };
            try {
                const response = await fetch(
                    "https://kltn-server.vercel.app/api/v1/login",
                    requestOptions
                );
                if (!response.ok) {
                    throw new Error("Invalid email or password");
                }
                const responseData = await response.json();
                const { username, token, isActive } = responseData;
                if(!isActive) {
                    setLoginStatus("banned")
                    return;
                }
                localStorage.setItem("username", username);
                localStorage.setItem("token", token);
                localStorage.setItem("email", values.email);
                navigate("/");
            } catch (error) {
                setLoginStatus("rejected");
            }
        },
    });

    const checkEmailFunction = async () => {
        setEmailStatus("pending");
        try {
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            };
            const response = await fetch(
                "https://kltn-server.vercel.app/api/v1/forgot-password",
                requestOptions
            );
            if (!response.ok) {
                throw new Error("Invalid email");
            }
            const responseData = await response.json();
            localStorage.setItem(
                "resetPasswordToken",
                responseData.resetPasswordToken
            );
            await sendEmail();
            setEmailStatus("fulfilled");
        } catch (error) {
            setEmailStatus("rejected");
        }
    };

    const sendEmail = async () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                token: localStorage.getItem("resetPasswordToken"),
            }),
        };
        await fetch("https://kltn-server.vercel.app/api/v1/send-email", requestOptions);
        localStorage.removeItem('resetPasswordToken')
    };

    return (
        <div className="login">
            <form onSubmit={formik.handleSubmit} className="login-form">
                <h2 className="login-title">Login</h2>
                <p className="login-subtitle">
                    Please login using account detail bellow.
                </p>
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
                        <p className="email-error">{formik.errors.email}</p>
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
                <div className="show-password">
                    <div className="show-password-container">
                    </div>
                    <button
                        type="button"
                        className="forgot-password-btn"
                        onClick={() => setShowModal(true)}
                    >
                        Forgot password?
                    </button>
                </div>
                {loginStatus === "rejected" ? (
                    <p className="login-rejected">
                        Email or password is incorrect
                    </p>
                ) : loginStatus === "banned" ? <p className="login-rejected">Your account has been banned, contact admin for information</p> : loginStatus === "pending" ? (
                    <p className="login-pending">
                        <Spin
              indicator={
                <LoadingOutlined style={{ color: "rgb(255, 0, 115)" }} spin />
              }
              size="large"
            />
                    </p>
                ) : null}
                <button type="submit" className="sign-in-btn">
                    Sign in
                </button>
                <p className="mb-3">
                    Don't have an Account?
                    <Link to="/register" className="link-to-register">
                        Create account
                    </Link>
                </p>
                <GoogleLogin locale="en" onSuccess={(response) => {
                     if(response.credential) {
                        localStorage.setItem("token", response.credential)
                        const decoded = jwtDecode(response.credential)
                        console.log(decoded);
                        localStorage.setItem("username", decoded.name)
                        localStorage.setItem("email", decoded.email)
                        navigate("/")
                      }
                    

                }} onError={() => console.log("Login failed")
                }/>
            </form>
            <div
                className={`modal p-10 ${
                    showModal && "show-modal p-10"
                }`}
            >
                <div className="modal-container">
                    <button
                        className="close-modal-btn top-6 right-4"
                        onClick={() => setShowModal(false)}
                    >
                        <img
                            src={closeImg}
                            alt="close modal"
                            className="close-img"
                        />
                    </button>
                    <h2 className="modal-title text-2xl font-medium">Find your Account</h2>
                    <p className="modal-subtitle">
                        Please enter your email address to search for your
                        account.
                    </p>
                    <Input
                        type="text"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => {
                            setEmailStatus(false)
                            setEmail(e.target.value)}}
                        className="modal-email-input"
                        onKeyDown={(e) => {
                            if(e.key === "Enter")
                                checkEmailFunction()
                        }}
                    />
                    {emailStatus === "rejected" ? (
                        <p className="email-rejected">User does not exist</p>
                    ) : emailStatus === "fulfilled" ? (
                        <p className="email-fulfilled text-[#354acf]">
                            Please check your email and reset your password, it might take a few minutes to arrive.
                        </p>
                    ) : emailStatus === "pending" ? (
                        <Spin className="block" size="default" indicator={<LoadingOutlined className="text-[#ff0073]" spin />} />
                    ) : null}
                    <Button disabled={!email} onClick={checkEmailFunction} className="bg-[#354acf] px-10 py-5 text-base mx-auto w-fit text-white hover:text-white disabled:hover:bg-[#0022ff]">
                        Search
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Login;
