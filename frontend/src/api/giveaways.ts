import apiClient from './client'
import type { Giveaway } from '../types/giveaway'


export interface GiveawayFilters {
  platform?: string
  type?: string
  sort_by?: string
  contains?: string
  only_active?: boolean
  min_worth?: number
}


export const getGiveaways = async (filters?: GiveawayFilters): Promise<Giveaway[]> => {
  const params: Record<string, string | number | boolean> = {}
  if (filters?.platform) params.platform = filters.platform
  if (filters?.type) params.type = filters.type
  if (filters?.sort_by) params.sort_by = filters.sort_by
  if (filters?.contains) params.contains = filters.contains
  if (filters?.only_active) params.only_active = filters.only_active
  if (filters?.min_worth && filters.min_worth > 0) params.min_worth = filters.min_worth
  const response = await apiClient.get<Giveaway[]>('/giveaways', { params })
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