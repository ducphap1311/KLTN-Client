import React from 'react'
import { Navbar } from '../components/Navbar'
import { SingleProduct } from '../components/SingleProduct'
import { Footer } from '../components/Footer'

export const SingleProductPage = () => {
    return (
        <>
            <Navbar />
            <SingleProduct />
            <Footer />
        </>
    )
}
