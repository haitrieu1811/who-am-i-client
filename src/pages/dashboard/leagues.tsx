import { useMutation } from '@tanstack/react-query'
import { EllipsisVertical, PlusCircle } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

import leaguesApis from '~/apis/leagues.apis'
import CreateLeagueForm from '~/components/forms/create-league'
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
import useLeagues from '~/hooks/use-leagues'
import type { LeagueItem } from '~/types/leagues.types'

export default function DashboardLeaguesPage() {
  const [isCreatingNew, setIsCreatingNew] = React.useState<boolean>(false)
  const [currentLeague, setCurrentLeague] = React.useState<LeagueItem | null>(null)
  const [currentDeletingId, setCurrentDeletingId] = React.useState<string | null>(null)

  const { getLeaguesQuery, leagues } = useLeagues()

  const deleteLeagueMutation = useMutation({
    mutationKey: ['delete-league'],
    mutationFn: leaguesApis.deleteOne,
    onSuccess: (data) => {
      toast.success(data.data.message)
      getLeaguesQuery.refetch()
    }
  })

  const handleDeleteLeague = () => {
    if (!currentDeletingId) return
    deleteLeagueMutation.mutate(currentDeletingId)
  }

  return (
    <React.Fragment>
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h1 className='text-xl font-medium tracking-tight'>Quản lý giải đấu</h1>
          <Button variant='outline' onClick={() => setIsCreatingNew(true)}>
            <PlusCircle className='size-4' />
            Thêm giải đấu mới
          </Button>
        </div>
        {/* Danh sách giải đấu */}
        <div className='grid grid-cols-12 gap-4'>
          {leagues.map((league) => (
            <div key={league._id} className='col-span-2'>
              <div className='relative space-y-4 border p-4 rounded-md flex flex-col justify-center items-center bg-card group'>
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
                      <DropdownMenuItem onClick={() => setCurrentLeague(league)}>Chi tiết</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setCurrentDeletingId(league._id)}>Xóa</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Avatar className='size-16 rounded-none'>
                  <AvatarImage src={league.logo.url} alt={league.name} />
                </Avatar>
                <div className='text-center text-sm font-medium'>{league.name}</div>
                <div className='text-xs text-muted-foreground'>100 cầu thủ</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Thêm giải đấu mới */}
      <Dialog open={isCreatingNew} onOpenChange={setIsCreatingNew}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm giải đấu mới</DialogTitle>
          </DialogHeader>
          <div className='mt-4'>
            <CreateLeagueForm
              onCreateSuccess={() => {
                setIsCreatingNew(false)
                getLeaguesQuery.refetch()
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
      {/* Cập nhật giải đấu */}
      <Dialog
        open={!!currentLeague}
        onOpenChange={(value) => {
          if (!value) setCurrentLeague(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật giải đấu</DialogTitle>
          </DialogHeader>
          <div className='mt-4'>
            <CreateLeagueForm
              leagueData={currentLeague}
              onUpdateSuccess={() => {
                setCurrentLeague(null)
                getLeaguesQuery.refetch()
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
      {/* Xác nhận xóa giải đấu */}
      <AlertDialog
        open={!!currentDeletingId}
        onOpenChange={(value) => {
          if (!value) setCurrentDeletingId(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa giải đấu này?</AlertDialogTitle>
            <AlertDialogDescription> Giải đấu sẽ bị xóa vĩnh viễn và không thể khôi phục.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLeague}>Tiếp tục</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  )
}
