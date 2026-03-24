import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getFavorites, removeFavorite } from '../api/favorites'
import type { Favorite } from '../api/favorites'
import { deleteUser } from '../api/auth'
import { useNavigate } from 'react-router-dom'


function FavoritesPage() {
    const { logout } = useAuth()
    const navigate = useNavigate()
    const [favorites, setFavorites] = useState<Favorite[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const data = await getFavorites()
                setFavorites(data)
            } catch {
                setError('Failed to load favorites.')
            } finally {
                setLoading(false)
            }
        }
        fetchFavorites()
    }, [])

    const handleRemove = async (giveawayId: number) => {
        await removeFavorite(giveawayId)
        setFavorites(prev => prev.filter(f => f.giveaway_id !== giveawayId))
    }

    const handleDeleteAccount = async () => {
        if (!confirm('Are you sure you want to delete your account?')) return
        await deleteUser()
        logout()
        navigate('/login')
    }

    return (
        <div>
            <h1>My Favorites</h1>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && (
                <ul>
                    {favorites.map(f => (
                        <li key={f.id}>
                            Giveaway #{f.giveaway_id}
                            <button onClick={() => handleRemove(f.giveaway_id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={handleDeleteAccount}>Delete account</button>
        </div>
    )
}

export default FavoritesPage