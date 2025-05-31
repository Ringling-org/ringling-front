import styles from './SnapCard.module.css';

const statusColors = {
    COMPLETED: "#0A8754",   // 초록
    PROCESSING: "#FFA500",  // 주황
    PENDING: "#1E90FF",     // 파랑
    FAILED: "#d32f2f",      // 빨강
    DEFAULT: "#888"         // 회색
};

const statusMessages = {
    PENDING:    snap => "요약 대기 중입니다.",
    PROCESSING: snap => "요약 처리 중입니다...",
    COMPLETED:  snap => snap.summaryTitle || "요약이 완료되었습니다.",
    FAILED:     snap => "요약에 실패했습니다.",
    DEFAULT:    snap => "요약이 진행중입니다."
};

function getStatusMessage(snap) {
    const fn = statusMessages[snap.summaryStatus] || statusMessages.DEFAULT;
    return fn(snap);
}

function getStatusColor(snap) {
    return statusColors[snap.summaryStatus] || statusColors.DEFAULT;
}

export default function SnapCard({ snap }) {
    const color = getStatusColor(snap);
    const message = getStatusMessage(snap);

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div
                    className={styles["status-dot"]}
                    style={{ background: color }}
                />
                <h3 className={styles.title}>{message}</h3>
            </div>
            <a
                className={styles.url}
                href={snap.url}
                target="_blank"
                rel="noopener noreferrer"
            >
                {snap.url}
            </a>
            <div className={styles["status-row"]}>
                <span className={styles["status-label"]}>상태: </span>
                <span
                    className={styles["status-value"]}
                    style={{ color: color }}
                >
                    {snap.summaryStatus}
                    </span>
            </div>
            <div className={styles.dates}>
                <span>등록: {snap.createdAt?.slice(0, 16).replace("T", " ")}</span>
                <span>수정: {snap.updatedAt?.slice(0, 16).replace("T", " ")}</span>
            </div>
        </div>
    );
}
