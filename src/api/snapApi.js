import { request, requestWithAuth, HEADERS } from './apiClient.js'

export const SNAP_API = Object.freeze({
    GET: '/snap',         // GET /snap
    CREATE: '/snap',      // POST /snap
    CREATE_GUEST: '/snap/guest', // POST /snap/guest
});

export async function getSnaps() {
    const result = await request.get(
        SNAP_API.GET,
        { headers: HEADERS.JSON }
    )
    return result.data;
}

export async function createSnap(url) {
    const params = new URLSearchParams({ url }).toString();

    const result = await requestWithAuth.post(
        SNAP_API.CREATE,
        params,
        { headers: HEADERS.URL_ENCODED }
    )
    return result.data;
}

export async function createSnapForGuest(url) {
    const params = new URLSearchParams({url : url}).toString()

    const result = await request.post(
        SNAP_API.CREATE_GUEST,
        params,
        { headers: HEADERS.URL_ENCODED }
    )
    return await result.data;
}