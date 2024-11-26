import React, { useState, useEffect } from "react";
import "../styles/CheckOut.scss";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../features/cart/cartSlice";
import { Link } from "react-router-dom";
import { Loading } from "./Loading";
import { useFormik } from "formik";
import * as Yup from "yup";

export const CheckOut = () => {
    const { total, cartItems, amount } = useSelector((store) => store.cart);
    const [errorUser, setErrorUser] = useState(false);
    const [citiesList, setCitiesList] = useState([]);
    const [districtsList, setDistrictsList] = useState([]);
    const [wardsList, setwardsList] = useState([]);
    const token = localStorage.getItem("token");
    const [isLoading, setIsLoading] = useState(true);
    const shippingPrice = 5;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [needUpdatingProducts, setNeedUpdatingProducts] = useState();

    useEffect(() => {
        authenticateUser();
        if (!errorUser) {
            getCitiesInformations();
            getNeedUpdatingProducts();
        }
    }, []);

    const authenticateUser = async () => {
        setIsLoading(true);
        const requestOptions = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        try {
            const response = await fetch(
                "http://localhost:5000/api/v2/dashboard",
                requestOptions
            );
            const responseData = await response.json();
            const success = responseData.msg;
            if (success !== "success") {
                throw new Error("Invalid user");
            }
            setErrorUser(false);
            setIsLoading(false);
        } catch (error) {
            setErrorUser(true);
            setIsLoading(false);
        }
    };

    const getNeedUpdatingProducts = () => {
        let idsList = cartItems.map((item) => {
            return item._id;
        });
        let productsList = [];
        idsList.forEach(async (id) => {
            const response = await fetch(
                `http://localhost:5000/api/v1/products/${id}`
            );
            const responseData = await response.json();
            const data = responseData.product;
            productsList.push(data);
        });
        setNeedUpdatingProducts(productsList);
    };

    const getCitiesInformations = async () => {
        try {
            const response = await fetch(
                "https://provinces.open-api.vn/api/?depth=3"
            );
            const responseData = await response.json();
            setCitiesList(responseData);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCityChange = (e) => {
        const districts = citiesList.filter(
            (add) => add.name === e.target.value
        );
        setDistrictsList(districts[0].districts);
        formik.handleChange(e);
    };

    const handleDistrictChange = (e) => {
        const wards = districtsList.filter(
            (dis) => dis.name === e.target.value
        );
        setwardsList(wards[0].wards);
        formik.handleChange(e);
    };

    const updateProducts = async () => {
        needUpdatingProducts.forEach((product) => {
            cartItems.forEach((item) => {
                if (product._id === item._id) {
                    try {
                        const putRequestOptions = {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                totalAmount: product.totalAmount - item.amount,
                            }),
                        };
                        fetch(
                            `http://localhost:5000/v1/products/${product._id}`,
                            putRequestOptions
                        )
                            .then((res) => {})
                            .catch((error) => {
                                console.log(error);
                            });
                    } catch (error) {
                        console.log(error);
                    }
                }
            });
        });
    };
    const formik = useFormik({
        initialValues: {
            name: localStorage.getItem("username")
                ? localStorage.getItem("username")
                : "",
            city: "",
            district: "",
            ward: "",
            address: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Please provide your name"),
            city: Yup.string().required("Please provide city"),
            district: Yup.string().required("Please provide district"),
            ward: Yup.string().required("Please provide ward"),
            address: Yup.string().required(
                "Please provide address detail (house number, street name...)"
            ),
        }),
        onSubmit: async (values) => {
            const requestOptions = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: values.name,
                    address: `${values.address}, ${values.ward}, ${values.district}, ${values.city}`,
                    orderTotal: total + shippingPrice,
                    cartItems: cartItems,
                    amount: amount,
                }),
            };
            try {
                const response = await fetch(
                    "http://localhost:5000/api/v3/orders",
                    requestOptions
                );
                if (!response) {
                    throw new Error("something wrong here!");
                }
                localStorage.removeItem("cartItems");
                dispatch(clearCart());
                updateProducts();
                navigate("/orders");
            } catch (error) {
                console.log(error);
            }
        },
    });
    if (isLoading) {
        return <Loading />;
    } else if (!token || errorUser) {
        return (
            <div className="login-to-continue">
                <p>Please login to continue</p>
                <Link to="/login" className="login-link">
                    Login here
                </Link>
            </div>
        );
    } else if (cartItems.length === 0) {
        return (
            <div className="empty-cart">
                <h2>Your cart is empty</h2>
                <Link to="/products" className="fill-link">
                    Fill it
                </Link>
            </div>
        );
    }
    return (
        <div className="checkout">
            <div className="checkout-title">
                <h2>Place Your Order</h2>
            </div>
            <div className="checkout-information-container">
                <div className="checkout-information">
                    <p>Shipping Information</p>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="name-information">
                            <label>Your Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.name && formik.errors.name ? (
                                <p className="name-error">
                                    {formik.errors.name}
                                </p>
                            ) : null}
                        </div>
                        <div className="city-information">
                            <label>City</label>
                            
                            <input
                                type="text"
                                name="city"
                                value={formik.values.city}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.city && formik.errors.city ? (
                                <p className="city-error">
                                    {formik.errors.city}
                                </p>
                            ) : null}
                        </div>
                        <div className="district-information">
                            <label>District</label>
                            
                            <input
                                type="text"
                                name="district"
                                value={formik.values.district}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.district &&
                            formik.errors.district ? (
                                <p className="district-error">
                                    {formik.errors.district}
                                </p>
                            ) : null}
                        </div>
                        <div className="ward-information">
                            <label>Ward</label>
                            
                            <input
                                type="text"
                                name="ward"
                                value={formik.values.ward}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.ward && formik.errors.ward ? (
                                <p className="ward-error">
                                    {formik.errors.ward}
                                </p>
                            ) : null}
                        </div>
                        <div className="address-information">
                            <label>Address Detail</label>
                            <input
                                type="text"
                                name="address"
                                value={formik.values.address}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.address && formik.errors.address ? (
                                <p className="address-error">
                                    {formik.errors.address}
                                </p>
                            ) : null}
                        </div>
                        <button type="submit">place your order</button>
                    </form>
                </div>
                <div className="price-information">
                    <div className="subtotal">
                        <p>Subtotal</p>
                        <p>${total.toFixed(2)}</p>
                    </div>
                    <div className="shipping">
                        <p>Shipping</p>
                        <p>${shippingPrice.toFixed(2)}</p>
                    </div>
                    <div className="order-total">
                        <p>Order Total</p>
                        <p>${(total + shippingPrice).toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
