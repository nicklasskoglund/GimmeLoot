import type { Giveaway } from '../types/giveaway'
import GiveawayCard from './GiveawayCard'

interface GiveawayListProps {
  giveaways: Giveaway[]
  savedIds: number[]
}


function GiveawayList({ giveaways, savedIds }: GiveawayListProps) {
  if (giveaways.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <p className="text-lg font-medium">No giveaways found</p>
        <p className="text-sm mt-1">Try a different search term</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {giveaways.map((giveaway) => (
        <GiveawayCard key={giveaway.id} giveaway={giveaway} initialSaved={savedIds.includes(giveaway.id)} />
      ))}
    </div>
  )
}

export default GiveawayList