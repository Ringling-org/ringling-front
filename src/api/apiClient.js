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
    response => {
        const { code, data, message } = response.data;

        if (code === 'SUCCESS') return data;

        return Promise.reject(
            new ApplicationError(message, code)
        );
    },
    error => Promise.reject(error)
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
    async response => {
        const { data } = response;
        const originalRequest = response.config; // 이전 보낸 request 정보

        // 성공 응답: 서버의 래핑 구조 { code, message, data } 중 실제 데이터만 반환
        if (data.code === 'SUCCESS') return data.data;

        // 실패: 인증관련 실패 코드가 아닌경우
        if (!['AU007','AU008'].includes(data.code)) {
            console.error(`Application Error: ${data.code}`, data.message);
            // 호출부에서 응답 코드로 분기할 수 있도록 Error를 래핑해 전달
            return Promise.reject(
                new ApplicationError(data.message, data.code)
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
                if (newAccessToken) {
                    // 토큰 갱신 성공 이벤트 전달
                    window.dispatchEvent(new CustomEvent("tokenRefreshed", {
                        detail: { accessToken: newAccessToken }
                    }))
                    return newAccessToken;
                }
            }).catch(error => {
                // 토큰 갱신 실패 이벤트 전달
                window.dispatchEvent(new CustomEvent("tokenRefreshFailed"));
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