import React from "react";
import Modal from "react-modal";
import { IoClose, IoNotificationsOutline } from "react-icons/io5";
import styles from "./NotificationPermissionModal.module.css";

export default function NotificationPermissionModal({ isOpen, onClose, onConfirm }) {

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            shouldCloseOnOverlayClick={false}
            shouldCloseOnEsc={false}
            className={styles.modalContent}
            overlayClassName={styles.modalOverlay}
        >
            <button
                onClick={onClose}
                className={styles.closeButton}
            >
                <IoClose className={styles.closeIcon} />
            </button>

            <div className={styles.iconContainer}>
                <div className={styles.iconCircle}>
                    <IoNotificationsOutline className={styles.bellIcon} />
                </div>
            </div>

            <h2 className={styles.modalTitle}>알림 권한 허용</h2>
            <p className={styles.modalDescription}>
                서비스에서 알림을 보낼 수 있도록
                <br/>
                알림 권한을 허용해주세요
            </p>

            <div className={styles.permissionInfo}>
                <div className={styles.infoTitle}>알림을 통해 받을 수 있는 정보</div>
                <ul className={styles.infoList}>
                    <li className={styles.infoItem}>설정한 시간에 게시글 알림</li>
                </ul>
            </div>

            <div className={styles.buttonContainer}>
                <button className={`${styles.button} ${styles.buttonCancel}`} onClick={onClose}>
                    나중에
                </button>
                <button className={`${styles.button} ${styles.buttonConfirm}`} onClick={onConfirm}>
                    알림 허용
                </button>
            </div>
        </Modal>
    );
}
