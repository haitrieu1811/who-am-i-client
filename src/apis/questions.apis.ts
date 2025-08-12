import type { QuestionLevel } from '~/constants/enum'
import http from '~/lib/http'
import type { CreateQuestionResponse, GetQuestionResponse, GetQuestionsResponse } from '~/types/questions.types'
import type { OnlyMessageResponse, PaginationReqQuery } from '~/types/utils.types'

const questionsApis = {
  findRandom() {
    return http.get<GetQuestionResponse>('/questions/random')
  },

  findOneById(questionId: string) {
    return http.get<GetQuestionResponse>(`/questions/${questionId}`)
  },

  findMany(params?: PaginationReqQuery) {
    return http.get<GetQuestionsResponse>('/questions', { params })
  },

  insertOne(body: { level: QuestionLevel; answerId: string }) {
    return http.post<CreateQuestionResponse>('/questions', body)
  },

  updateOne({ body, questionId }: { body: { level: QuestionLevel; answerId: string }; questionId: string }) {
    return http.put<CreateQuestionResponse>(`/questions/${questionId}`, body)
  },

  deleteOne(questionId: string) {
    return http.delete<OnlyMessageResponse>(`/questions/${questionId}`)
  }
} as const

export default questionsApis
