import { useAuth } from '../context/AuthContext'
import { addFavorite } from '../api/favorites'
import { useState } from 'react'
import type { Giveaway } from '../types/giveaway'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, ExternalLink } from 'lucide-react'

interface GiveawayCardProps {
  giveaway: Giveaway
}


function GiveawayCard({ giveaway }: GiveawayCardProps) {
  const { user } = useAuth()
  const [added, setAdded] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAddFavorite = async () => {
    setLoading(true)
    await addFavorite(giveaway.id)
    setAdded(true)
    setLoading(false)
  }

  return (
    <div className="group flex flex-col rounded-xl border border-border bg-card text-card-foreground overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <div className="relative overflow-hidden aspect-video">
        <img
          src={giveaway.image}
          alt={giveaway.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {giveaway.worth && giveaway.worth !== 'N/A' && (
          <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground font-semibold">
            {giveaway.worth}
          </Badge>
        )}
      </div>

      <div className="flex flex-col gap-3 p-4 flex-1">
        <h2 className="font-semibold text-sm leading-snug line-clamp-2 text-foreground">
          {giveaway.title}
        </h2>

        <div className="flex flex-wrap gap-1">
          {giveaway.platforms.split(',').map(platform => (
            <Badge key={platform.trim()} variant="secondary" className="text-xs">
              {platform.trim()}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2 mt-auto pt-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <a href={giveaway.open_giveaway_url} target='_blank' rel='noreferrer'>
              <ExternalLink className="w-3 h-3 mr-1" />
              Claim
            </a>
          </Button>

          {user && (
            <Button
              size="sm"
              variant={added ? 'secondary' : 'default'}
              onClick={handleAddFavorite}
              disabled={added || loading}
              className="flex-1"
            >
              <Star className={`w-3 h-3 mr-1 ${added ? 'fill-current' : ''}`} />
              {loading ? 'Adding...' : added ? 'Saved!' : 'Save'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default GiveawayCard