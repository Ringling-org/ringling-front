import SnapForm from '../components/SnapForm.jsx';
import SnapList from '../components/SnapList.jsx';
import useSnap from "../hooks/useSnap.js";
import styles from './SnapListPage.module.css';
import { getKakaoAuthUrl } from '../api/authApi';
import { useAuth } from "../hooks/useAuth.js";

export default function SnapListPage() {
    const { snaps, loading, addSnap } = useSnap();
    const { userInfo, isLoggedIn, logout } = useAuth();

    const handleLogin = () => {
        window.location.href = getKakaoAuthUrl();
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                {isLoggedIn ? (
                    <button onClick={handleLogout} className={styles.logoutButton}>
                        로그아웃
                    </button>
                ) : (
                    <button onClick={handleLogin} className={styles.loginButton}>
                        로그인
                    </button>
                )}
            </div>

            <div className={styles.formWrapper}>
                <SnapForm onSubmit={addSnap}/>
            </div>
            <SnapList snaps={snaps} loading={loading} />
        </div>
    );
}
