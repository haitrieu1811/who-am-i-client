import http from '~/lib/http'
import type { ImageItem, SuccessResponse } from '~/types/utils.types'

const utilsApis = {
  uploadImage(formData: FormData) {
    return http.post<
      SuccessResponse<{
        images: ImageItem[]
      }>
    >('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
} as const

export default utilsApis
