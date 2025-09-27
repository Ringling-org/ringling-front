import {requestWithAuth, HEADERS } from './apiClient.js'

export const NOTIFICATION_TOKEN_API = Object.freeze({
    REGISTER_FCM_TOKEN: '/reminder-notification/fcm-token',
});

export const REMINDER_NOTIFICATION_API = Object.freeze({
    CREATE: '/reminder-notification',
});

export async function refreshFcmToken(token) {
    const payload = { token };
    const result = await requestWithAuth.post(
        NOTIFICATION_TOKEN_API.REGISTER_FCM_TOKEN,
        payload,
        { headers: HEADERS.JSON }
    );
    return result.data;
}

export async function createReminderNotification(payload){
    const result = await requestWithAuth.post(
        REMINDER_NOTIFICATION_API.CREATE,
        payload,
        { headers: HEADERS.JSON }
    )
    return result.data;
}