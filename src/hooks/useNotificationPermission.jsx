import { useState, useEffect } from "react";
import { syncFcmToken } from "../utils/firebase.js";
import { useAuth } from "../context/AuthContext.jsx";

export function useNotificationPermission() {
    const { isLoggedIn, userInfo } = useAuth();
    const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
    const [needsPermissionPrompt, setNeedsPermissionPrompt] = useState(false);

    useEffect(() => {
        const cleanup = observeNotificationPermission((state) => {
            setNotificationPermission(state)
        });

        return cleanup;
    }, [])

    useEffect(() => {
        if (!isLoggedIn) {
            clearRequestNotificationPermission();
            return;
        }

        if (notificationPermission === 'granted') {
            syncFcmToken();
            clearRequestNotificationPermission();
            return;
        }

        setNeedsPermissionPrompt(true);
    }, [notificationPermission, userInfo]);

    function observeNotificationPermission(onStateChange) {
        if (!('permissions' in navigator)) {
            console.log('이 브라우저는 Permissions API를 지원하지 않습니다.');
            return () => {};
        }

        let permissionStatusRef = null;
        navigator.permissions.query({ name: 'notifications' }).then((permissionStatus) => {
            permissionStatusRef = permissionStatus;
            onStateChange(permissionStatus);
            permissionStatus.onchange = () => {
                if (permissionStatusRef) {
                    onStateChange(permissionStatus);
                }
            };
        }).catch((error) => {
            console.error('알림 권한 조회 중 오류 발생:', error);
        });

        const cleanup = () => {
            if (permissionStatusRef) {
                permissionStatusRef.onchange = null;
            }
        }

        return cleanup;
    }

    const requestNotificationPermission = async () => {
        if (!("Notification" in window)) {
            alert("이 브라우저는 알림을 지원하지 않습니다.");
            return;
        }

        try {
            const permission = await Notification.requestPermission();
            setNotificationPermission(permission);

            if (permission === "granted") {
                console.log("✅ 알림 권한 허용됨");
            } else {
                alert("알림을 설정할 수 없어요.\n브라우저 설정에서 알림을 허용해주세요.");
            }
        } catch (error) {
            console.error("알림 권한 요청 실패:", error);
            alert("알림 설정 중 오류가 발생했습니다.");
        } finally {
            clearRequestNotificationPermission();
        }
    };

    const clearRequestNotificationPermission = () => {
        setNeedsPermissionPrompt(false);
    }

    return { notificationPermission, needsPermissionPrompt, requestNotificationPermission, clearRequestNotificationPermission };
}