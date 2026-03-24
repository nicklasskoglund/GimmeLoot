import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav>
            <Link to='/'>Home</Link>
            {user ? (
                <>
                    <Link to='/favorites'>My Favorites</Link>
                    <Link to='/account'>Account</Link>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                    <Link to='/login'>Login</Link>
                    <Link to='/register'>Register</Link>
                </>
            )}
        </nav>
    )
}

export default Navbar