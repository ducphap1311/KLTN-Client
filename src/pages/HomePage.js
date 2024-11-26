import React from 'react'
import { Footer } from "../components/Footer";
import { HeroSlider } from "../components/HeroSlider";
import { HomeProducts } from "../components/HomeProducts";
import { Navbar } from "../components/Navbar";
export const HomePage = () => {
    return (
        <>
            <Navbar />
            <HeroSlider />
            <HomeProducts
                quality="best seller"
                title="Best Seller"
                icon="fa-sharp fa-solid fa-bolt"
            />
            <HomeProducts
                quality="most popular"
                title="Most Popular"
                icon="fa-solid fa-fire-flame-curved"
            />
            <Footer />
        </>
    )
}
