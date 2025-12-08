import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { createSnap, createSnapForGuest, getSnaps, getSnapCounts } from '../api/snapApi.js'

export default function useSnap() {
    const [activeTab, setActiveTab] = useState('all');
    const [snaps, setSnaps] = useState([])
    const [snapCounts, setSnapCounts] = useState({ allCount : 0, myCount : 0})
    const { userInfo, isLoggedIn } = useAuth();
    const [listLoading, setListLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [guestSnap, setGuestSnap] = useState(null);
    const [createdSnap, setCreatedSnap] = useState(null); // 회원용 모달 상태

    const loadSnaps = async (selectedType = 'all') => {
        setListLoading(true)
        try {
            const snaps = await getSnaps(selectedType)
            setSnaps(Array.isArray(snaps) ? snaps : []);
        } catch (error) {
            console.error("Failed to load snaps:", error);
            setSnaps([]);
        } finally {
            setListLoading(false)
        }
    }

    const loadCounts = async () => {
        try {
            const count = await getSnapCounts();
            setSnapCounts(count);
        } catch (error) {
            console.log("Failed to load counts:", error);
        }
    }

    const handleTabChange = (newTab) => {
        if (newTab === activeTab) return; // 같은 탭이면 무시
        setActiveTab(newTab);
    };

    useEffect(() => {
        loadSnaps(activeTab)
    }, [activeTab, userInfo])

    useEffect(() => {
        loadCounts()
    }, [userInfo])

    const addSnap = async (url) => {
        setSubmitLoading(true)
        try {
            if (!isLoggedIn) {
                const guestSnap = await createSnapForGuest(url);
                setGuestSnap(guestSnap);
                return guestSnap;
            }
            const newSnap = await createSnap(url);
            setCreatedSnap(newSnap);

            await Promise.all([
                loadSnaps(activeTab),
                loadCounts()
            ]);
        } finally {
            setSubmitLoading(false)
        }
    };

    const clearGuestSnap = () => {
        setGuestSnap(null);
    };

    const clearReminderNotification = () => {
        setCreatedSnap(null);
    }

    return {
        snaps,
        snapCounts,
        activeTab,
        setActiveTab: handleTabChange,
        listLoading,
        submitLoading,
        addSnap,
        guestSnap,
        clearGuestSnap,
        createdSnap,
        clearReminderNotification,
        loadSnaps
    }
}