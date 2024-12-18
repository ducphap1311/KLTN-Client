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
import { Button, Input, Select, Tooltip } from "antd";
import { PayPalButton } from "react-paypal-button-v2";
import AddressManager from "./AddressManager";
import AddressCheckout from "./AddressCheckout";
const { Option } = Select;

export const CheckOut = () => {
  const { total, cartItems, amount } = useSelector((store) => store.cart);
  const [errorUser, setErrorUser] = useState(false);
  const [citiesList, setCitiesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [wardsList, setwardsList] = useState([]);
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true);
  const shippingPrice = 30000;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [needUpdatingProducts, setNeedUpdatingProducts] = useState();
  const [selectedPayment, setSelectedPayment] = useState("cash");
  const [addresses, setAddresses] = useState([]);
  const [buttonLoading, setButtonLoading] = useState(false)

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
    const script = document.createElement("script");
    script.src =
      "https://sandbox.paypal.com/sdk/js?client-id=AQFmQKmWHFS_ziwztP1zO9xXq9pybnmD0slxWR6IUyoE4sqDKDmiyNAlYwAKK6WSJWZWc1qsj63ojeXV";
    script.type = "text/javascript";
    document.body.appendChild(script);
  };

  useEffect(() => {
    addPayPal();
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
        "https://kltn-server.vercel.app/api/v1/dashboard",
        requestOptions
      );
      const responseData = await response.json();
      const success = responseData.msg;
      localStorage.setItem("email", responseData.email);
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
        `https://kltn-server.vercel.app/api/v1/products/${id}`
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

  const updateProducts = async () => {
    const updates = cartItems.map(async (item) => {
      const sizesToUpdate = [{ size: item.size, quantity: item.amount }];
      try {
        const response = await fetch(
          `https://kltn-server.vercel.app/api/v1/products/update-sizes/single`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              productId: item._id,
              sizes: sizesToUpdate,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update product sizes");
        }
      } catch (error) {
        console.error(`Error updating product sizes for ${item._id}:`, error);
      }
    });

    await Promise.all(updates); // Đảm bảo tất cả các cập nhật đã hoàn thành
  };

  const handleOrder = async (values) => {
    setButtonLoading(true)
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values.name,
        address: values.address,
        orderTotal: total + shippingPrice,
        cartItems: cartItems,
        amount: amount,
        phone: values.phone,
        isPaid: values.isPaid,
        email: localStorage.getItem("email"),
      }),
    };
    try {
      const response = await fetch(
        "https://kltn-server.vercel.app/api/v1/orders",
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Something went wrong with the order!");
      }

      const responseData = await response.json();
      await updateProducts(); // Gọi hàm cập nhật sản phẩm sau khi đặt hàng thành công
      localStorage.setItem("city", values.city);
      localStorage.setItem("district", values.district);
      localStorage.setItem("ward", values.ward);
      localStorage.setItem("phone", values.phone);
      localStorage.setItem("address", values.address);
      await sendEmail(responseData.order._id);
      localStorage.removeItem("cartItems");
      dispatch(clearCart());
      navigate("/orders");
      setButtonLoading(false)
    } catch (error) {
      console.error(error);
      setButtonLoading(false)
    }
  };

  const sendEmail = async (id) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: localStorage.getItem("email"),
        orderID: id,
      }),
    };
    await fetch(
      "https://kltn-server.vercel.app/api/v1/send-order",
      requestOptions
    );
  };

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
          <AddressCheckout
            handleOrder={handleOrder}
            addresses={addresses}
            setAddresses={setAddresses}
            buttonLoading={buttonLoading}
            selectedPayment={selectedPayment}
          />
        </div>
        <div className="w-full max-w-[450px]">
            <Tooltip
              title={
                addresses[0]?.address
                  ? ""
                  : "You have to add address to continues"
              }
            >
          <div className="price-information w-full">
            <div className="subtotal">
              <p>Subtotal</p>
              <p>{total.toLocaleString("vi-VN")} VND</p>
            </div>
            <div className="shipping">
              <p>Shipping</p>
              <p>{shippingPrice.toLocaleString("vi-VN")} VND</p>
            </div>

            <div className="order-total">
              <p>Order Total</p>
              <p>{(total + shippingPrice).toLocaleString("vi-VN")} VND</p>
            </div>
          </div>
          <div className="w-full mx-auto mt-5">
              {selectedPayment === "paypal" && (
                <div
                  style={{
                    pointerEvents: addresses[0]?.address ? "auto" : "none",
                    opacity: addresses[0]?.address ? 1 : 0.5,
                  }}
                >
                  <PayPalButton
                    amount={((total + shippingPrice) / 24000).toFixed(2)}
                    onSuccess={(details) => {

                      handleOrder({
                        name: addresses[0]?.fullName,
                        address: addresses[0]?.address,
                        phone: addresses[0]?.phone,
                        isPaid: true,
                      });
                    }}
                    options={{
                      disable: addresses[0]?.address ? false : true, // Disable nút nếu form chưa hợp lệ hoặc chưa chỉnh sửa
                    }}
                    onError={() => alert("Some error happened, try later!")}
                  />
                </div>
              )}
            <h2 className="text-sm font-medium text-gray-900 mb-4">
              Choose payment method
            </h2>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center text-sm justify-between w-full p-2 border-2 rounded-lg cursor-pointer transition-colors ${
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
                      onChange={() => {
                        setSelectedPayment(method.id);
                      }}
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
              </Tooltip>
        </div>
      </div>
    </div>
  );
};
