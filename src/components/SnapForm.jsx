import {useState} from 'react'
import styles from './SnapForm.module.css'

export default function SnapForm({ onSubmit }) {
    const [url, setUrl] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!url) return alert('URL을 입력하세요')
        try {
            await onSubmit(url)
        } catch  {
            alert("등록중 오류가 발생했습니다.")
        } finally {
            setUrl('')
        }
    }

    return (
        <>
        <form onSubmit={handleSubmit} className={styles.form}>
            <input
                type="text"
                placeholder="등록할 URL 입력"
                value={url}
                onChange={e => setUrl(e.target.value)}
                className={styles.input}
            />
            <button type="submit" className={styles.button}>등록</button>
        </form>
        </>
    )
}
