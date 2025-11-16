import {requestWithAuth, HEADERS } from './apiClient.js'

export const FCM_TOKEN_API  = Object.freeze({
    REFRESH: '/fcm/fcm-token',
});

export async function refreshFcmToken(token) {
    const result = await requestWithAuth.post(
        FCM_TOKEN_API.REFRESH,
        { token },
        { headers: HEADERS.JSON }
    );
    return result;
}