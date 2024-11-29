import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loading } from "./Loading";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/SingleProduct.scss";
import { addItem } from "../features/cart/cartSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";

export const SingleProduct = () => {
  const { id } = useParams();
  const [singleProduct, setSingleProduct] = useState();
  const [amount, setAmount] = useState(1);
  const [selectedSize, setSelectedSize] = useState(""); // Lưu kích thước được chọn
  const dispatch = useDispatch();
  const { cartItems, addItemStatus } = useSelector((store) => store.cart);
  const navigate = useNavigate();

  const getSingleProduct = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/products/${id}`
      );
      const responseData = await response.json();
      const data = responseData.product;
      setSingleProduct(data);
    } catch (error) {
      console.log(error);
    }
  };

  let settings = {
    customPaging: function (i) {
      return (
        <img
          src={singleProduct.images[i]}
          alt="page-img"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      );
    },
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
  };

  const increaseAmount = (maxQuantity) => {
    if (!selectedSize) {
      toast("Please select a size first", {
        type: "error",
        draggable: false,
      });
      return;
    }
    setAmount((prevAmount) => {
      if (prevAmount === maxQuantity) return maxQuantity;
      return prevAmount + 1;
    });
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

    const selectedSizeObj = singleProduct.sizes.find(
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

  const buyNow = (_id, amount) => {
    addToCart(_id, amount);
    if (!selectedSize) {
      toast("Please select a size before adding to cart", {
        type: "error",
        draggable: false,
      });
      return;
    }

    const selectedSizeObj = singleProduct.sizes.find(
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
    navigate("/cart");
  };

  useEffect(() => {
    getSingleProduct();
  }, [id]);

  if (!singleProduct) {
    return <Loading />;
  } else {
    const { _id, images, name, price, description, sizes } = singleProduct;
    const maxQuantity = selectedSize
      ? sizes.find((sizeObj) => sizeObj.size === selectedSize)?.quantity || 0
      : 0;

    return (
      <div className="single-product">
        <div className="single-product-container">
          <Slider {...settings}>
            {images.map((image, index) => (
              <div className="product-img-container" key={index}>
                <img src={image} alt="product-img" className="product-img" />
              </div>
            ))}
          </Slider>
          <div className="product-info-container">
            <p className="product-name">{name}</p>
            <p className="product-price">
              <i className="fa-solid fa-dollar-sign"></i>
              {price}
            </p>
            <p className="product-description">{description}</p>

            <div className="product-sizes">
              <p className="mb-4">Select size:</p>
              <div className="sizes-container">
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
                    {sizeObj.quantity > 0
                      ? <p className="text-xs">({sizeObj.quantity} available)</p>
                      : "Out of stock"}
                    
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
                  if (value > 0 && value <= maxQuantity) {
                    setAmount(value);
                  }
                }}
              />
              <button onClick={() => increaseAmount(maxQuantity)}>
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>

            <button className="add-btn" onClick={() => addToCart(_id, amount)}>
              Add to cart
            </button>
            <button className="buy-btn" onClick={() => buyNow(_id, amount)}>
              Buy now
            </button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-16 px-4">
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
                  Crafted with high-quality denim and genuine leather accents
                  for durability and style
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-gray-900">
                  Comfort Technology
                </h3>
                <p className="text-gray-600">
                  Enhanced cushioning system with memory foam insole for all-day
                  comfort
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3 text-gray-900">
                  Iconic Design
                </h3>
                <p className="text-gray-600">
                  Features the classic Boston Red Sox logo with vintage denim
                  finish
                </p>
              </div>
              {/* <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 text-gray-900">Versatile Style</h3>
            <p className="text-gray-600">Perfect for casual wear, sports events, or streetwear fashion</p>
          </div> */}
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
                  <dd className="text-sm text-gray-900 col-span-2">
                    Denim, Synthetic Leather
                  </dd>
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
                  <dt className="text-sm font-medium text-gray-500">Weight</dt>
                  <dd className="text-sm text-gray-900 col-span-2">
                    400g (per shoe)
                  </dd>
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
              <p className="text-gray-600">
                • Clean with a soft, dry brush to remove surface dirt
              </p>
              <p className="text-gray-600">
                • For tough stains, use a specialized sneaker cleaner
              </p>
              <p className="text-gray-600">
                • Air dry at room temperature, avoid direct sunlight
              </p>
              <p className="text-gray-600">
                • Store in a cool, dry place when not in use
              </p>
              <p className="text-gray-600">
                • Replace insoles periodically for optimal comfort
              </p>
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
                <p className="text-gray-600">
                  • Delivery within 3-7 business days
                </p>
                <p className="text-gray-600">• Full tracking provided</p>
                <p className="text-gray-600">• Insurance included</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-3 text-gray-900">
                  Easy Returns
                </h3>
                <p className="text-gray-600">• 30-day return window</p>
                <p className="text-gray-600">• Free returns</p>
                <p className="text-gray-600">• Original condition required</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
