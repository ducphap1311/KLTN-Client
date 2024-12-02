import React from "react";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input, Button, Card } from "antd";
import { PhoneOutlined, MailOutlined, EnvironmentOutlined } from "@ant-design/icons";

export const Contact = () => {
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            phoneNumber: "",
            location: "",
            message: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Please provide your name"),
            email: Yup.string()
                .required("Please provide your mail")
                .email("Please provide a valid email"),
            phoneNumber: Yup.string()
                .min(10, "Please provide a valid phone number")
                .required("Please provide your phone number"),
            location: Yup.string().required("Please provide your location"),
            message: Yup.string().required("Please provide your message"),
        }),
        onSubmit: (values) => {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: values.name,
                    email: values.email,
                    phoneNumber: Number(values.phoneNumber),
                    location: values.location,
                    message: values.message,
                }),
            };

            fetch("http://localhost:5000/api/v1/messages", requestOptions)
                .then((res) => {
                    toast.success("Message sent successfully");
                    formik.resetForm();
                })
                .catch((error) => {
                    toast.error("Something went wrong");
                });
        },
    });

    return (
        <div className="container mx-auto px-4 py-8 md:mt-32 mb-80 mt-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Info Section */}
                <Card className="shadow-lg rounded-md">
                    <h3 className="text-xl font-semibold mb-6 text-gray-800">Contact Information</h3>
                    <div className="flex items-start space-x-4 mb-4">
                        <EnvironmentOutlined className="text-2xl text-blue-500" />
                        <div>
                            <h4 className="font-medium text-gray-700">Location</h4>
                            <p className="text-gray-600">24/5 street 10 , Ho Chi Minh City, Vietnam</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-4 mb-4">
                        <PhoneOutlined className="text-2xl text-blue-500" />
                        <div>
                            <h4 className="font-medium text-gray-700">Phone Number</h4>
                            <p className="text-gray-600">077 345 0028</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-4">
                        <MailOutlined className="text-2xl text-blue-500" />
                        <div>
                            <h4 className="font-medium text-gray-700">Email</h4>
                            <p className="text-gray-600">hophap1311@gmail.com</p>
                        </div>
                    </div>
                </Card>

                {/* Contact Form Section */}
                <Card className="shadow-lg rounded-md">
                    <h3 className="text-xl font-semibold mb-6 text-gray-800">Send Us a Message</h3>
                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Your Name</label>
                            <Input
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter your name"
                                className="mt-1"
                            />
                            {formik.touched.name && formik.errors.name && (
                                <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <Input
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter your email"
                                className="mt-1"
                            />
                            {formik.touched.email && formik.errors.email && (
                                <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
                            )}
                        </div>

                        {/* Phone Number Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <Input
                                name="phoneNumber"
                                value={formik.values.phoneNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter your phone number"
                                className="mt-1"
                            />
                            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                                <p className="text-red-500 text-xs mt-1">{formik.errors.phoneNumber}</p>
                            )}
                        </div>

                        {/* Location Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <Input
                                name="location"
                                value={formik.values.location}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter your location"
                                className="mt-1"
                            />
                            {formik.touched.location && formik.errors.location && (
                                <p className="text-red-500 text-xs mt-1">{formik.errors.location}</p>
                            )}
                        </div>

                        {/* Message Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Message</label>
                            <Input.TextArea
                                name="message"
                                value={formik.values.message}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Write your message"
                                rows={4}
                                className="mt-1"
                            />
                            {formik.touched.message && formik.errors.message && (
                                <p className="text-red-500 text-xs mt-1">{formik.errors.message}</p>
                            )}
                        </div>

                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full"
                            size="large"
                        >
                            Send Message
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};
