import React from "react";
import { Link } from "react-router-dom";
import { FacebookOutlined, InstagramOutlined } from "@ant-design/icons";

export const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:flex md:justify-between">
                    {/* Logo and About Us */}
                    <div className="max-w-[300px]">
                        <img
                            src={require("../assets/logo.png")}
                            alt="Company Logo"
                            className="w-32 mb-4"
                        />
                        <p className="text-base leading-relaxed">
                            We provide high-quality sports shoes that bring comfort and style to our customers.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/"
                                    className="text-base hover:text-white transition-colors"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/products"
                                    className="text-base hover:text-white transition-colors"
                                >
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/about"
                                    className="text-base hover:text-white transition-colors"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className="text-base hover:text-white transition-colors"
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Contact Information
                        </h3>
                        <ul className="space-y-2 text-base">
                            <li>District 9, Ho Chi Minh City</li>
                            <li>0825 820 709</li>
                            <li>hophap1311@gmail.com</li>
                        </ul>
                    </div>

                    {/* Follow Us */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Follow Us
                        </h3>
                        <div className="flex space-x-4 text-xl">
                            <a
                                href="https://www.facebook.com/hophap1311"
                                target="_blank"
                                className="text-gray-400 hover:text-white transition-colors"
                                aria-label="Facebook"
                            >
                                <FacebookOutlined className="text-3xl" />
                            </a>
                            <a
                                href="https://www.facebook.com/hophap1311"
                                target="_blank"
                                className="text-gray-400 hover:text-white transition-colors"
                                aria-label="Instagram"
                            >
                                <InstagramOutlined className="text-3xl"/>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="mt-8 pt-8 border-t border-gray-700 text-sm text-center">
                    <p className="text-gray-500">
                        &copy; 2024 BShoes. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};
