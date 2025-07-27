export type SuccessResponse<Data> = {
  message: string
  data: Data
}

export type ErrorResponse<Data> = {
  message: string
  errors: Data
}

export type OnlyMessageResponse = {
  message: string
}

export type PaginationResponse = {
  page: number
  limit: number
  totalRows: number
  totalPages: number
}

export type PaginationReqQuery = {
  page?: string
  limit?: string
}

export type ImageItem = {
  _id: string
  name: string
  url: string
}
