import { initializeApp } from "firebase/app";
import { onMessage, getMessaging, getToken } from "firebase/messaging";
import { refreshFcmToken } from "../api/fcmApi.js"

const { VITE_VAPID_KEY } = import.meta.env;
const FIREBASE_WEB_CONFIG = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(FIREBASE_WEB_CONFIG);
export const messaging = getMessaging(app);

export async function issueFcmToken() {
    try {
        const currentToken = await getToken(messaging, {
            vapidKey: VITE_VAPID_KEY,
        });
        if (currentToken) {
            return currentToken;
        } else {
            console.log("토큰을 가져올 수 없음");
        }
    } catch (err) {
        console.error("토큰 가져오기 에러", err);
    }
}

export async function syncFcmToken() {
    try {
        const newToken = await issueFcmToken();
        if (!newToken) return;

        refreshFcmToken(newToken);

        return newToken;
    } catch (err) {
        console.error("❌ FCM 토큰 동기화 실패:", err);
    }
}

onMessage(messaging, (payload) => {
    const title = payload.data.title;
    const options = {
        body: payload.data.body,
    };

    if (Notification.permission === "granted") {
        new Notification(title, options);
    } else {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                new Notification(title, options);
            } else {
                console.warn("❌ 알림 권한이 없어 표시되지 않았습니다.");
            }
        });
    }
});