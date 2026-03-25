import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Giveaway } from '../types/giveaway'
import { getGiveaway } from '../api/giveaways'
import { useAuth } from '../context/AuthContext'
import { addFavorite } from '../api/favorites'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ExternalLink, Star, Loader2, Clock, Users } from 'lucide-react'
import { toast } from 'sonner'


function GiveawayDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [giveaway, setGiveaway] = useState<Giveaway | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    getGiveaway(Number(id))
      .then(setGiveaway)
      .catch(() => setError('Failed to load giveaway.'))
      .finally(() => setLoading(false))
  }, [id])


    const instructionTitle = giveaway?.type?.toLowerCase().includes('loot') ||
        giveaway?.type?.toLowerCase().includes('dlc')
        ? 'New Codes'
        : 'Instructions'


    const handleSave = async () => {
        if (!giveaway) return
        setSaving(true)
        try {
        await addFavorite(giveaway.id)
        setSaved(true)
        toast.success('Saved to favorites!')
        } catch {
        toast.error('Failed to save. Try again.')
        } finally {
        setSaving(false)
        }
    }

  if (loading) return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 animate-pulse">
      <div className="h-6 w-32 bg-muted rounded" />
      <div className="aspect-video bg-muted rounded-xl w-full" />
      <div className="h-8 w-2/3 bg-muted rounded" />
      <div className="h-4 w-1/3 bg-muted rounded" />
      <div className="h-24 bg-muted rounded" />
    </div>
  )

  if (error || !giveaway) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <p className="text-destructive text-lg font-medium">{error ?? 'Giveaway not found.'}</p>
      <Button variant="outline" onClick={() => navigate('/')}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to giveaways
      </Button>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">

      {/* Back button */}
      <Button variant="ghost" className="w-fit -ml-2" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      {/* Hero image */}
      <div className="rounded-xl overflow-hidden border border-border aspect-video w-full">
        <img src={giveaway.image} alt={giveaway.title} className="w-full h-full object-cover" />
      </div>

      {/* Title + meta */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2 items-center">
          {giveaway.platforms.split(',').map(p => (
            <Badge key={p.trim()} variant="secondary">{p.trim()}</Badge>
          ))}
          {giveaway.worth && giveaway.worth !== 'N/A' && (
            <Badge variant="secondary" className="text-green-500 border-green-500/30">
              Free <span className="line-through text-muted-foreground ml-1">{giveaway.worth}</span>
            </Badge>
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight">{giveaway.title}</h1>

        {giveaway.end_date && giveaway.end_date !== 'N/A' && (
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Ends {new Date(giveaway.end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        )}
      </div>

      {/* Claim + Save */}
      <div className="flex gap-3">
        <Button asChild className="flex-1 sm:flex-none">
          <a href={giveaway.open_giveaway_url} target="_blank" rel="noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" /> Claim Giveaway
          </a>
        </Button>
        {user && (
          <Button variant={saved ? 'secondary' : 'outline'} disabled={saved || saving} onClick={handleSave}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Star className={`w-4 h-4 mr-2 ${saved ? 'fill-current' : ''}`} />}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
          </Button>
        )}
      </div>

      {/* About */}
      {giveaway.description && (
        <div className="flex flex-col gap-2 border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold">About this giveaway</h2>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {giveaway.description}
          </p>
        </div>
      )}

      {/* Instructions / New Codes */}
      {giveaway.instructions && (
        <div className="flex flex-col gap-2 border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold">{instructionTitle}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {giveaway.instructions}
          </p>
        </div>
      )}

    </div>
  )
}

export default GiveawayDetailPage