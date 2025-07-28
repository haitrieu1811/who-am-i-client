import type { PaginationResponse, SuccessResponse } from '~/types/utils.types'

export type TeamItem = {
  _id: string
  logo: {
    _id: string
    url: string
  }
  name: string
  league: {
    _id: string
    logo: string
    name: string
    createdAt: string
    updatedAt: string
  }
  createdAt: string
  updatedAt: string
}

export type GetTeamsResponse = SuccessResponse<{
  teams: TeamItem[]
  pagination: PaginationResponse
}>

export type CreateTeamResponse = SuccessResponse<{
  team: TeamItem
}>
