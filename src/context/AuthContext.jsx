import { createContext, useContext, useState, useEffect } from "react";
import { decodeToken } from "../utils/JwtUtils.js";
import { logoutWithKakao } from "../api/authApi.js";
import { getUserInfo } from "../api/userApi.js";
import { storeAccessToken, storeRefreshToken } from "./authStore.js";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        if (!accessToken) {
            storeAccessToken(null);
            setUserInfo(null);
            return;
        }
        storeAccessToken(accessToken);
        initUserInfo(accessToken);
    }, [accessToken]);

    const login = ({accessToken, refreshToken}) => {
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        storeRefreshToken(refreshToken);
    }

    const logout = async () => {
        if (accessToken) {
            try {
                await logoutWithKakao(accessToken);
                setAccessToken(null);
                setRefreshToken(null);
                alert('✅ 로그아웃 되었습니다!');
            } catch {
                console.log("로그아웃실패")
            }
        }
    }

    const initUserInfo = async (accessToken) => {
        let decodedUser = decodeToken(accessToken);
        const userInfo = await getUserInfo(decodedUser.sub);
        setUserInfo(userInfo.data);
    }

    return (
        <AuthContext.Provider
            value={{
                accessToken, refreshToken, userInfo, isLoggedIn: !!userInfo,
                login, logout
            }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);