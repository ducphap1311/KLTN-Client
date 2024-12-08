import React from "react";
import slider1 from "../assets/slide-bg-1.jpg";
import slider2 from "../assets/slide-bg-2.jpg";
import slider3 from "../assets/slide-bg-3.webp";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/HeroSlider.scss";
import {Link} from 'react-router-dom'

export const HeroSlider = () => {
    let settings = {
        dots: true,
        infinite: true,
        speed: 400,
        slidesToShow: 1,
        slidesToScroll: 1,
        lazyLoad: true,
        autoplay: true,
        autoplayspeed: 5000,
        responsive: [
            {
                breakpoint: 550,
                settings: {
                    dots: false,
                },
            },
        ],
    };

    return (
        <div className="hero-slider">
            <Slider {...settings}>
                <div className="slider-child">
                    <img src="https://image.cnbcfm.com/api/v1/image/107026926-1646748261658-2-lululemon_Footwear__Collection1.jpg?v=1646750941" alt="slider 1" className="slider-img" />
                    <div className="slider-text ">
                        <h1 className="title ">DH Sneaker</h1>
                        <p className="info ">
                            Along with the continuous development of world
                            fashion, many brands have launched genuine products with a variety of styles, designs, colors,
                            sizes...
                        </p>
                        <Link to='/products'>
                            <button className="watch-btn hover:bg-black">See More</button>
                        </Link>
                    </div>
                </div>
                <div className="slider-child">
                    <img src={slider3} alt="slider 2" className="slider-img" />
                    <div className="slider-text text-black">
                        <p className="title text-black">DH Sneaker</p>
                        <p className="info text-black">
                            Along with the continuous development of world
                            fashion, many brands have launched genuine products with a variety of styles, designs, colors,
                            sizes...
                        </p>
                        <Link to='/products'>
                            <button className="watch-btn text-black hover:bg-white">See More</button>
                        </Link>
                    </div>
                </div>
            </Slider>
        </div>
    );
};
