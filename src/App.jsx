import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SnapListPage from "./pages/SnapListPage";

function App() {

  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<SnapListPage />} />
          </Routes>
      </BrowserRouter>
  )
}

export default App