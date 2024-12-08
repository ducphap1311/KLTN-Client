import React, { useState } from "react";
import "../styles/ResetPassword.scss";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input, message, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export const ResetPassword = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [resetStatus, setResetStatus] = useState();
    const [messageApi, contextHolder] = message.useMessage(); // Sử dụng useMessage của Ant Design

    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .required("Password required")
                .min(8, "Password must be at least 8 characters"),
            confirmPassword: Yup.string()
                .required("Confirm password required")
                .oneOf([Yup.ref("password"), null], "Passwords must match"),
        }),
        onSubmit: async (values) => {
            try {
                setResetStatus("pending");
                const requestOptions = {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${id}`,
                    },
                    body: JSON.stringify({
                        password: values.password,
                    }),
                };
                const response = await fetch(
                    `http://localhost:5000/api/v1/reset-password/`,
                    requestOptions
                );
                if (!response.ok) {
                    throw new Error("Error");
                }
                setResetStatus("fulfilled");
                localStorage.removeItem("resetPasswordToken");
                values.password = "";
                values.confirmPassword = "";

                // Hiển thị thông báo thành công
                messageApi.success("Password reset successfully!", 2);

                // Đợi thông báo xong, sau đó chuyển hướng
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } catch (error) {
                setResetStatus("rejected");
                messageApi.error("Failed to reset password. Please try again.", 2);
            }
        },
    });

    return (
        <div className="reset-password">
            {contextHolder /* Đặt contextHolder để hiển thị thông báo */}
            <h2 className="reset-password-title">Reset account password</h2>
            <form onSubmit={formik.handleSubmit}>
                <div className="password-container">
                    <Input.Password
                        type="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        className="password-input"
                        placeholder="Password"
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <p className="password-error">{formik.errors.password}</p>
                    ) : null}
                </div>
                <div className="confirm-password-container">
                    <Input.Password
                        type="password"
                        name="confirmPassword"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        className="confirm-password-input"
                        placeholder="Confirm password"
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword ? (
                        <p className="confirm-password-error">
                            {formik.errors.confirmPassword}
                        </p>
                    ) : null}
                </div>
                {resetStatus === "pending" ? (
                    <p className="reset-pending">
                        <Spin
                            size="default"
                            indicator={<LoadingOutlined className="text-[#ff0073]" spin />}
                        />
                    </p>
                ) : resetStatus === "rejected" ? (
                    <p className="reset-rejected text-sm">
                        There is an error while trying to reset password, try later.
                    </p>
                ) : resetStatus === "fulfilled" ? (
                    <p className="reset-fulfilled">Reset password successfully</p>
                ) : null}
                <button type="submit" className="reset-password-btn">
                    Reset password
                </button>
            </form>
        </div>
    );
};
