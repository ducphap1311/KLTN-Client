import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ProductsPage } from "./pages/ProductsPage";
import { ContactPage } from "./pages/ContactPage";
import { SingleProductPage } from "./pages/SingleProductPage";
import { CartPage } from "./pages/CartPage";
import { getTotalAmount, getAllProducts } from './features/cart/cartSlice';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { useLocation } from "react-router-dom";
import { CheckOutPage } from "./pages/CheckOutPage";
import { OrdersPage } from "./pages/OrdersPage";
import { OrderDetailPage } from "./pages/OrderDetailPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { ProfilePage } from "./pages/ProfilePage";

function App() {
    const dispatch = useDispatch()
    const {cartItems} = useSelector(store => store.cart)
    const {pathname} = useLocation()
    
    useEffect(() => {
        dispatch(getTotalAmount())
    }, [cartItems])

    useEffect(() => {
        dispatch(getAllProducts())
    }, [])
    
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about-us" element={<AboutPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/products/:id" element={<SingleProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/checkout" element={<CheckOutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
            <Route path="/reset-password/:id" element={<ResetPasswordPage />} />
            <Route path="/profile" element={<ProfilePage />} />
        </Routes>
    );
}

export default App;
