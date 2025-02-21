import axios from "axios";

import {

    CREATE_ORDER_FAIL,
    CREATE_ORDER_REQUEST,
    CLEAR_ERRORS,
    CREATE_ORDER_SUCCESS,
    CREATE_PAYMENT_FAIL,
    CREATE_PAYMENT_REQUEST,
    MY_ORDER_FAIL,
    MY_ORDER_REQUEST,
    MY_ORDER_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
} from "../constants/orderConstant";

const apiURL = process.env.REACT_APP_API_URL;
const getAuthHeaders = () => {
    const token = localStorage.getItem("token"); // Modify based on where you store the token
    return {
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token} `})
    }
 };
};


export const createOrder = (session_id) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_ORDER_REQUEST,
        });
        // const config = {
        //     headers: { "Content-Type": "application/json" },
        // };
        const { data } = await axios.post(
            "${apiURL}/api/v1/eats/orders/new",
             { session_id }, 
             getAuthHeaders());
        dispatch({
            type: CREATE_ORDER_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: CREATE_ORDER_FAIL,
            payload: error.response?.data?.message||"Failed to create order",
        });
    }
};

export const payment = (items, restaurant) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_PAYMENT_REQUEST });
        // const config = {
        //     headers: { "Content-Type": "application/json" },
        // };
        const { data } = await axios.post(`${apiURL}/api/v1/payment/process`,
            {
                items,
                restaurant,
            },
            getAuthHeaders()
        );
        if (data.url) {
            window.location.href = data.url;
        }
    } catch (error) {
        dispatch({
            type: CREATE_PAYMENT_FAIL,
            payload: error.response?.data?.message || "Failed to process payment",
        });
    }
};
//my order

export const myOrders = () => async (dispatch) => {
    try {
        dispatch({
            type: MY_ORDER_REQUEST,
        });
        const { data } = await axios.get(`${apiURL}/api/v1/eats/orders/me/myOrders`,getAuthHeaders());
        dispatch({
            type: MY_ORDER_SUCCESS,
            payload: data.orders,
        });
    } catch (error) {
        dispatch({
            type: MY_ORDER_FAIL,
            payload: error.response?.data?.message|| "Failed to get orders",
        });
    }
};


export const getOrderDetails = (id) => async (dispatch) => {

    try {

        dispatch({ type: ORDER_DETAILS_REQUEST });

        const { data } = await axios.get(`${apiURL}/api/v1/eats/orders/${id}`,getAuthHeaders());

        dispatch({

            type: ORDER_DETAILS_SUCCESS,

            payload: data.order,

        });

    } catch (error) {

        dispatch({

            type: ORDER_DETAILS_FAIL,

            payload: error.response?.data?.message|| "Failed to get order details",

        });
    }

};

//clear errors
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS,
    });
};


