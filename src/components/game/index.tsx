import { useQuery } from '@tanstack/react-query'
import { ArrowLeftRight, Reply, RotateCcw } from 'lucide-react'
import React from 'react'

import questionsApis from '~/apis/questions.apis'
import AnswerInfo from '~/components/game/answer-info'
import SelectAnswer from '~/components/game/select-answer'
import { ModeToggle } from '~/components/mode-toggle'
import PlayerItem from '~/components/player-item'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '~/components/ui/alert-dialog'
import { Avatar, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'
import { Label } from '~/components/ui/label'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'
import { PlayerPosition, QuestionLevel } from '~/constants/enum'
import { AppContext } from '~/contexts/app.context'
import { cn } from '~/lib/utils'
import type { PlayerItem as PlayerItemType } from '~/types/players.types'

const MAX_ANSWER_TURN = 8

export default function Game() {
  const [answers, setAnswers] = React.useState<PlayerItemType[]>([])
  const [isSelecting, setIsSelecting] = React.useState<boolean>(false)
  const [isShowResult, setIsShowResult] = React.useState<boolean>(true)

  const { handleResetSelectPlayer } = React.useContext(AppContext)

  const getRandomQuestion = useQuery({
    queryKey: ['get-random-question'],
    queryFn: () => questionsApis.findRandom()
  })

  const question = React.useMemo(
    () => getRandomQuestion.data?.data.data.question,
    [getRandomQuestion.data?.data.data.question]
  )

  const correctAnswer = React.useMemo(() => question?.player, [question?.player])

  const isWin = correctAnswer && answers.map((answer) => answer._id).includes(correctAnswer._id)
  const isLose = answers.length === MAX_ANSWER_TURN
  const isEnd = isWin || isLose

  const handleContinue = () => {
    setAnswers([])
    getRandomQuestion.refetch()
    handleResetSelectPlayer()
    setIsShowResult(true)
  }

  return (
    <React.Fragment>
      <div className='sm:w-full md:w-lg mx-auto p-6 bg-muted min-h-screen'>
        <div className='space-y-6'>
          {/* Hình ảnh gợi ý */}
          <div
            className={cn('flex justify-center bg-background py-10 rounded-md pointer-events-none', {
              'blur-md': !isEnd
            })}
          >
            <Avatar className='size-40'>
              <AvatarImage src={question?.player.avatar.url} />
            </Avatar>
          </div>
          {/* Thông tin và các nút thao tác */}
          <div className='flex justify-between items-center'>
            <div className='space-y-2'>
              <div className='flex items-center space-x-2'>
                <Label>Cấp độ:</Label>
                <Badge
                  className={cn('text-white', {
                    'bg-blue-500': question?.level === QuestionLevel.Easy,
                    'bg-yellow-500': question?.level === QuestionLevel.Medium,
                    'bg-red-500': question?.level === QuestionLevel.Hard
                  })}
                >
                  {question?.level === QuestionLevel.Easy && 'Dễ'}
                  {question?.level === QuestionLevel.Medium && 'Trung bình'}
                  {question?.level === QuestionLevel.Hard && 'Khó'}
                </Badge>
              </div>
              <div className='flex items-center space-x-2'>
                <Label>Lượt thử:</Label>
                <Badge variant='outline'>Còn {MAX_ANSWER_TURN - answers.length} lượt</Badge>
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant='outline'>
                    <ArrowLeftRight className='size-4' />
                    Đổi câu hỏi khác
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Đổi câu hỏi khác?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn sẽ bỏ qua câu hỏi này và bắt đầu lại với câu hỏi khác.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                    <AlertDialogAction onClick={handleContinue}>Tiếp tục</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <ModeToggle />
            </div>
          </div>
          <div className='flex justify-end'>
            <Button disabled={isEnd} onClick={() => setIsSelecting(true)}>
              <Reply className='size-4' />
              Đưa ra đáp án
            </Button>
          </div>
          {/* Lịch sử các đáp án đưa ra */}
          {answers.length > 0 && (
            <div className='space-y-6'>
              {answers.map((answer, index) => (
                <div key={index} className='space-y-3'>
                  <div className='flex flex-col justify-center items-center space-x-2'>
                    <div
                      className={cn('text-center capitalize font-medium', {
                        'text-green-500': answer.name === correctAnswer?.name
                      })}
                    >
                      {answer.name}
                    </div>
                  </div>
                  <div className='grid grid-cols-12 gap-6'>
                    <div className='col-span-2'>
                      <AnswerInfo isTrue={answer.nation._id === correctAnswer?.nation._id}>
                        <Tooltip>
                          <TooltipTrigger>
                            <img src={answer.nation.flag} />
                          </TooltipTrigger>
                          <TooltipContent>Quốc tịch: {answer.nation.name}</TooltipContent>
                        </Tooltip>
                      </AnswerInfo>
                    </div>
                    <div className='col-span-2'>
                      <AnswerInfo isTrue={answer.league._id === correctAnswer?.league._id}>
                        <Tooltip>
                          <TooltipTrigger>
                            <img src={answer.league.logo} />
                          </TooltipTrigger>
                          <TooltipContent>Giải đấu: {answer.league.name}</TooltipContent>
                        </Tooltip>
                      </AnswerInfo>
                    </div>
                    <div className='col-span-2'>
                      <AnswerInfo isTrue={answer.team._id === correctAnswer?.team._id}>
                        <Tooltip>
                          <TooltipTrigger>
                            <img src={answer.team.logo} />
                          </TooltipTrigger>
                          <TooltipContent>Câu lạc bộ: {answer.team.name}</TooltipContent>
                        </Tooltip>
                      </AnswerInfo>
                    </div>
                    <div className='col-span-2'>
                      <AnswerInfo isTrue={answer.position === correctAnswer?.position}>
                        <Tooltip>
                          <TooltipTrigger>
                            <div
                              className={cn('flex justify-center items-center font-semibold', {
                                'text-yellow-500': answer.position === PlayerPosition.Gk,
                                'text-blue-500': answer.position === PlayerPosition.Df,
                                'text-green-500': answer.position === PlayerPosition.Mf,
                                'text-red-500': answer.position === PlayerPosition.Fw
                              })}
                            >
                              {answer.position === PlayerPosition.Gk && 'GK'}
                              {answer.position === PlayerPosition.Df && 'DF'}
                              {answer.position === PlayerPosition.Mf && 'MF'}
                              {answer.position === PlayerPosition.Fw && 'FW'}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            Vị trí thi đấu: {answer.position === PlayerPosition.Gk && 'Thủ môn'}
                            {answer.position === PlayerPosition.Df && 'Hậu vệ'}
                            {answer.position === PlayerPosition.Mf && 'Tiền vệ'}
                            {answer.position === PlayerPosition.Fw && 'Tiền đạo'}
                          </TooltipContent>
                        </Tooltip>
                      </AnswerInfo>
                    </div>
                    <div className='col-span-2'>
                      <AnswerInfo
                        isTrue={answer.age === correctAnswer?.age}
                        hintMessage={correctAnswer && answer.age < correctAnswer.age ? 'Lớn hơn' : 'Nhỏ hơn'}
                      >
                        <Tooltip>
                          <TooltipTrigger>
                            <div className='flex justify-center items-center font-semibold'>{answer.age}</div>
                          </TooltipTrigger>
                          <TooltipContent>Số tuổi</TooltipContent>
                        </Tooltip>
                      </AnswerInfo>
                    </div>
                    <div className='col-span-2'>
                      <AnswerInfo
                        isTrue={answer.shirtNumber === correctAnswer?.shirtNumber}
                        hintMessage={
                          correctAnswer && answer.shirtNumber < correctAnswer.shirtNumber ? 'Lớn hơn' : 'Nhỏ hơn'
                        }
                      >
                        <Tooltip>
                          <TooltipTrigger>
                            <div className='flex justify-center items-center font-semibold'>#{answer.shirtNumber}</div>
                          </TooltipTrigger>
                          <TooltipContent>Số áo</TooltipContent>
                        </Tooltip>
                      </AnswerInfo>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Giới thiệu */}
          <div className='text-center text-xs text-muted-foreground space-y-1'>
            <p>
              Được lấy ý tưởng từ trang{' '}
              <a href='https://playfootball.games/en-us/who-are-ya/' target='_blank' className='text-blue-500'>
                playfootball.games
              </a>{' '}
            </p>
            <p>
              Dữ liệu được sử dụng từ trang{' '}
              <a href='https://www.sofascore.com' target='_blank' className='text-blue-500'>
                Sofascore.com
              </a>{' '}
            </p>
            <p>Dữ liệu của mùa giải 2025-2026</p>
          </div>
        </div>
      </div>
      {/* Kết quả của câu hỏi */}
      <Dialog open={isEnd && isShowResult} onOpenChange={setIsShowResult}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kết quả của câu hỏi</DialogTitle>
            <DialogDescription
              className={cn({
                'text-green-500': isWin,
                'text-red-500': isLose && !isWin
              })}
            >
              {isWin && 'Bạn đã đoán đúng!'}
              {isLose && !isWin && 'Bạn đã đoán không chính xác!'}
            </DialogDescription>
          </DialogHeader>
          {correctAnswer && <PlayerItem playerData={correctAnswer} />}
          <DialogFooter>
            <Button onClick={handleContinue}>
              <RotateCcw className='size-4' />
              Chơi tiếp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Chọn đáp án */}
      <Dialog open={isSelecting} onOpenChange={setIsSelecting}>
        <DialogContent className='max-h-[90vh] overflow-y-auto min-w-3/4'>
          <DialogHeader>
            <DialogTitle>Chọn đáp án</DialogTitle>
            <DialogDescription>Chọn đáp án</DialogDescription>
          </DialogHeader>
          <div className='mt-4'>
            <SelectAnswer
              onChange={(data) => {
                setAnswers((prevState) => [data, ...prevState])
                setIsSelecting(false)
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
