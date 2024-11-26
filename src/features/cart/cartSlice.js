import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
    cartItems: localStorage.getItem("cartItems")
        ? JSON.parse(localStorage.getItem("cartItems"))
        : [],
    amount: 0,
    total: 0,
    isLoading: true,
    data: [],
};

export const getAllProducts = createAsyncThunk(
    "cart/getAllProducts",
    async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/v1/products"
            );
            const dataResponse = await response.json();
            return dataResponse;
        } catch (err) {
            console.log(err);
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem: (state, action) => {
            let flag = false;
            const items = state.cartItems.map((item) => {
                if (item._id === action.payload.id) {
                    flag = true;
                    return {
                        ...item,
                        amount: item.amount + action.payload.amount,
                    };
                }
                return item;
            });
            if (flag) {
                state.cartItems = items;
            } else {
                const newItem = state.data.filter(
                    (item) => item._id === action.payload.id
                );
                newItem[0].amount = action.payload.amount;
                state.cartItems = [...state.cartItems, newItem[0]];
            }
            state.cartItems = [...state.cartItems];
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },

        removeItem: (state, action) => {
            state.cartItems = state.cartItems.filter(
                (item) => item._id !== action.payload
            );
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },

        decreaseItem: (state, action) => {
            const newItems = state.cartItems
                .map((item) => {
                    if (item._id === action.payload) {
                        return { ...item, amount: item.amount - 1 };
                    }
                    return item;
                })
                .filter((item) => item.amount > 0);
            state.cartItems = newItems;
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },

        increaseItem: (state, action) => {
            const newItems = state.cartItems.map((item) => {
                if (item._id === action.payload) {
                    return { ...item, amount: item.amount + 1 };
                }
                return item;
            });
            state.cartItems = newItems;
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },

        getTotalAmount: (state) => {
                let { amount, total } = state.cartItems.reduce(
                    (a, c) => {
                        // console.log(c);
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
            state.cartItems = []
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
