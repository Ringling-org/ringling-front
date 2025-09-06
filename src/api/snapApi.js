import { apiClient } from './apiClient.js'

const apiUrl = import.meta.env.VITE_API_BASE_URL;

export async function getSnaps() {

    const res = await apiClient(`/snap`)
    return res;
}

export async function createSnap(url, accessToken) {
    const params = new URLSearchParams({ url }).toString();

    return apiClient("/snap", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
    }, accessToken);
}

export async function createSnapForGuest(url) {
    const params = new URLSearchParams({url : url}).toString()

    const res = await fetch(`${apiUrl}/snap/guest`, {
       method: 'POST',
       headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
       },
    body: params
    })
    return await res.json()
}