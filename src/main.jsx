import ReactDOM from 'react-dom/client';
import App from './App.jsx'
import {AuthProvider} from "./context/AuthContext.jsx";
import Modal from 'react-modal';
import './index.css'

Modal.setAppElement("#root");

if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((reg) => console.log("등록 성공:", reg))
        .catch((err) => console.error("등록 실패:", err));
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <App/>
    </AuthProvider>
);
