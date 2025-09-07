import { request, HEADERS } from './apiClient.js'

const {
    VITE_APP_BASE_URL,
    VITE_KAKAO_REST_API_KEY,
    VITE_KAKAO_LOGIN_REDIRECT_PATH,
    VITE_KAKAO_AUTH_URL
} = import.meta.env

export const AUTH_API = Object.freeze({
    LOGIN_KAKAO: '/auth/login/kakao',
    LOGOUT_KAKAO: '/auth/logout/kakao',
    SIGNUP_KAKAO: '/auth/signup/kakao',
});

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
    const result = await request.post(
        AUTH_API.LOGIN_KAKAO,
        new URLSearchParams({ code }),
        { headers: HEADERS.URL_ENCODED }
    );

    return result.data;
}

/**
 * 해당 토큰을 만료하기위해 서버로 로그아웃을 요청합니다.
 * @param accessToken
 * @returns {Promise<any>}
 */
export async function logoutWithKakao(accessToken) {
    const result = await request.post(
        AUTH_API.LOGOUT_KAKAO,
        new URLSearchParams({ accessToken }),
        { headers: HEADERS.URL_ENCODED }
    )

    return result.data;
}

/**
 * 회원가입을 요청합니다.
 * @param {object} signupInfo - 회원가입 정보 ( { nickname })
 * @returns {Promise<object>} - 백엔드 서버가 반환하는 JSON 객체
 */
export async function signUp(signupInfo) {
    const result = await request.post(
        AUTH_API.SIGNUP_KAKAO,
        new URLSearchParams(signupInfo),
        { headers: HEADERS.URL_ENCODED }
    )

    return await result.data;
}
