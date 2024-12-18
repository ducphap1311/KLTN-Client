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
import VerifyEmail from "./pages/VerifyEmail";
import RegisterVerification from "./pages/RegisterVerification"
import ProtectedLayout from "./pages/ProtectedLayout";
import ClientBlog from "./pages/Blogs";
import AddressManager from "./components/AddressManager";
import Profile from "./components/Profile";
import { ProtectedRoute } from "./ProtectedRoute"; 

function App() {
    const dispatch = useDispatch()
    const { cartItems } = useSelector(store => store.cart)
    const { pathname } = useLocation()

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
            <Route element={<ProtectedLayout />} >
                <Route path="/" element={<HomePage />} />
                <Route path="/about-us" element={<AboutPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/products/:id" element={<SingleProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/verify-email/message" element={<RegisterVerification />} />
                    <Route path="/reset-password/:id" element={<ResetPasswordPage />} />
                    <Route path="/blogs" element={<ClientBlog />} />
                    <Route element={<ProtectedRoute />}>
                    <Route path="/checkout" element={<CheckOutPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/orders/:id" element={<OrderDetailPage />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/address-manager" element={<AddressManager />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
