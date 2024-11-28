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
import { Input, Select } from "antd";
import { PayPalButton } from "react-paypal-button-v2";
const { Option } = Select;

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
  const [selectedPayment, setSelectedPayment] = useState("cash");

  const paymentMethods = [
    { id: "cash", name: "Cash on delivery", icon: "💵" },
    { id: "paypal", name: "PayPal", icon: "💳" },
  ];
  useEffect(() => {
    authenticateUser();
    if (!errorUser) {
      getCitiesInformations();
      getNeedUpdatingProducts();
    }
  }, []);

  const addPayPal = () => {
    const script = document.createElement("script")
    script.src="https://sandbox.paypal.com/sdk/js?client-id=AQFmQKmWHFS_ziwztP1zO9xXq9pybnmD0slxWR6IUyoE4sqDKDmiyNAlYwAKK6WSJWZWc1qsj63ojeXV"
    script.type="text/javascript"
    document.body.appendChild(script)
  }

  useEffect(() => {
    addPayPal()
  }, [])

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
        "http://localhost:5000/api/v1/dashboard",
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

  const handleCityChange = (value) => {
    const selectedCity = citiesList.find((city) => city.name === value);
    setDistrictsList(selectedCity?.districts || []);
    setwardsList([]);
    formik.setFieldValue("city", value);
    formik.setFieldValue("district", "");
    formik.setFieldValue("ward", "");
  };

  const handleDistrictChange = (value) => {
    const selectedDistrict = districtsList.find(
      (district) => district.name === value
    );
    setwardsList(selectedDistrict?.wards || []);
    formik.setFieldValue("district", value);
    formik.setFieldValue("ward", "");
  };

  const handleWardChange = (value) => {
    formik.setFieldValue("ward", value);
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
          "http://localhost:5000/api/v1/orders",
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
    <div className="checkout mt-36">
      <div className="checkout-title">
        <h2 className="text-2xl">Place Your Order</h2>
      </div>
      <div className="checkout-information-container">
        <div className="checkout-information">
          {/* <p className="text-xl">Shipping Information</p> */}
          <form onSubmit={formik.handleSubmit}>
            <div className="name-information">
              <label>Your Name</label>
              <Input
                type="text"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name ? (
                <p className="name-error">{formik.errors.name}</p>
              ) : null}
            </div>
            <div className="city-information">
              <label>City</label>
              <Select
                value={formik.values.city}
                onChange={handleCityChange}
                onBlur={() => formik.setFieldTouched("city")}
                className="w-full h-10"
              >
                {citiesList.map((city) => (
                  <Option key={city.code} value={city.name}>
                    {city.name}
                  </Option>
                ))}
              </Select>
              {formik.touched.city && formik.errors.city ? (
                <p className="city-error">{formik.errors.city}</p>
              ) : null}
            </div>
            <div className="district-information">
              <label>District</label>
              <Select
                className="w-full h-10"
                value={formik.values.district}
                onChange={handleDistrictChange}
                onBlur={() => formik.setFieldTouched("district")}
                disabled={!districtsList.length}
              >
                {districtsList.map((district) => (
                  <Option key={district.code} value={district.name}>
                    {district.name}
                  </Option>
                ))}
              </Select>
              {formik.touched.district && formik.errors.district ? (
                <p className="district-error">{formik.errors.district}</p>
              ) : null}
            </div>
            <div className="ward-information">
              <label>Ward</label>
              <Select
                className="w-full h-10"
                value={formik.values.ward}
                onChange={handleWardChange}
                onBlur={() => formik.setFieldTouched("ward")}
                disabled={!wardsList.length}
              >
                {wardsList.map((ward) => (
                  <Option key={ward.code} value={ward.name}>
                    {ward.name}
                  </Option>
                ))}
              </Select>
              {formik.touched.ward && formik.errors.ward ? (
                <p className="ward-error">{formik.errors.ward}</p>
              ) : null}
            </div>
            <div className="address-information">
              <label>Address Detail</label>
              <Input
                type="text"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.address && formik.errors.address ? (
                <p className="address-error">{formik.errors.address}</p>
              ) : null}
            </div>
            <button type="submit">Place Your Order</button>
          </form>
        </div>
        <div className="w-full max-w-[450px]">
          <div className="price-information w-full">
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
          <div className="w-full mx-auto mt-5">
            {
              selectedPayment === "paypal" && 
              <PayPalButton
                amount="0.01"
                // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                onSuccess={(details, data) => {
                  alert(
                    "Transaction completed by " + details.payer.name.given_name
                  );

                  // OPTIONAL: Call your server to save the transaction
                  // return fetch("/paypal-transaction-complete", {
                  //   method: "post",
                  //   body: JSON.stringify({
                  //     orderID: data.orderID,
                  //   }),
                  // });
                }}
              />
            }
            <h2 className="text-base font-medium text-gray-900 mb-4">
              Choose payment method
            </h2>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center justify-between w-full p-2 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedPayment === method.id
                      ? "bg-blue-50 border-blue-500"
                      : "bg-white border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedPayment === method.id}
                      onChange={() => setSelectedPayment(method.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 font-medium text-gray-900">
                      {method.name}
                    </span>
                  </div>
                  <span
                    className="text-2xl"
                    role="img"
                    aria-label={method.name}
                  >
                    {method.icon}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
