import React from "react";
import footerImg from "../assets/logo.png";
import "../styles/Footer.scss";

export const Footer = () => {
    return (
        <div className="footer">
            <div className="footer-container">
                <div className="footer-underline"></div>
                <div className="footer-info">
                    <div className="footer-header">
                        <div className="footer-header-logo">
                            <img
                                src={footerImg}
                                alt="footer-logo"
                                className="footer-header-img"
                            />
                        </div>
                        <p className="footer-header-subtitle">
                            Your satisfaction is our honor.
                        </p>
                    </div>
                    <div className="contact-info">
                        <h4>CONTACT INFO</h4>
                        <div className="info">
                            <p>
                                <i className="fa fa-map-marker"></i>District 9,
                                Ho Chi Minh City
                            </p>
                            <p>
                                <i className="fa fa-phone"></i>0825 820 709
                            </p>
                            <p>
                                <i className="fa fa-envelope"></i>
                                hophap1311@gmail.com
                            </p>
                        </div>
                    </div>
                    <div className="about-us">
                        <h4>ABOUT US</h4>
                        <div className="info">
                            <p>
                                <i className="fa fa-arrow-right"></i>About Mona
                            </p>
                            <p>
                                <i className="fa fa-arrow-right"></i>Mona
                                Devices
                            </p>
                            <p>
                                <i className="fa fa-arrow-right"></i>Mona
                                Science
                            </p>
                        </div>
                    </div>
                    <div className="connect-with-us">
                        <h4>CONNECT WITH US</h4>
                        <div className="info">
                            <p>
                                <a
                                    href="https://www.facebook.com/ducphap1311"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <i className="fab fa-facebook"></i>
                                    <span>FaceBook</span>
                                </a>
                            </p>
                            <p>
                                <a
                                    href="https://www.instagram.com/ducphapho/"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <i className="fab fa-instagram"></i>
                                    <span>Instagram</span>
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
