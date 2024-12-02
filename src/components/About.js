import React from "react";
import "../styles/About.scss";
import aboutImg from "../assets/about-us.jpg";

export const About = () => {
    return (
        <div className="about pt-28">
            <div className="about-container">
                <div className="about-header about-header grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="about-img-container">
                        <img
                        src="https://drake.vn/image/catalog/H%C3%ACnh%20content/gia%CC%80y%20Converse%20da%20bo%CC%81ng/giay-converse-da-bong-5.jpg"
                        alt="about-img"
                        className="about-img w-full rounded-lg shadow-md"
                    />
                    </div>
                    <div className="about-text">
                        <h2 className="title">About DH Sneaker</h2>
                        <p className="info">
                            "With the continuous evolution of global fashion, 
                            sneakers have become essential footwear for everyone. 
                            At DH Sneaker, we provide high-quality sneakers 
                            that combine comfort, durability, and cutting-edge style. 
                            Whether you're running errands, working out, or making a 
                            fashion statement, the right pair of sneakers completes 
                            your look and enhances your lifestyle. Modern sneakers 
                            are no longer just footwear—they're an expression of 
                            personality and functionality."
                        </p>
                    </div>
                </div>
                <div className="about-info">
                    <div className="genuine">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2Hj0XjlMWX73QKVS9xF9dgD8Ya6h_BrR2tJ7rzFOgmINIhY-k"
                            alt="genuine-img"
                            className="genuine-img"
                        />
                        <div className="genuine-text">
                            <h3>Authenticity Guaranteed</h3>
                            <p>
                                Our sneakers are 100% authentic and sourced directly 
                                from top brands around the world.
                            </p>
                        </div>
                    </div>
                    <div className="new">
                        <img
                            src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcR4-X23S9lNGCe1qxR_luoTP1bNfgda_RJWhIk5lljLchJBgtc7"
                            alt="new-img"
                            className="new-img"
                        />
                        <div className="new-text">
                            <h3>Brand New Products</h3>
                            <p>
                                Every pair of sneakers we offer is brand new, ensuring 
                                you get the best quality.
                            </p>
                        </div>
                    </div>
                    <div className="guarantee">
                        <img
                            src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQNvhfDFFKyky27EfpgMRkCGJqXsMDF237ayezQ2kV8MS58cMiH"
                            alt="guarantee-img"
                            className="guarantee-img"
                        />
                        <div className="guarantee-text">
                            <h3>12-Month Warranty</h3>
                            <p>
                                Our sneakers come with a 12-month warranty, giving 
                                you peace of mind with every purchase.
                            </p>
                        </div>
                    </div>
                    <div className="exchange">
                        <img
                            src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTg2pGqip3KRMDYqLkbrGGsb0tk1YeuztNft5nfadxvMPk8Hk5D"
                            alt="exchange-img"
                            className="exchange-img"
                        />
                        <div className="exchange-text">
                            <h3>7-Day Returns</h3>
                            <p>
                                If you're not satisfied with your purchase, you can 
                                return it within 7 days for an exchange or refund.
                            </p>
                        </div>
                    </div>
                    <div className="freeship">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr3Asq8aU0cHPgJl7VMl48OeB5gfAnoTL7kIE3j7T9vLQ96EyP"
                            alt="freeship-img"
                            className="freeship-img"
                        />
                        <div className="freeship-text">
                            <h3>Free Shipping</h3>
                            <p>
                                Enjoy free shipping on all orders, delivered straight 
                                to your doorstep.
                            </p>
                        </div>
                    </div>
                    <div className="price">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO3elPSNYF3mtdaaUJpYduzOIxSJjuB-c5PuXZ9D1jh5nIfUtu"
                            alt="price-img"
                            className="price-img"
                        />
                        <div className="price-text">
                            <h3>Best Prices</h3>
                            <p>
                                Get the best prices for high-quality sneakers without 
                                compromising on style or comfort.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
