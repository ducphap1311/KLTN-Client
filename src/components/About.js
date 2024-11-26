import React from "react";
import "../styles/About.scss";
import aboutImg from "../assets/about-us.jpg";

export const About = () => {
    return (
        <div className="about">
            <div className="about-container">
                <div className="about-header">
                    <div className="about-img-container">
                        <img
                            src={aboutImg}
                            alt="about-img"
                            className="about-img"
                        />
                    </div>
                    <div className="about-text">
                        <h2 className="title">About Watch Mona</h2>
                        <p className="info">
                            "Along with the continuous development of world
                            fashion, many brands have launched genuine men's
                            watches with a variety of styles, designs, colors,
                            sizes... A key high-end men's watch The brand
                            portrays a true value when it comes to luxury
                            accessories for men. Nowadays, watches are essential
                            fashion accessories for today's modern man. On the
                            wrists of successful men there is always a place for
                            a high-end men's watch"
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
                            <h3>Genuine</h3>
                            <p>
                                Nowadays, watches are essential fashion
                                accessories for today's modern man
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
                            <h3>100% new product</h3>
                            <p>
                                Nowadays, watches are essential fashion
                                accessories for today's modern man
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
                            <h3>Warranty 12 months</h3>
                            <p>
                                Nowadays, watches are essential fashion
                                accessories for today's modern man
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
                            <h3>Return within 7 days</h3>
                            <p>
                                Nowadays, watches are essential fashion
                                accessories for today's modern man
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
                            <h3>Free ship</h3>
                            <p>
                                Nowadays, watches are essential fashion
                                accessories for today's modern man
                            </p>
                        </div>
                    </div>
                    <div className="price">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO3elPSNYF3mtdaaUJpYduzOIxSJjuB-c5PuXZ9D1jh5nIfUtu"
                            className="price-img"
                        />
                        <div className="price-text">
                            <h3>Good price</h3>
                            <p>
                                Nowadays, watches are essential fashion
                                accessories for today's modern man
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
