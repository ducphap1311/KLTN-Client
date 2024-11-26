import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../styles/Pagination.scss";

export const Pagination = () => {
    const { data, isLoading } = useSelector((store) => store.cart);
    const [page, setPage] = useState(0);
    const itemsPerPage = 9;
    const [products, setProducts] = useState();

    useEffect(() => {
        const numberOfPages = Math.ceil(data.length / itemsPerPage);
        const newData = Array.from({ length: numberOfPages }, (_, index) => {
            const start = index * itemsPerPage;
            return data.slice(start, start + itemsPerPage);
        });
        // setData(newData)
        setProducts(newData);
    }, [isLoading]);

    const prevPage = () => {
        setPage((oldPage) => {
            if (oldPage === 0) {
                return products.length - 1;
            }
            return oldPage - 1;
        });
    };

    const nextPage = () => {
        setPage((oldPage) => {
            if (oldPage === products.length - 1) {
                return 0;
            }
            return oldPage + 1;
        });
    };

    const handlePage = (index) => {
        setPage(index)
    }
    
    if (!products || isLoading) {
        return;
    } else
        return (
            <div className="pagination">
                <div className="pagination-container">
                    <button className="prev-btn" onClick={prevPage}>
                        Prev
                    </button>
                    {products.map((_, index) => {
                        return (
                            <button
                                key={index}
                                className={`${index === page && "active-btn"}`}
                                onClick={() => handlePage(index)}
                            >
                                {index + 1}
                            </button>
                        );
                    })}
                    <button className="next-btn" onClick={nextPage}>
                        Next
                    </button>
                </div>
            </div>
        );
};
