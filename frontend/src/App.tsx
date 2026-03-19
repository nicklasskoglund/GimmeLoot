import { Routes, Route } from 'react-router-dom'
import GiveawaysPage from './pages/GiveawaysPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<GiveawaysPage />} />
    </Routes>
  )
}

export default App