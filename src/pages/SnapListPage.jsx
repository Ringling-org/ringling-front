import Header from '../components/Header.jsx'
import SnapForm from '../components/SnapForm.jsx';
import SnapList from '../components/SnapList.jsx';
import SnapCard from '../components/SnapCard.jsx'
import useSnap from "../hooks/useSnap.js";
import styles from './SnapListPage.module.css';
import Spinner from "../components/CommonSpinner.jsx";
import NotificationInput from "../components/ReminderNotificationInput.jsx";
import { createReminderNotification } from '../api/notificationApi.js'
import Modal from "react-modal"

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
        snaps, listLoading, submitLoading, addSnap,
        guestSnap, clearGuestSnap,
        createdSnap, clearReminderNotification
    } = useSnap();

    const handleNotificationConfirm = async (selectedDateTimeFromModal) => {
        const payload = {
            snapId: createdSnap.id,
            notificationTime: selectedDateTimeFromModal
        };

        await createReminderNotification(payload);
        alert("알림이 등록되었습니다.")
        clearReminderNotification()
    }

    return (
        <>
            {(listLoading || submitLoading) && <Spinner />}
            <div className={styles.container}>
                <Header/>
                <div className={styles.formWrapper}>
                    <SnapForm onSubmit={addSnap}/>
                </div>
                <SnapList snaps={snaps} loading={listLoading}/>
                <Modal
                    isOpen={Boolean(guestSnap)}
                    onRequestClose={clearGuestSnap}
                    style={SNAP_MODAL_STYLE}
                    contentLabel="Snap Result"
                >
                    {guestSnap && <SnapCard snap={guestSnap}/>}
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
