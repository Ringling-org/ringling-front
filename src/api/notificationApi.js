import {requestWithAuth, HEADERS } from './apiClient.js'

export const REMINDER_NOTIFICATION_API = Object.freeze({
    CREATE: '/reminder-notification',
});

export async function createReminderNotification(payload){
    const result = await requestWithAuth.post(
        REMINDER_NOTIFICATION_API.CREATE,
        payload,
        { headers: HEADERS.JSON }
    )
    return result.data;
}