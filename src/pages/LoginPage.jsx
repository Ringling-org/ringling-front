import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginWithKakao } from '../api/authApi.js';
import { useAuth } from "../context/AuthContext.jsx";
import Spinner from '../components/CommonSpinner.jsx';

export default function LoginPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const code = location.state?.code;
    const { login } = useAuth();
    
    useEffect(() => {
        if (!code) {
            return navigate("/");
        }

        const doLogin = async () => {
            try {
                const { code: responseCode, data } = await loginWithKakao(code);

                if (responseCode === "SUCCESS") {
                    login({ accessToken: data.accessToken, refreshToken: data.refreshToken });
                    return navigate('/');
                } else if (responseCode === "AU001") {
                    return navigate('/signup');
                } else {
                    alert("알 수 없는 응답코드로 로그인에 실패했습니다.");
                    return navigate('/');
                }
            } catch {
                alert("로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");
                return navigate('/');
            }
        };

        doLogin();
    }, [code, login, navigate]);

    return (
        <Spinner message={"로그인 중입니다...!!"}/>
    )
}