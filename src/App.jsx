import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SnapListPage from "./pages/SnapListPage";
import KaKaoAuthCallBack from "./pages/KaKaoAuthCallBack.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { AuthProvider } from './context/AuthContext';

function App() {

  return (
      <AuthProvider>
          <BrowserRouter>
              <Routes>
                  <Route path="/" element={<SnapListPage />} />
                  <Route path="/auth/kakao/callback" element={<KaKaoAuthCallBack />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
              </Routes>
          </BrowserRouter>
      </AuthProvider>
  )
}

export default App
