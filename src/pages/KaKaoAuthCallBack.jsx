import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Spinner from '../components/CommonSpinner.jsx';

/**
 *
 * 카카오 OAuth 로그인 후 카카오 서버가 넘겨준 인증 코드를 처리하고
 * state 값에 따라 로그인 또는 회원가입 페이지로 이동시키는 컴포넌트.
 */
export default function KaKaoAuthCallBack() {
    const { search } = useLocation();
    const navigate = useNavigate();
    const code = new URLSearchParams(search).get('code');
    const state = new URLSearchParams(search).get('state');

    useEffect(() => {
        if (!code) {
            return navigate('/');
        }

        if (state === 'login' || state === 'signup') {
            return navigate('/' + state,  { state: { code } });
        }
        
        return navigate('/');
    }, []);

    return <Spinner message={"카카오 로그인중입니다."} />;
}