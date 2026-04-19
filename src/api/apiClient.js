import axios from 'axios';
import { getAccessToken } from "../context/authStore.js";
import { silentRefresh } from "./authApi.js"
import { ApplicationError } from "./ApplicationError.js"

const { VITE_API_BASE_URL } = import.meta.env;

export const requestWithAuth = axios.create({
    baseURL: VITE_API_BASE_URL
})

export const request = axios.create({
    baseURL: VITE_API_BASE_URL
})

request.interceptors.response.use(
    response => unwrapResponse(response),
    error => {
        const { response } = error;
        const data = response?.data;

        if (data?.code && data?.message) {
            return Promise.reject(
                new ApplicationError(data.message, data.code, response.status, data.errors, error)
            );
        }

        return Promise.reject(error);
    }
)

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
    response => unwrapResponse(response),
    error => {
        const { response } = error;
        const data = response?.data;
        const originalRequest = error.config; // 이전 보낸 request 정보

        if (!response || !data?.code || !data?.message) {
            console.error("Axios interceptor unexpected response error:", error);
            return Promise.reject(error);
        }

        // 실패: 인증관련 실패 코드가 아닌경우
        if (!shouldRetryWithRefresh(response, data)) {
            return Promise.reject(
                new ApplicationError(data.message, data.code, response.status, data.errors, error)
            );
        }

        // === 토큰이 만료되어 갱신이 필요함: Refresh Token 로직 시작 ===
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
                window.dispatchEvent(new CustomEvent("tokenRefreshed", {
                    detail: { accessToken: newAccessToken }
                }))
                return newAccessToken;
            }).catch(error => {
                const refreshData = error?.response?.data;

                if (shouldInvalidateSession(refreshData?.code)) {
                    window.dispatchEvent(new CustomEvent("tokenRefreshFailed"));
                }

                if (refreshData?.code && refreshData?.message) {
                    return Promise.reject(
                        new ApplicationError(
                            refreshData.message,
                            refreshData.code,
                            error.response.status,
                            refreshData.errors,
                            error
                        )
                    );
                }

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

        return Promise.reject(
            new ApplicationError(data.message, data.code, response.status, data.errors, error)
        );
    }
);

function unwrapResponse(response) {
    if (response.status === 204) return null;
    return response.data;
}

function shouldRetryWithRefresh(response, data) {
    return response.status === 401 && ['AU007','AU008'].includes(data.code);
}

function shouldInvalidateSession(code) {
    return ['AU004','AU005'].includes(code);
}

export const HEADERS = Object.freeze({
    URL_ENCODED: { 'Content-Type': 'application/x-www-form-urlencoded' },
    JSON: { 'Content-Type': 'application/json' },
    MULTIPART: { 'Content-Type': 'multipart/form-data' },
});
