import { useAuth } from "../context/AuthContext.jsx"
import styles from './Header.module.css';
import {getKakaoAuthUrl} from "../api/authApi.js";

export default function Header() {
    const { userInfo, isLoggedIn, logout } = useAuth();

    const handleLogin = () => {
        window.location.href = getKakaoAuthUrl();
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div className={styles.header}>
            <div className={styles.headerInfo}>
                <p className={styles.title}>스냅 리스트</p>
                {userInfo?.nickname && (
                    <p className={styles.subtitle}>
                        {userInfo.nickname}님 환영합니다
                    </p>
                )}
            </div>
            <div className={styles.controlPanel}>
                {isLoggedIn
                    ? <button onClick={handleLogout} className={styles.logoutButton}>로그아웃</button>
                    : <button onClick={handleLogin} className={styles.loginButton}>로그인</button>
                }
            </div>
        </div>
    )
}