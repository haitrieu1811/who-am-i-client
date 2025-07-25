import axios, { AxiosError, HttpStatusCode } from 'axios'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type { ErrorResponse } from '~/types/utils.types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isAxiosError = <T>(error: unknown): error is AxiosError<T> => {
  return axios.isAxiosError(error)
}

export const isEntityError = <FormErrors>(error: unknown): error is AxiosError<FormErrors> => {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

export const isUnauthorizedError = <UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> => {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized
}

export const isExpiredTokenError = <UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> => {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  return isUnauthorizedError<ErrorResponse<{}>>(error) && error.response?.data.message === 'Jwt expired'
}
