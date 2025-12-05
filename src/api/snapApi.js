import { request, requestWithAuth, HEADERS } from './apiClient.js'

export const SNAP_API = Object.freeze({
    GET: '/snap',         // GET /snap
    COUNTS: '/snap/counts', // GET /snap/counts
    CREATE: '/snap',      // POST /snap
    CREATE_GUEST: '/snap/guest', // POST /snap/guest
});

export async function getSnaps(type = 'all') {
    const result = await requestWithAuth.get(
        SNAP_API.GET,
        {
            headers: HEADERS.URL_ENCODED,
            params: {type: type ?? 'all'}
        }
    )
    return result;
}

export async function getSnapCounts() {
    const result = await requestWithAuth.get(
        SNAP_API.COUNTS,
        { headers: HEADERS.URL_ENCODED }
    )
    return result;
}

export async function createSnap(url) {
    const paylod = { url : url };
    const result = await requestWithAuth.post(
        SNAP_API.CREATE,
        paylod,
        { headers: HEADERS.JSON }
    )
    return result;
}

export async function createSnapForGuest(url) {
    const paylod = { url : url };
    const result = await request.post(
        SNAP_API.CREATE_GUEST,
        paylod,
        { headers: HEADERS.JSON }
    )
    return result;
}