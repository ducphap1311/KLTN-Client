import React from "react";
import { Footer } from "../components/Footer";
import { HeroSlider } from "../components/HeroSlider";
import { HomeProducts } from "../components/HomeProducts";
import { Navbar } from "../components/Navbar";
import { Link } from "react-router-dom";
export const HomePage = () => {
  return (
    <>
      <Navbar />
      <HeroSlider />
      <HomeProducts
        quality="best seller"
        title="Best Seller"
        icon="fa-sharp fa-solid fa-bolt"
      />
      <HomeProducts
        quality="most popular"
        title="Most Popular"
        icon="fa-solid fa-fire-flame-curved"
      />
      <section className="py-5 pb-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 ">
          <div className="grid grid-cols-1 gap-12 items-center max-w-[1100px] mx-auto">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Your Ultimate Destination for Premium Headwear
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Welcome to our curated collection of authentic MLB caps and
                premium headwear. We pride ourselves on offering genuine,
                high-quality products that combine style, comfort, and
                authenticity.
              </p>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">
                    1000+
                  </div>
                  <div className="text-sm text-gray-600">
                    Products Available
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">
                    50K+
                  </div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">
                    24/7
                  </div>
                  <div className="text-sm text-gray-600">Customer Support</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-semibold text-lg mb-2">
                    Authentic Products
                  </h3>
                  <p className="text-gray-600">
                    100% genuine MLB licensed merchandise
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-semibold text-lg mb-2">Fast Shipping</h3>
                  <p className="text-gray-600">
                    Quick delivery to your doorstep
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-semibold text-lg mb-2">Wide Selection</h3>
                  <p className="text-gray-600">
                    All teams and styles available
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-semibold text-lg mb-2">Easy Returns</h3>
                  <p className="text-gray-600">30-day hassle-free returns</p>
                </div>
              </div>
            </div>
              <Link to="/products">
                <button
                  className="
                                w-fit
                                block
                                mx-auto
                                    px-6 py-3 
                                    bg-gradient-to-r from-gray-800 to-gray-900 
                                    text-white font-semibold text-lg
                                    rounded-full shadow-lg
                                    transition duration-300 ease-in-out
                                    hover:from-gray-900 hover:to-black
                                    hover:shadow-xl hover:scale-105
                                    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50
                                    active:scale-95
      "
                >
                  Explore our collection
                </button>
              </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};
