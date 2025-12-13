import Header from '../components/Header.jsx'
import SnapForm from '../components/SnapForm.jsx';
import { Virtuoso } from 'react-virtuoso'
import SnapCard from '../components/SnapCard.jsx'
import useSnap from "../hooks/useSnap.js";
import styles from './SnapListPage.module.css';
import Spinner from "../components/CommonSpinner.jsx";
import NotificationInput from "../components/ReminderNotificationInput.jsx";
import { createReminderNotification } from '../api/notificationApi.js'
import Modal from "react-modal"
import { issueFcmToken } from "../utils/firebase.js";

const SNAP_MODAL_STYLE = {
    content: {
        margin: "auto",
        borderRadius: "16px",
        padding: "0",
        inset: "25vh auto auto auto",
        backgroundColor: "transparent",
        boxShadow: "none",
        border: "none",
    },
    overlay: {
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(3px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
    },
};

export default function SnapListPage() {
    const {
        snaps,
        snapCounts,
        activeTab,
        setActiveTab,
        listLoading,
        submitLoading,
        addSnap,
        guestSnap, clearGuestSnap,
        createdSnap, clearReminderNotification,
    } = useSnap();


    const handleNotificationConfirm = async (selectedDateTime) => {
        try {
            let permission = Notification.permission;
            if (permission === "default") {
                permission = await Notification.requestPermission();
            }
            if (permission === "granted") {
                console.log("✅ 알림 권한 허용됨");
                await issueFcmToken();
                await registerReminder(selectedDateTime);
            } else {
                alert("알림을 설정할 수 없어요.\n브라우저 설정에서 알림을 허용해주세요.");
            }
        } catch (error) {
            console.error("알림 권한 요청 실패:", error);
            alert("알림 설정 중 오류가 발생했습니다.");
        }
    };

    const registerReminder = async (selectedDateTimeFromModal) => {
        const payload = {
            snapId: createdSnap.id,
            notificationTime: selectedDateTimeFromModal,
        };
        await createReminderNotification(payload);
        alert("알림이 등록되었습니다!");
        clearReminderNotification();
    };

    return (
        <>
            {(listLoading || submitLoading) && <Spinner />}
            <div className={styles.container}>
                <Header />

                <div className={styles.listContainer}>
                    <SnapForm onSubmit={addSnap} />
                    <div className={styles.tabSwitch}>
                        <button
                            type="button"
                            className={`${styles.tabBtn} ${activeTab === 'my' ? styles.active : ''}`}
                            onClick={() => setActiveTab('my')}
                        >
                            내 Snap 목록
                            <span className={styles.countBadge}>
                                {snapCounts.myCount}
                            </span>
                        </button>

                        <button
                            type="button"
                            className={`${styles.tabBtn} ${activeTab === 'all' ? styles.active : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            전체 Snap 목록
                            <span className={styles.countBadge}>
                                {snapCounts.allCount}
                            </span>
                        </button>
                    </div>

                    <Virtuoso
                        useWindowScroll
                        data={snaps}
                        itemContent={(_, item) => (
                            <div key={item.id} className={styles.snapItemWrapper}>
                                <SnapCard key={item.id} snap={item}/>
                            </div>
                        )}
                    />
                </div>
                <Modal
                    isOpen={Boolean(guestSnap)}
                    onRequestClose={clearGuestSnap}
                    style={SNAP_MODAL_STYLE}
                    contentLabel="Snap Result"
                >
                    {guestSnap && <SnapCard snap={guestSnap} />}
                </Modal>

                {createdSnap &&
                    <NotificationInput
                        isOpen={Boolean(createdSnap)}
                        onClose={clearReminderNotification}
                        onConfirm={handleNotificationConfirm}
                    />
                }

            </div>
        </>
    );
}
