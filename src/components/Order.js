import React from "react";
import { Link } from "react-router-dom";

export const Order = ({_id, name, address, orderTotal, createdAt, amount }) => {
    const date = new Date(createdAt);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const day = date.getDate();
    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const formattedTime = `${hours % 12}:${String(minutes).padStart(2, "0")} ${
        hours >= 12 ? "pm" : "am"
    } - ${month} ${day}th, ${year}`;

    return (
        <tr>
            <td>{name}</td>
            <td>{address}</td>
            <td>{amount}</td>
            <td>${orderTotal.toFixed(2)}</td>
            <td>{formattedTime}</td>
            <td>Shipping</td>
            <td>
                <Link to={`/orders/${_id}`} className="order-detail-link">
                    See detail
                </Link>
            </td>
        </tr>
    );
};
