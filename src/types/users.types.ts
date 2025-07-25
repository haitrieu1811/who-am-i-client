import type { UserRole } from '~/constants/enum'
import type { SuccessResponse } from '~/types/utils.types'

export type OriginalUser = {
  _id: string
  username: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export type AuthResponse = SuccessResponse<{
  accessToken: string
  refreshToken: string
  user: OriginalUser
}>
