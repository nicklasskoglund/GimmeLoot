import type { Giveaway } from '../types/giveaway'
import GiveawayCard from './GiveawayCard'


interface GiveawayListProps {
    giveaways: Giveaway[]
}

function GiveawayList({ giveaways }: GiveawayListProps) {
    if (giveaways.length === 0) {
        return <p>No giveaway found.</p>
    }

    return (
        <div>
            {giveaways.map((giveaway) => (
            <GiveawayCard key={giveaway.id} giveaway={giveaway} />
            ))}
        </div>
    )
}

export default GiveawayList