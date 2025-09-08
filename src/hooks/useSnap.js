import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { createSnap, createSnapForGuest, getSnaps } from '../api/snapApi.js'

export default function useSnap() {
    const [snaps, setSnaps] = useState([])
    const { isLoggedIn } = useAuth();
    const [listLoading, setListLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [guestSnap, setGuestSnap] = useState(null);

    const loadSnaps  = async () => {
        setListLoading(true)
        const { data } = await getSnaps()
        setSnaps(Array.isArray(data) ? data : []);
        setListLoading(false)
    }

    useEffect(() => { loadSnaps() }, [])

    const addSnap = async (url) => {
        setSubmitLoading(true)
        try {
            if (!isLoggedIn) {
                let result = await createSnapForGuest(url);
                setGuestSnap(result);
                return result;
            }
            await createSnap(url);
            await loadSnaps();
        } finally {
            setSubmitLoading(false)
        }
    };

    const clearGuestSnap = () => {
        setGuestSnap(null);
    };

    return { snaps, listLoading, submitLoading, addSnap, guestSnap, clearGuestSnap }
}