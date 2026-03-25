import { ThemeProvider } from './context/ThemeContext'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import GiveawaysPage from './pages/GiveawaysPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import FavoritesPage from './pages/FavoritesPage'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import AccountPage from './pages/AccountPage'


function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path='/' element={<GiveawaysPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/favorites' element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            } />
            <Route path='/account' element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  )
}

export default App