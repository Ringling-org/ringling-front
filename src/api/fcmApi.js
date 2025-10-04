import {requestWithAuth, HEADERS } from './apiClient.js'

export const FCM_TOKEN_API  = Object.freeze({
    REFRESH: '/fcm/fcm-token',
});

export async function refreshFcmToken(token) {
    const payload = { token };
    const result = await requestWithAuth.post(
        FCM_TOKEN_API.REFRESH,
        payload,
        { headers: HEADERS.JSON }
    );
    return result.data;
}