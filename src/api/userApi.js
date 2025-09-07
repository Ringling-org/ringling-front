import { requestWithAuth } from "./apiClient.js";

export const USER_API = Object.freeze({
    INFO: (id) => `/user/${id}`,
});

export async function getUserInfo(id) {
    const result = await requestWithAuth.get(
        USER_API.INFO(id)
    );
    return result.data;
}