import React, { useState, useEffect } from "react";
import Product from "./Product";
import "../styles/Products.scss";
import { Pagination } from "antd";
import { Link } from "react-router-dom";
import { Loading } from "./Loading";

export const Products = () => {
  const [data, setData] = useState();
  const [products, setProducts] = useState([]);
  const [brand, setBrand] = useState("");
  const [quality, setQuality] = useState("");
  const [sort, setSort] = useState("price");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [page, setPage] = useState(1); // Start from page 1
  const itemsPerPage = 9;

  const getProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await fetch(
        `https://kltn-server.vercel.app/api/v1/products?brand=${brand}&quality=${quality}&sort=${sort}`
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

  const handlePageChange = (page) => {
    setPage(page);
    setProducts(data[page - 1]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    setPage(1); // Reset to page 1 whenever filters change
    getProducts();
  }, [brand, quality, sort]);

  useEffect(() => {
    if (data) {
      setProducts(data[page - 1]);
    }
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
                className={`${brand === "" && "category-active"}`}
                onClick={() => setBrand("")}
              >
                All
              </li>
              <li
                className={`${brand === "MLB" && "category-active"}`}
                onClick={() => setBrand("MLB")}
              >
                MLB
              </li>
              <li
                className={`${brand === "Adidas" && "category-active"}`}
                onClick={() => setBrand("Adidas")}
              >
                Adidas
              </li>
              <li
                className={`${brand === "Crocs" && "category-active"}`}
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
                className={`${quality === "" && "quality-active"}`}
                onClick={() => setQuality("")}
              >
                All
              </li>
              <li
                className={`${
                  quality === "best seller" && "quality-active"
                }`}
                onClick={() => setQuality("best seller")}
              >
                Best seller
              </li>
              <li
                className={`${
                  quality === "most popular" && "quality-active"
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

      {/* Responsive Pagination */}
      {products && (
        <div className="pagination-container flex justify-center mt-6">
          <Pagination
            current={page}
            total={data.length * itemsPerPage}
            pageSize={itemsPerPage}
            onChange={handlePageChange}
            responsive
          />
        </div>
      )}
    </div>
  );
};
