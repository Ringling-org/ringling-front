import {useState} from 'react'
import styles from './SnapForm.module.css'

export default function SnapForm({ onSubmit }) {
    const [url, setUrl] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!url.trim()) return alert('URL을 입력하세요')

        if (!isValidUrl(url)) {
            alert('잘못된 URL 형식입니다.');
            return;
        }

        try {
            await onSubmit(url)
        } catch {
            alert("Snap 등록 중 오류가 발생했습니다.")
        } finally {
            setUrl('')
        }
    }

    const isValidUrl = (input) => {
        const url = input.trim();
        return url.startsWith('http://') || url.startsWith('https://');
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
