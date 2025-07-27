import http from '~/lib/http'
import type { NationItem } from '~/types/nations.types'
import type { OnlyMessageResponse, PaginationReqQuery, PaginationResponse, SuccessResponse } from '~/types/utils.types'

export type CreateNationResponse = SuccessResponse<{
  nation: NationItem
}>

const nationsApis = {
  findMany(params?: PaginationReqQuery) {
    return http.get<
      SuccessResponse<{
        nations: NationItem[]
        pagination: PaginationResponse
      }>
    >('/nations', { params })
  },

  findOne(nationId: string) {
    return http.get<
      SuccessResponse<{
        nations: NationItem
      }>
    >(`/nations/${nationId}`)
  },

  insertOne(body: { flag: string; name: string }) {
    return http.post<CreateNationResponse>('/nations', body)
  },

  updateOne({ body, nationId }: { body: { flag: string; name: string }; nationId: string }) {
    return http.put<CreateNationResponse>(`/nations/${nationId}`, body)
  },

  deleteOne(nationId: string) {
    return http.delete<OnlyMessageResponse>(`/nations/${nationId}`)
  }
} as const

export default nationsApis
