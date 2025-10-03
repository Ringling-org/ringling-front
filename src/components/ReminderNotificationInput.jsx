import { useState } from "react";
import Modal from "react-modal";
import styles from './ReminderNotificationInput.module.css';
import {IoClose} from "react-icons/io5";
import { BsClock } from "react-icons/bs";


const getTomorrowAt9AM = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const kstString = tomorrow.toLocaleString('sv-SE', {
        timeZone: 'Asia/Seoul',
    });

    const datePart = kstString.split(' ')[0];
    return `${datePart}T09:00`;
};


export default function ReminderNotificationInput({ isOpen, onClose, onConfirm }) {
    const [selectedDateTime, setSelectedDateTime] = useState(getTomorrowAt9AM());

    return (
        <>
            <Modal
                isOpen={isOpen}
                shouldCloseOnOverlayClick={false}
                shouldCloseOnEsc={false}
                overlayClassName={styles.modalOverlay}
                className={styles.modalContent}
                contentLabel="알림 시간 설정"
            >
                <button
                    onClick={onClose}
                    className={styles.closeButton}
                >
                    <IoClose className={styles.closeIcon}/>
                </button>

                <div className={styles.iconContainer}>
                    <div className={styles.iconCircle}>
                        <BsClock className={styles.iconClock}/>
                    </div>
                </div>

                <h2 className={styles.modalTitle}>알림 시간 설정</h2>
                <p className={styles.modalDescription}>
                    알림을 받을 날짜와 시간을 선택해주세요
                </p>

                <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>
                        날짜 및 시간 선택
                    </label>
                    <input
                        type="datetime-local"
                        value={selectedDateTime}
                        onChange={(e) => setSelectedDateTime(e.target.value)}
                        className={styles.inputField}
                    />
                    <p className={styles.inputHelpText}>
                        원하는 날짜와 시간을 선택해주세요
                    </p>
                </div>

                <div className={styles.buttonContainer}>
                    <button
                        onClick={onClose}
                        className={`${styles.actionButton} ${styles.cancelButton}`}
                    >
                        취소
                    </button>
                    <button
                        onClick={() => onConfirm(selectedDateTime)}
                        className={`${styles.actionButton} ${styles.confirmButton}`}
                    >
                        알림 설정하기
                    </button>
                </div>
            </Modal>
        </>
    );
}
