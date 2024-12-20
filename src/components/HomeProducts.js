import React, { useState, useEffect } from "react";
import "../styles/HomeProducts.scss";
import Slider from "react-slick";
import Product from "./Product";

export const HomeProducts = (props) => {
    const [products, setProducts] = useState();

    const getHomeProducts = async () => {
        try {
            const response = await fetch(
                "https://kltn-server.vercel.app/api/v1/products"
            );
            const responseData = await response.json();
            if(props.quality) {
                const data = responseData.products.filter(
                    (product) => (product.quality === props.quality) &&  product.isActive
                );
                setProducts(data);
            } else if (props.brand) {
                const data = responseData.products.filter(
                    (product) => (product.brand === props.brand) && product.isActive
                );
                setProducts(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getHomeProducts();
    }, []);

    let settings = {
        dots: false,
        slidesToShow: 4,
        slidesToScroll: 2,
        infinite: true,
        speed: 500,
        responsive: [
            {
                breakpoint: 1300,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 850,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 650,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    if (!products) {
        return;
    }

    return (
        <div className="home-products">
            <div className="home-products-container">
                <div className="home-title">
                    <p className="font-semibold">{props.title}</p>
                    <i
                        className={props.icon}
                    ></i>
                </div>
                <Slider {...settings}>
                    {products.map((product) => {
                        return (
                            <Product product={product} key={product._id} />
                        );
                    })}
                </Slider>
            </div>
        </div>
    );
};
