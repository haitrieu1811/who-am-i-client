import type { AxiosInstance } from 'axios'
import axios from 'axios'

import { LOGIN_ENDPOINT } from '~/apis/users.apis'
import {
  getAccessTokenFromStorage,
  getRefreshTokenFromStorage,
  getUserFromStorage,
  setAccessTokenToStorage,
  setRefreshTokenToStorage,
  setUserToStorage
} from '~/lib/auth'
import type { AuthResponse, OriginalUser } from '~/types/users.types'

class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private user: OriginalUser | null

  constructor() {
    this.accessToken = getAccessTokenFromStorage()
    this.refreshToken = getRefreshTokenFromStorage()
    this.user = getUserFromStorage()
    this.instance = axios.create({
      baseURL: 'http://localhost:4000',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Add a request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Do something before request is sent
        return config
      },
      (error) => {
        // Do something with request error
        return Promise.reject(error)
      }
    )

    // Add a response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        const { url } = response.config
        if (url && [LOGIN_ENDPOINT].includes(url)) {
          const { accessToken, refreshToken, user } = (response.data as AuthResponse).data
          setAccessTokenToStorage(accessToken)
          setRefreshTokenToStorage(refreshToken)
          setUserToStorage(user)
          this.accessToken = accessToken
          this.refreshToken = refreshToken
          this.user = user
        }
        return response
      },
      (error) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance
export default http
