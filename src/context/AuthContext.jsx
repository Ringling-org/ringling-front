import { createContext, useState, useEffect } from 'react';
import { decodeToken } from "../utils/JwtUtils.js";
import { logoutWithKakao } from "../api/authApi.js";
import { getUserInfo } from "../api/userApi.js";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
    const [auth, setAuth] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    const saveAccessToken = (token) => localStorage.setItem('accessToken', token);
    const saveRefreshToken = (token) => localStorage.setItem('refreshToken', token);
    const removeAccessToken = () => localStorage.removeItem('accessToken');
    const removeRefreshToken = () => localStorage.removeItem('refreshToken');

    useEffect(() => {
        const initAuth = async () => {
            if (!accessToken) {
                setAuth(null);
                setUserInfo(null);
                return;
            }

            try {
                const decodedUser = decodeToken(accessToken);
                setAuth(decodedUser);

                const userInfo = await getUserInfo(decodedUser.sub);
                setUserInfo(userInfo.data);
            } catch (error) {
                console.error("토큰 오류, 세션을 초기화합니다:", error);
                setAccessToken(null);
                setAuth(null);
                removeAccessToken();
                removeRefreshToken();
            }
        }

        initAuth();
    }, [accessToken]);

    const login = ({ accessToken, refreshToken }) => {
        setAccessToken(accessToken);
        saveAccessToken(accessToken);
        saveRefreshToken(refreshToken);
    };

    const logout = async () => {
        if (accessToken) {
            try {
                await logoutWithKakao(accessToken);
            } catch (error) {
                console.error("서버 로그아웃 실패:", error);
            }
        }
        setAccessToken(null);
        removeAccessToken();
        removeRefreshToken();
        alert('✅ 로그아웃 되었습니다!');
    };

    const value = {
        auth,
        userInfo,
        accessToken,
        isLoggedIn: !!auth && !!userInfo,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};