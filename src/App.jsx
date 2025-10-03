import { useNotificationPermission } from "./hooks/useNotificationPermission.jsx"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SnapListPage from "./pages/SnapListPage";
import KaKaoAuthCallBack from "./pages/KaKaoAuthCallBack.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationPermissionModal from "./components/NotificationPermissionModal.jsx"

function App() {
    const {
        needsPermissionPrompt,
        requestNotificationPermission,
        clearRequestNotificationPermission
    } = useNotificationPermission();

    return (
        <BrowserRouter>
            <NotificationPermissionModal
                isOpen={needsPermissionPrompt}
                onClose={clearRequestNotificationPermission}
                onConfirm={requestNotificationPermission}
            />
            <Routes>
                <Route path="/" element={<SnapListPage/>}/>
                <Route path="/auth/kakao/callback" element={<KaKaoAuthCallBack/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/signup" element={<SignUpPage/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
