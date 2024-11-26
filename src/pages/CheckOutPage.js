import React from 'react'
import { Navbar } from '../components/Navbar'
import { CheckOut } from '../components/CheckOut'
import { useNavigate } from 'react-router-dom'

export const CheckOutPage = () => {
    
    return (
        <>
            <Navbar />
            <CheckOut />
        </>
    )
}
