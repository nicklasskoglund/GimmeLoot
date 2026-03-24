import apiClient from './client'
import type { Giveaway } from '../types/giveaway'


export const getGiveaways = async (): Promise<Giveaway[]> => {
  const response = await apiClient.get<Giveaway[]>('/giveaways')
  return response.data
}


export const searchGiveaways = async (term: string): Promise<Giveaway[]> => {
  const response = await apiClient.get<Giveaway[]>(`/giveaways/search/${term}`)
  return response.data
}


export const getGiveaway = async (id: number): Promise<Giveaway> => {
    const response = await apiClient.get<Giveaway>(`/giveaways/${id}`)
    return response.data
}