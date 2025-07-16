import { createContext, useState, useEffect } from 'react';
import { decodeToken } from "../utils/JwtUtils.js";
import { logoutWithKakao } from "../api/authApi.js";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
    const [user, setUser] = useState(null);

    const saveAccessToken = (token) => localStorage.setItem('accessToken', token);
    const saveRefreshToken = (token) => localStorage.setItem('refreshToken', token);
    const removeAccessToken = () => localStorage.removeItem('accessToken');
    const removeRefreshToken = () => localStorage.removeItem('refreshToken');

    useEffect(() => {
        if (accessToken) {
            try {
                const decodedUser = decodeToken(accessToken);
                setUser(decodedUser);
                console.log("사용자 정보가 업데이트되었습니다:", decodedUser); // Debugging log
            } catch (error) {
                console.error("토큰 오류, 세션을 초기화합니다:", error);
                setAccessToken(null);
                setUser(null);
                removeAccessToken();
                removeRefreshToken();
            }
        } else {
            setUser(null);
        }
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
        user,
        accessToken,
        isLoggedIn: !!user,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};