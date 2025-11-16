import {createContext, useContext, useState, useEffect, useCallback } from "react";
import {decodeToken} from "../utils/JwtUtils.js";
import {logoutWithKakao, silentRefresh } from "../api/authApi.js";
import {getUserInfo} from "../api/userApi.js";
import {storeAccessToken} from "./authStore.js";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [userInfo, setUserInfo] = useState(null);

    const login = useCallback(async (accessToken) => {
        await initUserInfo(accessToken);
    }, []);

    const logout = useCallback(async () => {
        try {
            await logoutWithKakao();
        } catch (error) {
            console.error(error)
        } finally {
            setUserInfo(null);
            storeAccessToken(null)
            alert('✅ 로그아웃 되었습니다!');
        }
    }, [])

    useEffect(() => {
        refreshAuthSession();
    }, []);

    // API 요청 중 AccessToken 만료 시 (인터셉터에서 재발급 이벤트 처리)
    useEffect(() => {
        // Success Event
        const handleTokenRefreshed = (event) => {
            console.log("Event 'tokenRefreshed' received!");
            const { accessToken } = event.detail;
            login(accessToken); // React 상태 업데이트
        }

        // Fail Event
        const handleTokenRefreshFailed = () => {
            console.log("Event 'tokenRefreshFailed' received!");
            setUserInfo(null);
            storeAccessToken(null);
            alert('세션이 만료되어 자동 로그아웃되었습니다.');
        }

        window.addEventListener("tokenRefreshed", handleTokenRefreshed);
        window.addEventListener("tokenRefreshFailed", handleTokenRefreshFailed);

        // clean-up
        return () => {
            window.removeEventListener("tokenRefreshed", handleTokenRefreshed);
            window.removeEventListener("tokenRefreshFailed", handleTokenRefreshFailed);
        }
    }, [login, logout])

    // 초기 렌더링 또는 새로고침 시 AccessToken 발급
    const refreshAuthSession = useCallback(async () => {
        try {
            const accessToken = await silentRefresh();
            login(accessToken);
        } catch (error) {
            console.error(error);
            setUserInfo(null);
        }
    }, []);

    const initUserInfo = useCallback(async (accessToken) => {
        try {
            const decodedUser = decodeToken(accessToken);
            if (!decodedUser?.sub) throw new Error("유효하지않은 token")

            const newUserData = await getUserInfo(decodedUser.sub);

            // 기존 userInfo와 비교 후 변경 시에만 갱신
            setUserInfo(prevUserInfo => {
                const isSameUser = JSON.stringify(prevUserInfo) === JSON.stringify(newUserData);
                return isSameUser ? prevUserInfo : newUserData;
            });
        } catch (error) {
            console.error(error);
            storeAccessToken(null);
            setUserInfo(null);
        }
    }, [])

    return (
        <AuthContext.Provider
            value={{
                userInfo, isLoggedIn: !!userInfo,
                login, logout
            }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);