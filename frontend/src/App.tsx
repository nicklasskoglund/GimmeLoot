import { Routes, Route } from 'react-router-dom'
import GiveawaysPage from './pages/GiveawaysPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import FavoritesPage from './pages/FavoritesPage'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<GiveawaysPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/favorites' element={
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default App