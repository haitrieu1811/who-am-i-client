import type { PlayerPosition } from '~/constants/enum'
import type { LeagueItem } from '~/types/leagues.types'
import type { NationItem } from '~/types/nations.types'
import type { TeamItem } from '~/types/teams.types'
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
  age: number
  nation: NationItem
  league: LeagueItem
  team: TeamItem
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
