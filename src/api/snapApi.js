const apiUrl = import.meta.env.VITE_API_BASE_URL;

export async function getSnaps() {
    const res = await fetch(`${apiUrl}/snap`)
    const data = await res.json()
    return data
}

export async function createSnap(url) {
    const params = new URLSearchParams({ url: url }).toString()
    console.log(params)
    const res = await fetch(`${apiUrl}/snap`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params
    })
    return await res.json()
}