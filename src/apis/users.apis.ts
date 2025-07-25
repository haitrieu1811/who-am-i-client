import http from '~/lib/http'
import type { AuthResponse } from '~/types/users.types'

export const LOGIN_ENDPOINT = '/users/login'

const usersApis = {
  login(body: { username: string; password: string }) {
    return http.post<AuthResponse>(LOGIN_ENDPOINT, body)
  }
} as const

export default usersApis
