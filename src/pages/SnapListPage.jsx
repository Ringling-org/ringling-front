import SnapForm from '../components/SnapForm.jsx'
import SnapList from '../components/SnapList.jsx'
import useSnap from "../hooks/useSnap.js"
import styles from './SnapListPage.module.css'

export default function SnapListPage() {

    const { snaps, loading, addSnap } = useSnap()

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <SnapForm onSubmit={addSnap}/>
            </div>
            <SnapList snaps={snaps} loading={loading} />
        </div>
    )
}