let accessToken = null;
let refreshToken = null;

export const storeAccessToken = (token) => {
    accessToken = token;
}

export const getAccessToken = () => {
    return accessToken;
}

export const storeRefreshToken = (token) => {
    refreshToken = token;
}

export const getRefreshToken = () => {
    return refreshToken;
}