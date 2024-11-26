import React from 'react'
import { Navbar } from '../components/Navbar'
import { Products } from '../components/Products'
import { Footer } from '../components/Footer'
// import { Pagination } from '../components/Pagination'

export const ProductsPage = () => {
  return (
    <>
      <Navbar />
      <Products />
      {/* <Pagination /> */}
      <Footer />
    </>
  )
}
