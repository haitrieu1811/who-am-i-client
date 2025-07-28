import http from '~/lib/http'
import type { CreateTeamResponse, GetTeamsResponse } from '~/types/teams.types'
import type { OnlyMessageResponse, PaginationReqQuery } from '~/types/utils.types'

export type GetTeamsReqQuery = PaginationReqQuery & {
  name?: string
  leagueId?: string
}

const teamsApis = {
  findMany(params?: GetTeamsReqQuery) {
    return http.get<GetTeamsResponse>('/teams', { params })
  },

  insertOne(body: { name: string; logo: string; leagueId: string }) {
    return http.post<CreateTeamResponse>('/teams', body)
  },

  updateOne({ body, teamId }: { body: { name: string; logo: string; leagueId: string }; teamId: string }) {
    return http.put<CreateTeamResponse>(`/teams/${teamId}`, body)
  },

  deleteOne(teamId: string) {
    return http.delete<OnlyMessageResponse>(`/teams/${teamId}`)
  }
} as const

export default teamsApis
