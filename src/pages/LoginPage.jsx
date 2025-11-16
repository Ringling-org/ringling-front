import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginWithKakao } from '../api/authApi.js';
import { useAuth } from "../context/AuthContext.jsx";
import Spinner from '../components/CommonSpinner.jsx';
import {ApplicationError} from "../api/ApplicationError.js";

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
                const accessToken = await loginWithKakao(code);
                login(accessToken);
                return navigate('/');
            } catch (error) {
                if (error instanceof ApplicationError) {
                    if (error.code === 'AU001') {
                        return navigate('/signup');
                    }

                    alert("알 수 없는 응답코드로 로그인에 실패했습니다.");
                    return navigate('/');
                }

                console.error("비정상적인 에러 발생:", error);
                alert("로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");
                return navigate('/');
            }
        };

        doLogin();
    }, []);

    return (
        <Spinner message={"로그인 중입니다...!!"}/>
    )
}