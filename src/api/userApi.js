const apiUrl = import.meta.env.VITE_API_BASE_URL;

export async function getUserInfo(id) {
    const res = await fetch(`${apiUrl}/user/${id}`)

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`서버 통신 오류: ${res.status} - ${errorText}`);
    }

    return await res.json();
}