import type { PlayerPosition } from '~/constants/enum'
import type { PaginationResponse, SuccessResponse } from '~/types/utils.types'

export type PlayerItem = {
  _id: string
  name: string
  avatar: {
    _id: string
    url: string
  }
  shirtNumber: number
  position: PlayerPosition
  nation: {
    _id: string
    flag: string
    name: string
    createdAt: string
    updatedAt: string
  }
  league: {
    _id: string
    logo: string
    name: string
    createdAt: string
    updatedAt: string
  }
  team: {
    _id: string
    logo: string
    leagueId: string
    name: string
    createdAt: string
    updatedAt: string
  }
  age: number
  dateOfBirth: string
  createdAt: string
  updatedAt: string
}

export type GetPlayersResponse = SuccessResponse<{
  players: PlayerItem[]
  pagination: PaginationResponse
}>

export type CreatePlayerResponse = SuccessResponse<{
  player: PlayerItem
}>
