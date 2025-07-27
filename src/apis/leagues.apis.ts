import http from '~/lib/http'
import type { CreateLeagueResponse, GetLeagueResponse, GetLeaguesResponse } from '~/types/leagues.types'
import type { OnlyMessageResponse, PaginationReqQuery } from '~/types/utils.types'

const leaguesApis = {
  findMany(params?: PaginationReqQuery) {
    return http.get<GetLeaguesResponse>('/leagues', { params })
  },

  findOne(leagueId: string) {
    return http.get<GetLeagueResponse>(`/leagues/${leagueId}`)
  },

  insertOne(body: { logo: string; name: string }) {
    return http.post<CreateLeagueResponse>('/leagues', body)
  },

  updateOne({ body, leagueId }: { body: { logo: string; name: string }; leagueId: string }) {
    return http.put<CreateLeagueResponse>(`/leagues/${leagueId}`, body)
  },

  deleteOne(leagueId: string) {
    return http.delete<OnlyMessageResponse>(`/leagues/${leagueId}`)
  }
} as const

export default leaguesApis
