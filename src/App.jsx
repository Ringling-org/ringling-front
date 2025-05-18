import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Placeholder from './components/Placeholder.jsx'

function App() {

  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Placeholder />} />
          </Routes>
      </BrowserRouter>
  )
}

export default App
