import type { PlayerPosition } from '~/constants/enum'
import http from '~/lib/http'
import type { CreatePlayerResponse, GetPlayersResponse } from '~/types/players.types'
import type { OnlyMessageResponse, PaginationReqQuery } from '~/types/utils.types'

export type CreatePlayerReqBody = {
  nationId: string
  leagueId: string
  teamId: string
  avatar: string | null
  name: string
  dateOfBirth: Date
  shirtNumber: number
  position: PlayerPosition
}

export type GetPlayersReqQuery = PaginationReqQuery & {
  name?: string
  nationId?: string
  leagueId?: string
  teamId?: string
  position?: string
}

const playersApis = {
  findMany(params?: GetPlayersReqQuery) {
    return http.get<GetPlayersResponse>('/players', { params })
  },

  insertOne(body: CreatePlayerReqBody) {
    return http.post<CreatePlayerResponse>('/players', body)
  },

  updateOne({ body, playerId }: { body: CreatePlayerReqBody; playerId: string }) {
    return http.put<CreatePlayerResponse>(`/players/${playerId}`, body)
  },

  deleteOne(playerId: string) {
    return http.delete<OnlyMessageResponse>(`/players/${playerId}`)
  }
} as const

export default playersApis
