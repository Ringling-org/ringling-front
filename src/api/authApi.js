const {
    VITE_API_BASE_URL,
    VITE_APP_BASE_URL,
    VITE_KAKAO_REST_API_KEY,
    VITE_KAKAO_LOGIN_REDIRECT_PATH,
    VITE_KAKAO_AUTH_URL
} = import.meta.env

/**
 * 카카오 로그인 페이지 URL 생성
 */
export function getKakaoAuthUrl(state = 'login') {
    const params = new URLSearchParams({
        client_id: VITE_KAKAO_REST_API_KEY,
        redirect_uri: `${VITE_APP_BASE_URL}${VITE_KAKAO_LOGIN_REDIRECT_PATH}`,
        response_type: 'code',
        ...(state && { state }),
    });

    return `${VITE_KAKAO_AUTH_URL}?${params.toString()}`;
}

/**
 * 카카오 인가 코드를 내부 벡엔드 서버로 전송하고, 서버의 응답을 반환합니다.
 * @param {string} code - 카카오로부터 받은 인가 코드
 * @returns {Promise<object>} - 백엔드 서버가 반환하는 JSON 객체
 */
export async function loginWithKakao(code) {
    const res = await fetch(`${VITE_API_BASE_URL}/auth/login/kakao`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ code }),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`서버 통신 오류: ${res.status} - ${errorText}`);
    }

    return await res.json();
}

/**
 * 해당 토큰을 만료하기위해 서버로 로그아웃을 요청합니다.
 * @param accessToken
 * @returns {Promise<any>}
 */
export async function logoutWithKakao(accessToken) {
    const res = await fetch(`${VITE_API_BASE_URL}/auth/logout/kakao`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ accessToken }),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`서버 통신 오류: ${res.status} - ${errorText}`);
    }
    return await res.json();
}

/**
 * 회원가입을 요청합니다.
 * @param {object} signupInfo - 회원가입 정보 ( { nickname })
 * @returns {Promise<object>} - 백엔드 서버가 반환하는 JSON 객체
 */
export async function signUp(signupInfo) {
    const res = await fetch(`${VITE_API_BASE_URL}/auth/signup/kakao`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(signupInfo),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: '서버 응답을 처리할 수 없습니다.' }));
        throw new Error(errorData.message || `서버 통신 오류: ${res.status}`);
    }

    return await res.json();
}
