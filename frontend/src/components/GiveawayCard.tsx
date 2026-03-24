import { useAuth } from '../context/AuthContext'
import { addFavorite } from '../api/favorites'
import { useState } from 'react'
import type { Giveaway } from '../types/giveaway'

interface GiveawayCardProps {
    giveaway: Giveaway
}


function GiveawayCard({ giveaway }: GiveawayCardProps) {
    const { user } = useAuth()
    const [added, setAdded] = useState(false)

    const handleAddFavorite = async () => {
        await addFavorite(giveaway.id)
        setAdded(true)
    }

    return (
        <div>
            <img src={giveaway.image} alt={giveaway.title} />
            <h2>{giveaway.title}</h2>
            <p>{giveaway.platforms}</p>
            <p>{giveaway.worth}</p>
            <a href={giveaway.open_giveaway_url} target='_blank' rel='noreferrer'>
                Claim giveaway
            </a>
            {user && (
                <button onClick={handleAddFavorite} disabled={added}>
                    {added ? 'Added!' : 'Add to favorites'}
                </button>
            )}
        </div>
    )
}

export default GiveawayCard