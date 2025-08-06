import type { QuestionLevel } from '~/constants/enum'
import type { PlayerItem } from '~/types/players.types'
import type { PaginationResponse, SuccessResponse } from '~/types/utils.types'

export type QuestionItem = {
  _id: string
  player: PlayerItem
  level: QuestionLevel
  createdAt: string
  updatedAt: string
}

export type GetQuestionResponse = SuccessResponse<{
  question: QuestionItem
}>

export type GetQuestionsResponse = SuccessResponse<{
  questions: QuestionItem[]
  pagination: PaginationResponse
}>

export type CreateQuestionResponse = GetQuestionResponse
