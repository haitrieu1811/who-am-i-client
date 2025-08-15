/* eslint-disable react-refresh/only-export-components */
import { useMutation, useQuery } from '@tanstack/react-query'
import { EllipsisVertical, Loader2, PlusCircle } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

import questionsApis from '~/apis/questions.apis'
import CreateQuestionForm from '~/components/forms/create-question'
import PaginationV2 from '~/components/pagination'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '~/components/ui/alert-dialog'
import { Avatar, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import { QuestionLevel } from '~/constants/enum'
import { AppContext } from '~/contexts/app.context'
import useSearchQuery from '~/hooks/use-search-query'
import { cn } from '~/lib/utils'
import type { QuestionItem } from '~/types/questions.types'

type DashboardQuestionsPageContext = {
  existedPlayerIds?: string[]
}

const defaultContext: DashboardQuestionsPageContext = {
  existedPlayerIds: []
}

export const DashboardQuestionsPageContext = React.createContext<DashboardQuestionsPageContext>(defaultContext)

export default function DashboardQuestionsPage() {
  const { isAuthenticated } = React.useContext(AppContext)

  const [isCreatingNew, setIsCreatingNew] = React.useState<boolean>(false)
  const [currentQuestion, setCurrentQuestion] = React.useState<QuestionItem | null>(null)
  const [currentDeletingId, setCurrentDeletingId] = React.useState<string | null>(null)

  const searchQuery = useSearchQuery()
  const page = searchQuery.page

  const getQuestionsQuery = useQuery({
    queryKey: ['get-questions', { page }],
    queryFn: () =>
      questionsApis.findMany({
        page,
        limit: '24'
      }),
    enabled: isAuthenticated
  })

  const questions = React.useMemo(
    () => getQuestionsQuery.data?.data.data.questions ?? [],
    [getQuestionsQuery.data?.data.data.questions]
  )
  const totalQuestions = getQuestionsQuery.data?.data.data.pagination.totalRows ?? 0
  const totalPages = getQuestionsQuery.data?.data.data.pagination.totalPages ?? 0
  const existedPlayerIds = React.useMemo(
    () => getQuestionsQuery.data?.data.data.existedPlayerIds ?? [],
    [getQuestionsQuery.data?.data.data.existedPlayerIds]
  )

  const deleteQuestionMutation = useMutation({
    mutationKey: ['delete-question'],
    mutationFn: questionsApis.deleteOne,
    onSuccess: (data) => {
      toast.success(data.data.message)
      getQuestionsQuery.refetch()
    }
  })

  const handleDeleteQuestion = () => {
    if (!currentDeletingId) return
    deleteQuestionMutation.mutate(currentDeletingId)
  }

  return (
    <DashboardQuestionsPageContext.Provider value={{ existedPlayerIds }}>
      <div className='space-y-8'>
        <div className='flex justify-between items-center'>
          <h1 className='text-xl font-medium tracking-tight'>Quản lý câu hỏi</h1>
          <Button variant='outline' onClick={() => setIsCreatingNew(true)}>
            <PlusCircle className='size-4' />
            Thêm câu hỏi mới
          </Button>
        </div>
        {/* Danh sách câu hỏi */}
        {!getQuestionsQuery.isFetching && totalQuestions > 0 && (
          <div className='grid grid-cols-12 gap-4'>
            {questions.map((question) => (
              <div key={question._id} className='col-span-2'>
                <div className='relative border rounded-md bg-muted group overflow-hidden'>
                  <div className='p-4 space-y-4 flex flex-col justify-center items-center'>
                    <div className='absolute top-1 right-1 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size='icon' variant='ghost'>
                            <EllipsisVertical className='size-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuLabel>Tác vụ</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setCurrentQuestion(question)}>Chi tiết</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setCurrentDeletingId(question._id)}>Xóa</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className='relative p-1 border rounded-full'>
                      <Avatar className='size-16'>
                        <AvatarImage src={question.player.avatar.url} alt={question.player.name} />
                      </Avatar>
                      <div className='size-6 rounded-full flex justify-center items-center text-sm font-semibold bg-primary text-primary-foreground absolute bottom-0 right-0'>
                        {question.player.shirtNumber}
                      </div>
                    </div>
                    <div className='text-center text-sm font-medium'>{question.player.name}</div>
                  </div>
                  <div className='bg-background p-2 flex justify-end items-center space-x-4'>
                    <Badge
                      className={cn('text-white', {
                        'bg-blue-500': question.level === QuestionLevel.Easy,
                        'bg-yellow-500': question.level === QuestionLevel.Medium,
                        'bg-red-500': question.level === QuestionLevel.Hard
                      })}
                    >
                      {question.level === QuestionLevel.Easy && 'Dễ'}
                      {question.level === QuestionLevel.Medium && 'Trung bình'}
                      {question.level === QuestionLevel.Hard && 'Khó'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Phân trang */}
        {!getQuestionsQuery.isFetching && totalPages > 1 && <PaginationV2 totalPages={totalPages} />}
        {getQuestionsQuery.isFetching && (
          <div className='flex justify-center p-10'>
            <Loader2 className='size-10 stroke-1 animate-spin' />
          </div>
        )}
      </div>
      {/* Thêm câu hỏi mới */}
      <Dialog open={isCreatingNew} onOpenChange={setIsCreatingNew}>
        <DialogContent className='max-h-[90vh] overflow-y-auto pb-0'>
          <DialogHeader>
            <DialogTitle>Thêm câu hỏi mới</DialogTitle>
          </DialogHeader>
          <div className='mt-4'>
            <CreateQuestionForm
              onCreateSuccess={() => {
                setIsCreatingNew(false)
                getQuestionsQuery.refetch()
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
      {/* Cập nhật câu hỏi */}
      <Dialog
        open={!!currentQuestion}
        onOpenChange={(value) => {
          if (!value) setCurrentQuestion(null)
        }}
      >
        <DialogContent className='max-h-[90vh] overflow-y-auto pb-0'>
          <DialogHeader>
            <DialogTitle>Cập nhật câu hỏi</DialogTitle>
          </DialogHeader>
          <div className='mt-4'>
            <CreateQuestionForm
              questionData={currentQuestion}
              onUpdateSuccess={() => {
                getQuestionsQuery.refetch()
                setCurrentQuestion(null)
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
      {/* Xác nhận xóa câu hỏi */}
      <AlertDialog
        open={!!currentDeletingId}
        onOpenChange={(value) => {
          if (!value) setCurrentDeletingId(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa câu hỏi này?</AlertDialogTitle>
            <AlertDialogDescription>
              Thông tin câu hỏi sẽ bị xóa vĩnh viễn và không thể khôi phục.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteQuestion}>Tiếp tục</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardQuestionsPageContext.Provider>
  )
}
