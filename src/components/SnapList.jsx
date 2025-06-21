import SnapCard from './SnapCard.jsx'
import styles from "./SnapList.module.css"

export default function SnapList({ snaps, loading }) {
    if (loading) return <div>로딩중...</div>
    return (
        <div className={styles.centerWrapper}>
            {snaps.map(snap => (
                <SnapCard key={snap.id} snap={snap}/>
            ))}
        </div>
    )
}