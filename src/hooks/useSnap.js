import { useState, useEffect } from 'react'
import { getSnaps, createSnap } from '../api/snapApi.js'

export default function useSnap() {
    const [snaps, setSnaps] = useState([])
    const [loading, setLoading] = useState(true)


    const loadSnaps  = async () => {
        setLoading(true)
        const data = await getSnaps()
        setSnaps(data)
        setLoading(false)
    }

    useEffect(() => { loadSnaps() }, [])

    const addSnap = async (url) => {
        await createSnap(url)
        await loadSnaps()
    }

    return { snaps, loading, addSnap }
}