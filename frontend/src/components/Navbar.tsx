import { Link, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/useTheme'
import { Button } from '@/components/ui/button'
import { Sun, Moon } from 'lucide-react'

function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        <Link to='/' className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img
            src="/gimmeloot-logo.png"
            alt="GimmeLoot"
            className="w-7 h-7 object-contain"
            style={{ filter: 'drop-shadow(0 0 1px #000) drop-shadow(0 0 1px #000) drop-shadow(0 0 1px #000) drop-shadow(0 0 1px #000)' }}
          />
          <span
            className="gl-gradient-text font-bold text-xl"
            style={{ filter: 'drop-shadow(0 0 1px #000) drop-shadow(0 0 1px #000) drop-shadow(0 0 1px #000) drop-shadow(0 0 1px #000)' }}
          >
            GimmeLoot
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground px-2 hidden sm:block">
                @{user.username}
              </span>
              <Button variant="ghost" asChild>
                <Link to='/favorites'>My Favorites</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to='/account'>Account</Link>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to='/login'>Login</Link>
              </Button>
              <Button asChild>
                <Link to='/register'>Register</Link>
              </Button>
            </>
          )}

          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>

      </div>
    </header>
  )
}

export default Navbar