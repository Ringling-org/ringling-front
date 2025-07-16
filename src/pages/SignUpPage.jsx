import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getKakaoAuthUrl, signUp } from '../api/authApi.js';
import styles from './SignUpPage.module.css';

export default function SignUpPage() {
    const location = useLocation();
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');
    const code = location.state?.code;

    useEffect(() => {
        if (!code) {
            window.location.href = getKakaoAuthUrl('signup');
            return;
        }

    }, []);

    const handleSubmit = async (e) => { // async 추가
        e.preventDefault();
        setError('');

        if (!nickname.trim()) {
            setError('닉네임을 입력해주세요.');
            return;
        }

        try {
            await signUp({ code, nickname }); // await 추가

            alert('✅ 회원가입 성공! 로그인 페이지로 이동합니다.');
            window.location.href = getKakaoAuthUrl('login');
            return;
        } catch (err) {
            setError(`회원가입 중 오류가 발생했습니다: ${err.message}`);
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>추가 정보 입력</h1>
            <p className={styles.subtitle}>서비스 이용을 위해 닉네임을 설정해주세요.</p>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="nickname" className={styles.label}>닉네임</label>
                    <input
                        type="text"
                        id="nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className={styles.input}
                        placeholder="사용하실 닉네임을 입력하세요"
                        required
                    />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <button type="submit" className={styles.button}>
                    가입 완료
                </button>
            </form>
        </div>
    );
};