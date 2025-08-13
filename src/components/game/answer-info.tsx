import React from 'react'
import { cn } from '~/lib/utils'

type AnswerInfoProps = {
  isTrue: boolean
  children: React.ReactNode
  hintMessage?: string
}

export default function AnswerInfo({ isTrue, children, hintMessage }: AnswerInfoProps) {
  return (
    <div className='space-y-1 w-full'>
      <div
        className={cn('w-full aspect-square rounded-md p-3 border-2 flex justify-center items-center', {
          'border-border': !isTrue,
          'border-green-500 bg-green-500/10': isTrue
        })}
      >
        {children}
      </div>
      {isTrue && <p className='text-green-500 text-xs text-center font-medium'>Đúng</p>}
      {hintMessage && !isTrue && <p className='text-xs text-center font-medium'>{hintMessage}</p>}
    </div>
  )
}
