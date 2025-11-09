import axios from 'axios';
import { getAccessToken } from "../context/authStore.js";
import { silentRefresh } from "./authApi.js"

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

let isRefreshing = false;
let refreshPromise = null;
requestWithAuth.interceptors.response.use(
    async response => {
        const { data } = response;
        const originalRequest = response.config; // 이전 보낸 request 정보

        if (data.code === 'SUCCESS') return response;

        // 이미 토큰 재발행 중인 경우, 기존 요청 대기
        if (isRefreshing) {
            return refreshPromise.then(newAccessToken => {
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return requestWithAuth(originalRequest);
            }).catch(error => {
                return Promise.reject(error);
            });
        }

        // 아직 재시도 안한 요청만 처리
        if (!originalRequest._retry) {
            originalRequest._retry = true; // 무한 루프 방지
            isRefreshing = true; // 중복 요청 방지

            // 토큰 재발행 시도
            refreshPromise = silentRefresh().then(newAccessToken => {
                if (newAccessToken) {
                    // 토큰 갱신 성공 이벤트 전달
                    window.dispatchEvent(new CustomEvent("tokenRefreshed", {
                        detail: { accessToken: newAccessToken }
                    }))
                    return newAccessToken;
                }

                // ⚠️ RefreshToken 만료 또는 무효
                window.dispatchEvent(new CustomEvent("tokenRefreshFailed"));
                return Promise.reject(new Error("Refresh token expired"));
            }).catch(error => {
                // 토큰 갱신 실패 이벤트 전달
                window.dispatchEvent(new CustomEvent("tokenRefreshedFailed"));
                return Promise.reject(error);

            }).finally(() => {
                isRefreshing = false;
                refreshPromise = null;
            });

            // 갱신 완료 후 원래 요청 재시도
            return refreshPromise.then(newAccessToken => {
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return requestWithAuth(originalRequest);
            })
        }

        return Promise.reject(response.data);
    },
    error => {
        console.error("Axios interceptor unexpected response error:", error);
        return Promise.reject(error);
    }
);

export const HEADERS = Object.freeze({
    URL_ENCODED: { 'Content-Type': 'application/x-www-form-urlencoded' },
    JSON: { 'Content-Type': 'application/json' },
    MULTIPART: { 'Content-Type': 'multipart/form-data' },
});