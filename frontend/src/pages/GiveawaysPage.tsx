import { useState, useEffect } from 'react'
import type { Giveaway } from '../types/giveaway'
import { getGiveaways, searchGiveaways } from '../api/giveaways'
import GiveawayList from '../components/GiveawayList'
import SearchBar from '../components/SearchBar'

function GiveawaysPage() {
  const [giveaways, setGiveaways] = useState<Giveaway[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    <div>
      <h1>GimmeLoot</h1>
      <SearchBar value={search} onChange={setSearch} />
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && <GiveawayList giveaways={giveaways} />}
    </div>
  )
}

export default GiveawaysPage