import { useAuth } from '../context/AuthContext'
import { addFavorite, removeFavorite } from '../api/favorites'
import { useState } from 'react'
import type { Giveaway } from '../types/giveaway'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, ExternalLink, Loader2, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'

interface GiveawayCardProps {
  giveaway: Giveaway
  initialSaved?: boolean
}

function formatEndDate(dateStr: string): string | null {
  if (!dateStr || dateStr === 'N/A') return null
  const end = new Date(dateStr)
  const now = new Date()
  const diffMs = end.getTime() - now.getTime()
  if (diffMs <= 0) return 'Expired'
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 1) return 'Ends tomorrow'
  if (diffDays <= 7) return `Ends in ${diffDays} days`
  return `Ends ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
}

function GiveawayCard({ giveaway, initialSaved = false }: GiveawayCardProps) {
  const [added, setAdded] = useState(initialSaved)
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const endDateLabel = formatEndDate(giveaway.end_date)
  const isExpired = endDateLabel === 'Expired'

  const handleToggleFavorite = async () => {
    setLoading(true)
    try {
      if (added) {
        await removeFavorite(giveaway.id)
        setAdded(false)
        toast.success('Removed from favorites.')
      } else {
        await addFavorite(giveaway.id)
        setAdded(true)
        toast.success('Saved to favorites!')
      }
    } catch {
      toast.error('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card text-card-foreground overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">

      <Link to={`/giveaways/${giveaway.id}`} className="group">
        <div className="relative overflow-hidden aspect-video">
          <img
            src={giveaway.image}
            alt={giveaway.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            style={isExpired ? { filter: 'grayscale(50%)', opacity: 0.2 } : undefined}
          />
          {endDateLabel && (
            <Badge
              className="absolute top-2 right-2 font-semibold flex items-center gap-1"
              style={isExpired
                ? { backgroundColor: 'var(--card)', color: 'var(--primary)', border: '1px solid var(--primary)' }
                : { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }
              }
            >
              <Clock className="w-3 h-3" />
              {endDateLabel}
            </Badge>
          )}
        </div>
      </Link>

      <div className="flex flex-col gap-3 p-4 flex-1">
        <Link to={`/giveaways/${giveaway.id}`} className="hover:text-primary transition-colors">
          <h2 className="font-semibold text-sm leading-snug line-clamp-2 text-foreground">
            {giveaway.title}
          </h2>
        </Link>

        {giveaway.worth && giveaway.worth !== 'N/A' && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs text-green-500 border-green-500/30">Free</Badge>
            <span className="text-xs text-muted-foreground line-through">{giveaway.worth}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          {giveaway.platforms.split(',').map(platform => (
            <Badge key={platform.trim()} variant="secondary" className="text-xs">
              {platform.trim()}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2 mt-auto pt-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link to={`/giveaways/${giveaway.id}`}>
              <ExternalLink className="w-3 h-3 mr-1" />
              Claim
            </Link>
          </Button>

          {user && (
            <Button
              size="sm"
              variant={added ? 'secondary' : 'default'}
              onClick={handleToggleFavorite}
              disabled={loading}
              className="flex-1"
            >
              {loading
                ? <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                : <Star className={`w-3 h-3 mr-1 ${added ? 'fill-current' : ''}`} />
              }
              {loading ? 'Loading...' : added ? 'Saved' : 'Save'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default GiveawayCard