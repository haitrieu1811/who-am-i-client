/* eslint-disable @typescript-eslint/no-unused-expressions */
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import { Loader2, User } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import questionsApis from '~/apis/questions.apis'
import SelectPlayer from '~/components/forms/create-question/select-player'
import { Avatar, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Label } from '~/components/ui/label'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { QuestionLevel } from '~/constants/enum'
import type { PlayerItem } from '~/types/players.types'
import type { CreateQuestionResponse, QuestionItem } from '~/types/questions.types'

const createQuestionSchema = z.object({
  level: z.enum(
    [QuestionLevel.Easy.toString(), QuestionLevel.Medium.toString(), QuestionLevel.Hard.toString()],
    'Cấp độ câu hỏi không hợp lệ.'
  )
})

type CreateQuestionSchema = z.infer<typeof createQuestionSchema>

type CreateQuestionFormProps = {
  questionData?: QuestionItem | null
  onCreateSuccess?: (data: AxiosResponse<CreateQuestionResponse>) => void
  onUpdateSuccess?: (data: AxiosResponse<CreateQuestionResponse>) => void
}

export default function CreateQuestionForm({
  questionData,
  onCreateSuccess,
  onUpdateSuccess
}: CreateQuestionFormProps) {
  const isUpdateMode = !!questionData

  const [currentPlayer, setCurrentPlayer] = React.useState<PlayerItem | null>(null)
  const [isSelectingPlayer, setIsSelectingPlayer] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (!questionData) return
    setCurrentPlayer(questionData.player)
  }, [questionData])

  const form = useForm<CreateQuestionSchema>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: {
      level: questionData?.level.toString()
    }
  })

  const createQuestionMutation = useMutation({
    mutationKey: ['create-player'],
    mutationFn: questionsApis.insertOne,
    onSuccess: (data) => {
      toast.success(data.data.message)
      form.reset()
      onCreateSuccess && onCreateSuccess(data)
    }
  })

  const updateQuestionMutation = useMutation({
    mutationKey: ['update-player'],
    mutationFn: questionsApis.updateOne,
    onSuccess: (data) => {
      toast.success(data.data.message)
      form.reset()
      onUpdateSuccess && onUpdateSuccess(data)
    }
  })

  const isPending = createQuestionMutation.isPending || updateQuestionMutation.isPending

  const handleChangePlayer = React.useCallback((data: PlayerItem) => {
    setCurrentPlayer(data)
    setIsSelectingPlayer(false)
  }, [])

  const handleSubmit = form.handleSubmit((data) => {
    if (!currentPlayer) return
    const body = {
      level: Number(data.level),
      answerId: currentPlayer._id
    }
    if (!isUpdateMode) {
      createQuestionMutation.mutate(body)
      return
    }
    updateQuestionMutation.mutate({
      body,
      questionId: questionData._id
    })
  })

  return (
    <React.Fragment>
      <Form {...form}>
        <form className='space-y-6' onSubmit={handleSubmit}>
          {/* Chọn cầu thủ */}
          <div className='space-y-3'>
            <Label>Cầu thủ (đáp án):</Label>
            {currentPlayer && (
              <div className='flex items-center space-x-2'>
                <Avatar>
                  <AvatarImage src={currentPlayer.avatar.url} alt={currentPlayer.name} />
                </Avatar>
                <div className='font-medium text-sm'>{currentPlayer.name}</div>
              </div>
            )}
            <Button type='button' size='sm' variant='outline' onClick={() => setIsSelectingPlayer(true)}>
              <User className='size-4' />
              {!currentPlayer ? 'Chọn cầu thủ' : 'Thay đổi cầu thủ'}
            </Button>
            {form.formState.isSubmitted && !currentPlayer && (
              <p className='text-sm text-destructive'>Chỉ định cầu thủ là bắt buộc.</p>
            )}
          </div>
          {/* Cấp độ */}
          <FormField
            control={form.control}
            name='level'
            render={({ field }) => (
              <FormItem className='space-y-3'>
                <FormLabel>Cấp độ</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-col'>
                    <FormItem className='flex items-center gap-3'>
                      <FormControl>
                        <RadioGroupItem value={QuestionLevel.Easy.toString()} />
                      </FormControl>
                      <FormLabel className='font-normal text-blue-500'>Dễ</FormLabel>
                    </FormItem>
                    <FormItem className='flex items-center gap-3'>
                      <FormControl>
                        <RadioGroupItem value={QuestionLevel.Medium.toString()} />
                      </FormControl>
                      <FormLabel className='font-normal text-yellow-500'>Trung bình</FormLabel>
                    </FormItem>
                    <FormItem className='flex items-center gap-3'>
                      <FormControl>
                        <RadioGroupItem value={QuestionLevel.Hard.toString()} />
                      </FormControl>
                      <FormLabel className='font-normal text-red-500'>Khó</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='sticky bottom-0 inset-x-0 bg-background pb-6'>
            <Button type='submit' disabled={isPending} className='w-full'>
              {isPending && <Loader2 className='size-4 animate-spin' />}
              {!isUpdateMode ? 'Thêm câu hỏi' : 'Cập nhật câu hỏi'}
            </Button>
          </div>
        </form>
      </Form>
      {/* Chọn cầu thủ */}
      <Dialog open={isSelectingPlayer} onOpenChange={setIsSelectingPlayer}>
        <DialogContent className='max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Chọn cầu thủ</DialogTitle>
            <DialogDescription>Chọn cầu thủ để tạo câu hỏi cho cầu thủ đó</DialogDescription>
          </DialogHeader>
          <div className='mt-4'>
            <SelectPlayer defaultValue={currentPlayer} onChange={handleChangePlayer} />
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
