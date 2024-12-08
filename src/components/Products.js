import React, { useState, useEffect } from "react";
import Product from "./Product";
import "../styles/Products.scss";
import "../styles/Pagination.scss";
import { Link } from "react-router-dom";
import { Loading } from "./Loading";

export const Products = () => {
    const [data, setData] = useState();
    const [products, setProducts] = useState();
    const [brand, setBrand] = useState("");
    const [quality, setQuality] = useState("");
    const [sort, setSort] = useState("price");
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [page, setPage] = useState(0);
    const itemsPerPage = 9;

    const getProducts = async () => {
        try {
            setLoadingProducts(true);
            const response = await fetch(
                `http://localhost:5000/api/v1/products?brand=${brand}&quality=${quality}&sort=${sort}`
            );
            const responseData = await response.json();

            const activeProducts = responseData.products.filter(
                (product) => product.isActive
            );

            const numberOfPages = Math.ceil(activeProducts.length / itemsPerPage);
            const newData = Array.from(
                { length: numberOfPages },
                (_, index) => {
                    const start = index * itemsPerPage;
                    return activeProducts.slice(start, start + itemsPerPage);
                }
            );
            setData(newData);
        } catch (error) {
            console.error("Error fetching products:", error);
            setLoadingProducts(true);
        } finally {
            setLoadingProducts(false);
        }
    };

    const clearFilter = () => {
        setBrand("");
        setQuality("");
        setSort("");
    };

    const prevPage = () => {
        setPage((oldPage) => {
            if (oldPage === 0) {
                return data.length - 1;
            }
            return oldPage - 1;
        });
    };

    const nextPage = () => {
        setPage((oldPage) => {
            if (oldPage === data.length - 1) {
                return 0;
            }
            return oldPage + 1;
        });
    };

    const handlePage = (index) => {
        setPage(index);
    };

    useEffect(() => {
        setPage(0);
        getProducts();
    }, [brand, quality, sort]);

    useEffect(() => {
        if (!data) return;
        window.scrollTo({ top: 0, left: 0, behavior: "smooth", duration: 5000 });
        setLoadingProducts(false);
        setProducts(data[page]);
    }, [data, page]);

    if (!data) {
        return <Loading />;
    }

    return (
        <div className="products">
            <div className="products-container">
                <div className="products-filter">
                    <div className="products-title">
                        <Link to="/" className="link-back-home">
                            HOME
                        </Link>
                        <span className="slash">/</span>
                        <span className="products-page">PRODUCTS</span>
                    </div>
                    <div className="categories-container">
                        <h3>Brands</h3>
                        <ul>
                            <li
                                className={`${
                                    brand === "" && "category-active"
                                }`}
                                onClick={() => setBrand("")}
                            >
                                All
                            </li>
                            <li
                                className={`${
                                    brand === "MLB" && "category-active"
                                }`}
                                onClick={() => setBrand("MLB")}
                            >
                                MLB
                            </li>
                            <li
                                className={`${
                                    brand === "Adidas" && "category-active"
                                }`}
                                onClick={() => setBrand("Adidas")}
                            >
                                Adidas
                            </li>
                            <li
                                className={`${
                                    brand === "Crocs" && "category-active"
                                }`}
                                onClick={() => setBrand("Crocs")}
                            >
                                Crocs
                            </li>
                        </ul>
                    </div>
                    <div className="qualities-container">
                        <h3>Qualities</h3>
                        <ul>
                            <li
                                className={`${
                                    quality === "" && "quality-active"
                                }`}
                                onClick={() => setQuality("")}
                            >
                                All
                            </li>
                            <li
                                className={`${
                                    quality === "best seller" &&
                                    "quality-active"
                                }`}
                                onClick={() => setQuality("best seller")}
                            >
                                Best seller
                            </li>
                            <li
                                className={`${
                                    quality === "most popular" &&
                                    "quality-active"
                                }`}
                                onClick={() => setQuality("most popular")}
                            >
                                Most popular
                            </li>
                        </ul>
                    </div>
                    <div className="sort-container">
                        <label htmlFor="sort" className="w-[70px]">Sort by:</label>
                        <select
                            name="sort"
                            id="sort"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                        >
                            <option value="price">Price (Lowest)</option>
                            <option value="-price">Price (Highest)</option>
                            <option value="name">Name (A-Z)</option>
                            <option value="-name">Name (Z-A)</option>
                        </select>
                    </div>
                    <button
                        className="clear-filter-btn"
                        onClick={() => clearFilter()}
                    >
                        Clear Filter
                    </button>
                </div>
                <div className="products-list">
                    {loadingProducts ? (
                        <Loading />
                    ) : !products ? (
                        <p
                            style={{
                                marginTop: "10px",
                                fontSize: "18px",
                                fontWeight: "bold",
                                color: "#3f3f3f",
                            }}
                        >
                            No active products matched your search.
                        </p>
                    ) : (
                        products.map((product) => {
                            return (
                                <Product product={product} key={product._id} />
                            );
                        })
                    )}
                </div>
            </div>
            {products && (
                <div className="pagination-container flex justify-center items-center space-x-2 mt-6">
                    <button
                        className="prev-btn px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded disabled:bg-gray-100 disabled:text-gray-400"
                        onClick={prevPage}
                        disabled={page === 0}
                    >
                        Prev
                    </button>
                    {data.map((_, index) => (
                        <button
                            key={index}
                            className={`px-4 py-2 rounded ${
                                index === page
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-800 hover:bg-blue-400 hover:text-white transition-colors"
                            }`}
                            onClick={() => handlePage(index)}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        className="next-btn px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded disabled:bg-gray-100 disabled:text-gray-400"
                        onClick={nextPage}
                        disabled={page === data.length - 1}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};
