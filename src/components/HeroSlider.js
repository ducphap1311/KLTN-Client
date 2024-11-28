import React from "react";
import slider1 from "../assets/slide-bg-1.jpg";
import slider2 from "../assets/slide-bg-2.jpg";
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
                        <h1 className="title ">BShoes</h1>
                        <p className="info ">
                            Along with the continuous development of world
                            fashion, many brands have launched genuine products with a variety of styles, designs, colors,
                            sizes...
                        </p>
                        <Link to='/products'>
                            <button className="watch-btn ">See More</button>
                        </Link>
                    </div>
                </div>
                <div className="slider-child">
                    <img src="https://files.oaiusercontent.com/file-2JnsQZ9iQsvijYRUqPS3Yh?se=2024-11-28T06%3A23%3A38Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3Db065a930-e305-480b-bfbf-3465df4dc8d4.webp&sig=eaw32xRABjgFtTauFlFgVbP87J6P9eRIm6JOy3GL6Eo%3D" alt="slider 2" className="slider-img" />
                    <div className="slider-text text-black">
                        <p className="title text-black">BShoes</p>
                        <p className="info text-black">
                            Along with the continuous development of world
                            fashion, many brands have launched genuine products with a variety of styles, designs, colors,
                            sizes...
                        </p>
                        <Link to='/products'>
                            <button className="watch-btn text-black hover:bg-transparent">See More</button>
                        </Link>
                    </div>
                </div>
            </Slider>
        </div>
    );
};
