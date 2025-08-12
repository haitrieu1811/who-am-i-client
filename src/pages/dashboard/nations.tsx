import { useMutation } from '@tanstack/react-query'
import { EllipsisVertical, Loader2, PlusCircle } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

import nationsApis from '~/apis/nations.apis'
import CreateNationForm from '~/components/forms/create-nation'
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
import useNations from '~/hooks/use-nations'
import useSearchQuery from '~/hooks/use-search-query'
import type { NationItem } from '~/types/nations.types'

export default function DashboardNationsPage() {
  const [isCreatingNew, setIsCreatingNew] = React.useState<boolean>(false)
  const [currentNation, setCurrentNation] = React.useState<NationItem | null>(null)
  const [currentDeletingId, setCurrentDeletingId] = React.useState<string | null>(null)

  const searchQuery = useSearchQuery()
  const page = searchQuery.page

  const { getNationsQuery, nations, totalNations, pagination } = useNations({
    page,
    limit: '24'
  })

  const deleteNationMutation = useMutation({
    mutationKey: ['delete-nation'],
    mutationFn: nationsApis.deleteOne,
    onSuccess: (data) => {
      toast.success(data.data.message)
      getNationsQuery.refetch()
    }
  })

  const handleDeleteNation = () => {
    if (!currentDeletingId) return
    deleteNationMutation.mutate(currentDeletingId)
  }

  return (
    <React.Fragment>
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h1 className='text-xl font-medium tracking-tight'>Quản lý quốc gia</h1>
          <Button variant='outline' onClick={() => setIsCreatingNew(true)}>
            <PlusCircle className='size-4' />
            Thêm quốc gia mới
          </Button>
        </div>
        {/* Danh sách quốc gia */}
        {totalNations > 0 && !getNationsQuery.isFetching && (
          <div className='grid grid-cols-12 gap-4'>
            {nations.map((nation) => (
              <div key={nation._id} className='col-span-2'>
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
                        <DropdownMenuItem onClick={() => setCurrentNation(nation)}>Chi tiết</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCurrentDeletingId(nation._id)}>Xóa</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <Avatar className='size-16'>
                    <AvatarImage src={nation.flag.url} alt={nation.name} />
                  </Avatar>
                  <div className='text-center text-sm font-medium'>{nation.name}</div>
                  <div className='text-xs text-muted-foreground'>100 cầu thủ</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Loading */}
        {getNationsQuery.isFetching && (
          <div className='flex justify-center items-center p-10'>
            <Loader2 className='size-10 animate-spin stroke-1' />
          </div>
        )}
        {/* Phân trang */}
        {pagination && pagination.totalPages > 0 && <PaginationV2 totalPages={pagination.totalPages} />}
      </div>
      {/* Thêm quốc gia mới */}
      <Dialog open={isCreatingNew} onOpenChange={setIsCreatingNew}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm quốc gia mới</DialogTitle>
          </DialogHeader>
          <div className='mt-4'>
            <CreateNationForm
              onCreateSuccess={() => {
                setIsCreatingNew(false)
                getNationsQuery.refetch()
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
      {/* Cập nhật quốc gia */}
      <Dialog
        open={!!currentNation}
        onOpenChange={(value) => {
          if (!value) setCurrentNation(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật quốc gia</DialogTitle>
          </DialogHeader>
          <div className='mt-4'>
            <CreateNationForm
              nationData={currentNation}
              onUpdateSuccess={() => {
                setCurrentNation(null)
                getNationsQuery.refetch()
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
      {/* Xác nhận xóa quốc gia */}
      <AlertDialog
        open={!!currentDeletingId}
        onOpenChange={(value) => {
          if (!value) setCurrentDeletingId(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa quốc gia này?</AlertDialogTitle>
            <AlertDialogDescription> Quốc gia sẽ bị xóa vĩnh viễn và không thể khôi phục.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteNation}>Tiếp tục</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  )
}
