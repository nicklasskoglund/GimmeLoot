import { useState, useEffect } from 'react'
import type { Giveaway } from '../types/giveaway'
import { getGiveaways, searchGiveaways } from '../api/giveaways'
import GiveawayList from '../components/GiveawayList'
import SearchBar from '../components/SearchBar'
import { useAuth } from '../context/AuthContext'
import { getFavorites } from '../api/favorites'


function GiveawaysPage() {
  const [giveaways, setGiveaways] = useState<Giveaway[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const [savedIds, setSavedIds] = useState<number[]>([])

  useEffect(() => {
    if (!user) return
    getFavorites().then(favs => setSavedIds(favs.map(f => f.giveaway_id)))
  }, [user])

  useEffect(() => {
    const fetchGiveaways = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = search
          ? await searchGiveaways(search)
          : await getGiveaways()
        setGiveaways(data)
      } catch {
        setError('Failed to load giveaways.')
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(fetchGiveaways, 400)
    return () => clearTimeout(debounce)
  }, [search])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Free Giveaways
        </h1>
        <p className="text-muted-foreground text-sm">
          Claim free games and loot before they expire
        </p>
      </div>

      <SearchBar value={search} onChange={setSearch} />

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card overflow-hidden animate-pulse">
              <div className="aspect-video bg-muted" />
              <div className="p-4 flex flex-col gap-3">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="h-8 bg-muted rounded mt-2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <p className="text-lg font-medium text-destructive">{error}</p>
        </div>
      )}

      {!loading && !error && <GiveawayList giveaways={giveaways} savedIds={savedIds} />}
    </div>
  )
}

export default GiveawaysPage