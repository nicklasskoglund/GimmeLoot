import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getFavorites, removeFavorite } from '../api/favorites'
import type { Favorite } from '../api/favorites'
import { getGiveaway } from '../api/giveaways'
import type { Giveaway } from '../types/giveaway'
import { deleteUser } from '../api/auth'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Trash2, ExternalLink, Star } from 'lucide-react'

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
        const giveawayData = await Promise.all(data.map(f => getGiveaway(f.giveaway_id)))
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Star className="w-7 h-7 text-primary" />
          My Favorites
        </h1>
        <p className="text-muted-foreground text-sm">Your saved giveaways</p>
      </div>

      {loading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4 flex gap-4 animate-pulse">
              <div className="w-24 h-16 rounded-lg bg-muted shrink-0" />
              <div className="flex-1 flex flex-col gap-2 justify-center">
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="h-3 bg-muted rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-destructive text-sm">{error}</p>
      )}

      {!loading && !error && favorites.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <Star className="w-10 h-10 mb-4 opacity-30" />
          <p className="text-lg font-medium">No favorites yet</p>
          <p className="text-sm mt-1">Browse giveaways and save the ones you like</p>
          <Button variant="outline" className="mt-6" onClick={() => navigate('/')}>
            Browse giveaways
          </Button>
        </div>
      )}

      {!loading && !error && favorites.length > 0 && (
        <div className="flex flex-col gap-3">
          {favorites.map(f => {
            const g = giveaways[f.giveaway_id]
            return (
              <div key={f.id} className="group rounded-xl border border-border bg-card p-4 flex gap-4 items-center hover:border-primary/50 transition-colors">
                {g && (
                  <img
                    src={g.image}
                    alt={g.title}
                    className="w-24 h-16 object-cover rounded-lg shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">
                    {g ? g.title : `Giveaway #${f.giveaway_id}`}
                  </p>
                  {g && (
                    <p className="text-xs text-muted-foreground mt-0.5">{g.platforms}</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  {g && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={g.open_giveaway_url} target="_blank" rel="noreferrer">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Claim
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(f.giveaway_id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="border-t border-border pt-6 mt-4">
        <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleDeleteAccount}>
          Delete account
        </Button>
      </div>
    </div>
  )
}

export default FavoritesPage