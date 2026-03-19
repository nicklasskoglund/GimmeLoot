import type { Giveaway } from '../types/giveaway'

interface GiveawayCardProps {
    giveaway: Giveaway
}

function GiveawayCard({ giveaway }: GiveawayCardProps) {
    return (
        <div>
            <img src={giveaway.image} alt={giveaway.title} />
            <h2>{giveaway.title}</h2>
            <p>{giveaway.platforms}</p>
            <p>{giveaway.worth}</p>
            <a href={giveaway.open_giveaway_url} target='_blank' rel='noreferrer'>
                Claim giveaway
            </a>
        </div>
    )
}

export default GiveawayCard