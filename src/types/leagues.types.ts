import type { PaginationResponse, SuccessResponse } from '~/types/utils.types'

export type LeagueItem = {
  _id: string
  logo: {
    _id: string
    url: string
  }
  name: string
  createdAt: string
  updatedAt: string
}

export type GetLeaguesResponse = SuccessResponse<{
  leagues: LeagueItem[]
  pagination: PaginationResponse
}>

export type GetLeagueResponse = SuccessResponse<{
  league: LeagueItem
}>

export type CreateLeagueResponse = SuccessResponse<{
  league: LeagueItem
}>
