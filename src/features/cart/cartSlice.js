// src/features/cart/cartSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const getAllProducts = createAsyncThunk(
    "cart/getAllProducts",
    async () => {
        try {
            const response = await fetch(
                "https://kltn-server.vercel.app/api/v1/products"
            );
            const dataResponse = await response.json();
            return dataResponse;
        } catch (err) {
            console.log(err);
        }
    }
);

const initialState = {
    cartItems: localStorage.getItem("cartItems")
        ? JSON.parse(localStorage.getItem("cartItems"))
        : [],
    amount: 0,
    total: 0,
    isLoading: true,
    data: [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem: (state, action) => {
            const { id, amount, size } = action.payload;

            const existingItem = state.cartItems.find(
                (item) => item._id === id && item.size === size
            );

            if (existingItem) {
                existingItem.amount += amount;
                // Kiểm tra số lượng tối đa
                const sizeInfo = existingItem.sizes.find(s => s.size === size);
                if (existingItem.amount > sizeInfo.quantity) {
                    existingItem.amount = sizeInfo.quantity;
                    toast(`Cannot add more than ${sizeInfo.quantity} items for size ${size}`, { type: "error" });
                }
            } else {
                const newItem = state.data.find((item) => item._id === id);
                if (newItem) {
                    state.cartItems.push({
                        ...newItem,
                        amount,
                        size
                    });
                }
                toast("Added to cart successfully", {
                type: "success",
                draggable: false,
            });
            }

            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },

        removeItem: (state, action) => {
            const { id, size } = action.payload;
            state.cartItems = state.cartItems.filter(
                (item) => !(item._id === id && item.size === size)
            );
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },

        decreaseItem: (state, action) => {
            const { id, size } = action.payload;
            const existingItem = state.cartItems.find(
                (item) => item._id === id && item.size === size
            );

            if (existingItem) {
                existingItem.amount -= 1;
                if (existingItem.amount <= 0) {
                    state.cartItems = state.cartItems.filter(
                        (item) => !(item._id === id && item.size === size)
                    );
                }
            }

            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },

        increaseItem: (state, action) => {
            const { id, size } = action.payload;
            const existingItem = state.cartItems.find(
                (item) => item._id === id && item.size === size
            );

            if (existingItem) {
                existingItem.amount += 1;
                const sizeInfo = existingItem.sizes.find(s => s.size === size);
                if (existingItem.amount > sizeInfo.quantity) {
                    existingItem.amount = sizeInfo.quantity;
                    toast(`Cannot add more than ${sizeInfo.quantity} items for size ${size}`, { type: "error" });
                }
            }

            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },

        getTotalAmount: (state) => {
            let { amount, total } = state.cartItems.reduce(
                (a, c) => {
                    a.amount += c.amount;
                    a.total += c.amount * c.price;
                    return a;
                },
                { amount: 0, total: 0 }
            );
            state.amount = amount;
            state.total = total;
        },

        clearCart: (state) => {
            state.cartItems = [];
            localStorage.removeItem("cartItems");
        }
    },
    extraReducers: {
         [getAllProducts.pending]: (state) => {
            state.isLoading = true;
        },
        [getAllProducts.fulfilled]: (state, action) => {
            state.data = action.payload.products;
            state.isLoading = false;
        },
        [getAllProducts.rejected]: (state) => {
            state.isLoading = false;
            state.data = [];
        },
    },
});

export const {
    removeItem,
    increaseItem,
    decreaseItem,
    getTotalAmount,
    addItem,
    clearCart
} = cartSlice.actions;
export default cartSlice.reducer;
