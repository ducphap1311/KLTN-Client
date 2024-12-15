import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addItem } from "../features/cart/cartSlice";
import { Loading } from "./Loading";
import SizeChart from "./SizeChart";
import "../styles/SingleProduct.scss";
import { Button, Tooltip } from "antd";
import Comments from "./Comments";

export const SingleProduct = () => {
  const { id } = useParams();
  const [singleProduct, setSingleProduct] = useState();
  const [amount, setAmount] = useState(1);
  const [selectedSize, setSelectedSize] = useState(""); // Kích thước được chọn
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getSingleProduct = async () => {
    try {
      const response = await fetch(
        `https://kltn-server.vercel.app/api/v1/products/${id}`
      );
      const responseData = await response.json();
      setSingleProduct(responseData.product);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSingleProduct();
  }, [id]);

  if (!singleProduct) {
    return <Loading />;
  }

  const { _id, image, name, price, description, sizes, brand } = singleProduct;

  // Tính tổng số lượng sản phẩm
  const totalQuantity = sizes.reduce(
    (sum, sizeObj) => sum + sizeObj.quantity,
    0
  );

  const increaseAmount = (maxQuantity) => {
    if (!selectedSize) {
      toast("Please select a size first", { type: "error", draggable: false });
      return;
    }
    setAmount((prevAmount) =>
      prevAmount === maxQuantity ? maxQuantity : prevAmount + 1
    );
  };

  const decreaseAmount = () => {
    setAmount((prevAmount) => (prevAmount > 1 ? prevAmount - 1 : 1));
  };

  const addToCart = (_id, amount) => {
    if (!selectedSize) {
      toast("Please select a size before adding to cart", {
        type: "error",
        draggable: false,
      });
      return;
    }

    const selectedSizeObj = sizes.find(
      (sizeObj) => sizeObj.size === selectedSize
    );

    if (amount > selectedSizeObj.quantity) {
      toast(
        `Only ${selectedSizeObj.quantity} items available for size ${selectedSize}`,
        {
          type: "error",
          draggable: false,
        }
      );
      return;
    }

    dispatch(addItem({ id: _id, amount, size: selectedSize }));
  };

  return (
    <div className="single-product pt-20 xl:pt-44">
      <div className="single-product-container items-start">
        <img
          src={image}
          alt={name}
          className="product-img sm:max-w-[600px] mx-auto"
        />
        <div className="product-info-container">
          <p className="product-name">{name}</p>
          <p className="my-2">
            Brand name: <span className="font-bold">{brand}</span>
          </p>
          {totalQuantity === 0 && (
            <p className="text-red-500 font-bold mt-2">Out of stock</p>
          )}
          <p className="product-price">{price.toLocaleString("vi-VN")} VND</p>
          <div className="product-sizes">
            <p className="mb-4 font-sans text-base font-medium">Select size:</p>
            <div className="sizes-container flex flex-wrap">
              {sizes.map((sizeObj, index) => (
                <button
                  key={index}
                  className={`size-btn bg-gray-50 border-none py-2 ${
                    selectedSize === sizeObj.size ? "selected" : ""
                  }`}
                  onClick={() => setSelectedSize(sizeObj.size)}
                  disabled={sizeObj.quantity === 0}
                >
                  {sizeObj.size}
                  {sizeObj.quantity > 0 ? (
                    <p className="text-xs">({sizeObj.quantity} available)</p>
                  ) : (
                    <p className="text-xs text-red-500">(Out of stock)</p>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="product-quantity p-5">
            <button onClick={decreaseAmount}>
              <i className="fa-solid fa-minus"></i>
            </button>
            <input
              type="text"
              className="amount"
              value={amount}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value > 0) {
                  setAmount(value);
                }
              }}
            />
            <button
              onClick={() =>
                increaseAmount(
                  selectedSize
                    ? sizes.find((sizeObj) => sizeObj.size === selectedSize)
                        ?.quantity
                    : 0
                )
              }
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          </div>
          {totalQuantity === 0 ? (
            <Tooltip title="This product is run out of stock">
              <Button
                // className="add-btn"
                className="w-full py-6 text-xl bg-gray-700 text-white"
                onClick={() => addToCart(_id, amount)}
                disabled={totalQuantity === 0 ? true : false}
              >
                Add to cart
              </Button>
            </Tooltip>
          ) : (
            <button
              className="add-btn"
              onClick={() => addToCart(_id, amount)}
              disabled={totalQuantity === 0 ? true : false}
            >
              Add to cart
            </button>
          )}
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-6 mt-5 text-gray-900 max-w-6xl mx-auto px-4">
        Description
      </h2>
      <p className="product-description text-gray-600 max-w-[1100px] px-4 sm:px-0 mx-auto">
        {description}
      </p>
      <div className="max-w-6xl mx-auto mt-16 px-4">
      <SizeChart />
        {/* Product Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Product Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 text-gray-900">
                Premium Materials
              </h3>
              <p className="text-gray-600">
                Crafted with high-quality materials for durability and style.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 text-gray-900">
                Comfort Technology
              </h3>
              <p className="text-gray-600">
                Enhanced cushioning system for all-day comfort.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 text-gray-900">
                Iconic Design
              </h3>
              <p className="text-gray-600">
                Features a classic and timeless design.
              </p>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Specifications
          </h2>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">
                  Upper Material
                </dt>
                <dd className="text-sm text-gray-900 col-span-2">Leather</dd>
              </div>
              <div className="bg-white px-4 py-5 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">
                  Sole Material
                </dt>
                <dd className="text-sm text-gray-900 col-span-2">Rubber</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">
                  Closure Type
                </dt>
                <dd className="text-sm text-gray-900 col-span-2">Lace-up</dd>
              </div>
              <div className="bg-white px-4 py-5 grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-gray-500">
                  Weight
                </dt>
                <dd className="text-sm text-gray-900 col-span-2">400g</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Care Instructions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Care Instructions
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <p className="text-gray-600">• Clean with a soft, dry brush.</p>
            <p className="text-gray-600">
              • For tough stains, use a specialized cleaner.
            </p>
            <p className="text-gray-600">• Avoid direct sunlight when drying.</p>
            <p className="text-gray-600">• Store in a cool, dry place.</p>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Shipping & Returns
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3 text-gray-900">
                Free Shipping
              </h3>
              <p className="text-gray-600">• Delivery within 3-7 days.</p>
              <p className="text-gray-600">• Full tracking provided.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-3 text-gray-900">
                Easy Returns
              </h3>
              <p className="text-gray-600">• 30-day return window.</p>
              <p className="text-gray-600">• Free returns available.</p>
            </div>
          </div>
        </div>
      </div>
      <Comments productId={singleProduct._id} user={true} />
    </div>
  );
};
