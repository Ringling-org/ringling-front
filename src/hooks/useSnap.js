import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { createSnap, createSnapForGuest, getSnaps, getSnapCounts } from '../api/snapApi.js'

export default function useSnap() {
    const [activeTab, setActiveTab] = useState('all');
    const [snaps, setSnaps] = useState([])
    const [snapCounts, setSnapCounts] = useState({ allCount: 0, myCount: 0 })
    const { userInfo, isLoggedIn, isAuthInit } = useAuth();
    const [listLoading, setListLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [guestSnap, setGuestSnap] = useState(null);
    const [createdSnap, setCreatedSnap] = useState(null); // 회원용 모달 상태
    const lastSnapId = useRef(null);
    const hasMore = useRef(true);

    const loadSnaps = async (isInit = false) => {
        // 이미 로딩 중이거나 더 가져올 데이터가 없으면 중단
        if (!isInit && (listLoading || submitLoading || !hasMore.current)) {
            return;
        }

        setListLoading(true);

        // 탭을 변경했다면 cursor 초기화
        const currentCursor = isInit ? null : lastSnapId.current;
        if (isInit) setSnaps([]);

        try {
            const newSnaps = await getSnaps(activeTab, currentCursor)

            if (newSnaps.length === 0) {
                hasMore.current = false;
                return;
            }

            // 기존 목록 뒤에 추가
            setSnaps(prev => [...prev, ...newSnaps])

            // 다음 조회를 위한 데이터 갱신
            lastSnapId.current = newSnaps[newSnaps.length - 1].id;
            hasMore.current = true;
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
        if (!isAuthInit) return;
        loadSnaps(true);
    }, [activeTab, userInfo, isAuthInit])

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
                loadSnaps(true),
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
        hasMore,
        addSnap,
        guestSnap,
        clearGuestSnap,
        createdSnap,
        clearReminderNotification,
        loadSnaps
    }
}