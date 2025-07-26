import http from '~/lib/http'
import type { AuthResponse } from '~/types/users.types'

export const LOGIN_ENDPOINT = '/users/login'
export const REFRESH_TOKEN_ENDPOINT = '/users/refresh-token'

const usersApis = {
  login(body: { username: string; password: string }) {
    return http.post<AuthResponse>(LOGIN_ENDPOINT, body)
  }
} as const

export default usersApis
