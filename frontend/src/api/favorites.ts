import client from './client'


export interface Favorite {
    id: string
    user_id: string
    giveaway_id: number
    created_at: string
}


export async function getFavorites(): Promise<Favorite[]> {
    const response = await client.get<Favorite[]>('/favorites')
    return response.data
}


export async function getFavorite(id: string): Promise<Favorite> {
    const response = await client.get<Favorite>(`/favorites/${id}`)
    return response.data
}


export async function addFavorite(giveawayId: number): Promise<Favorite> {
    const response = await client.post<Favorite>(`/favorites/${giveawayId}`)
    return response.data
}


export async function removeFavorite(giveawayId: number): Promise<void> {
    await client.delete(`/favorites/${giveawayId}`)
}