import { useState } from 'react'
import styles from './SnapForm.module.css'

export default function SnapForm({ onSubmit }) {
    const [url, setUrl] = useState('')

    function handleSubmit(e) {
        e.preventDefault()
        if (!url) return alert('URL을 입력하세요')
        onSubmit(url)
        setUrl('')
    }

    return (
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
    )
}
