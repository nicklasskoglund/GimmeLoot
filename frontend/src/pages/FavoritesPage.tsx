import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getFavorites, removeFavorite } from '../api/favorites'
import type { Favorite } from '../api/favorites'
import { getGiveaway } from '../api/giveaways'
import type { Giveaway } from '../types/giveaway'
import { deleteUser } from '../api/auth'
import { useNavigate } from 'react-router-dom'


function FavoritesPage() {
    const { logout } = useAuth()
    const navigate = useNavigate()
    const [favorites, setFavorites] = useState<Favorite[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [giveaways, setGiveaways] = useState<Record<number, Giveaway>>({})

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const data = await getFavorites()
                setFavorites(data)
                const giveawayData = await Promise.all(
                    data.map(f => getGiveaway(f.giveaway_id))
                )
                const giveawayMap: Record<number, Giveaway> = {}
                giveawayData.forEach(g => { giveawayMap[g.id] = g })
                setGiveaways(giveawayMap)
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
                    {favorites.map(f => {
                        const g = giveaways[f.giveaway_id]
                        return (
                            <li key={f.id}>
                                {g && <img src={g.image} alt={g.title} width={100} />}
                                <span>{g ? g.title : `Giveaway #${f.giveaway_id}`}</span>
                                <button onClick={() => handleRemove(f.giveaway_id)}>Remove</button>
                            </li>
                        )
                    })}
                </ul>
            )}
            <button onClick={handleDeleteAccount}>Delete account</button>
        </div>
    )
}

export default FavoritesPage