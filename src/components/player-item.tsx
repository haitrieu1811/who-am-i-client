/* eslint-disable @typescript-eslint/no-unused-expressions */
import { EllipsisVertical } from 'lucide-react'

import { Avatar, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import { PlayerPosition } from '~/constants/enum'
import { cn } from '~/lib/utils'
import type { PlayerItem as PlayerItemType } from '~/types/players.types'

type PlayerItemProps = {
  playerData: PlayerItemType
  isSelectMode?: boolean
  isActive?: boolean
  disabled?: boolean
  onDetail?: () => void
  onDelete?: () => void
  onClick?: (playerData: PlayerItemType) => void
}

export default function PlayerItem({
  playerData,
  isSelectMode = false,
  isActive = false,
  disabled = false,
  onDetail,
  onDelete,
  onClick
}: PlayerItemProps) {
  const handleClick = () => {
    if (!isSelectMode) return
    onClick && onClick(playerData)
  }

  return (
    <div className='relative rounded-md overflow-hidden'>
      {disabled && <div className='absolute inset-0 bg-muted/80 z-10 cursor-not-allowed' />}
      <div
        className={cn('relative border rounded-md bg-muted group overflow-hidden duration-100', {
          'hover:cursor-pointer': isSelectMode,
          'border-primary pointer-events-none': isActive
        })}
        onClick={handleClick}
      >
        <div className='p-4 space-y-4 flex flex-col justify-center items-center'>
          {(onDetail || onDelete) && (
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
                  {onDetail && <DropdownMenuItem onClick={onDetail}>Chi tiết</DropdownMenuItem>}
                  {onDelete && <DropdownMenuItem onClick={onDelete}>Xóa</DropdownMenuItem>}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <div className='relative p-1 border rounded-full'>
            <Avatar className='size-16'>
              <AvatarImage src={playerData.avatar.url} alt={playerData.name} />
            </Avatar>
            <div className='size-6 rounded-full flex justify-center items-center text-sm font-semibold bg-primary text-primary-foreground absolute bottom-0 right-0'>
              {playerData.shirtNumber}
            </div>
          </div>
          <div className='text-center text-sm font-medium'>{playerData.name}</div>
          <div className='flex justify-center items-center space-x-1'>
            <Avatar className='size-4'>
              <AvatarImage src={playerData.team.logo.url} alt={playerData.team.name} />
            </Avatar>
            <div className='text-xs text-center'>{playerData.team.name}</div>
          </div>
        </div>
        <div className='bg-background p-2 flex justify-between items-center space-x-4'>
          <div
            className={cn('font-semibold text-sm', {
              'text-yellow-500': playerData.position === PlayerPosition.Gk,
              'text-blue-500': playerData.position === PlayerPosition.Df,
              'text-green-500': playerData.position === PlayerPosition.Mf,
              'text-red-500': playerData.position === PlayerPosition.Fw
            })}
          >
            {playerData.position === PlayerPosition.Gk && 'GK'}
            {playerData.position === PlayerPosition.Df && 'DF'}
            {playerData.position === PlayerPosition.Mf && 'MF'}
            {playerData.position === PlayerPosition.Fw && 'FW'}
          </div>
          <div className='flex items-center space-x-1'>
            <Avatar className='size-4'>
              <AvatarImage src={playerData.nation.flag.url} alt={playerData.nation.name} />
            </Avatar>
            <div className='text-xs text-muted-foreground'>{playerData.nation.name}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
