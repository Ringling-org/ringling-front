import axios from 'axios';
import { getAccessToken } from "../context/authStore.js";

const { VITE_API_BASE_URL } = import.meta.env;

export const requestWithAuth = axios.create({
    baseURL: VITE_API_BASE_URL
})

export const request = axios.create({
    baseURL: VITE_API_BASE_URL
})

requestWithAuth.interceptors.request.use(
    config => {
        const accessToken = getAccessToken();
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

requestWithAuth.interceptors.response.use(
    response => response,
    async (error) => {
        if (error.response?.status === 401) {
            console.log("인증불가")
        }
        return Promise.reject(error);
    }
);

export const HEADERS = Object.freeze({
    URL_ENCODED: { 'Content-Type': 'application/x-www-form-urlencoded' },
    JSON: { 'Content-Type': 'application/json' },
    MULTIPART: { 'Content-Type': 'multipart/form-data' },
});