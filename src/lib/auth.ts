import type { OriginalUser } from '~/types/users.types'

export const localStorageEventTarget = new EventTarget()

export const getAccessTokenFromStorage = () => {
  return localStorage.getItem('accessToken') || ''
}

export const getRefreshTokenFromStorage = () => {
  return localStorage.getItem('refreshToken') || ''
}

export const setAccessTokenToStorage = (accessToken: string) => {
  localStorage.setItem('accessToken', accessToken)
}

export const setRefreshTokenToStorage = (refreshToken: string) => {
  localStorage.setItem('refreshToken', refreshToken)
}

export const clearAuthStorage = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  const clearAuthLSEvent = new Event('clearAuthLS')
  localStorageEventTarget.dispatchEvent(clearAuthLSEvent)
}

export const getUserFromStorage = (): OriginalUser | null => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export const setUserToStorage = (user: OriginalUser) => {
  localStorage.setItem('user', JSON.stringify(user))
}
