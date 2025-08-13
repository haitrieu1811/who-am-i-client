import { useMutation } from '@tanstack/react-query'
import { EllipsisVertical, Loader2, PlusCircle, Trophy } from 'lucide-react'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

import teamsApis from '~/apis/teams.apis'
import CreateTeamForm from '~/components/forms/create-team'
import PaginationV2 from '~/components/pagination'
import SearchBox from '~/components/search-box'
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
import { Label } from '~/components/ui/label'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'
import useDebounce from '~/hooks/use-debounce'
import useLeagues from '~/hooks/use-leagues'
import useSearchQuery from '~/hooks/use-search-query'
import useTeams from '~/hooks/use-teams'
import type { TeamItem } from '~/types/teams.types'

export default function DashboardTeamsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [isCreatingNew, setIsCreatingNew] = React.useState<boolean>(false)
  const [currentTeam, setCurrentTeam] = React.useState<TeamItem | null>(null)
  const [currentDeletingId, setCurrentDeletingId] = React.useState<string | null>(null)
  const [searchValue, searchSearchValue] = React.useState<string>('')
  const [currentFilterLeagueId, setCurrentFilterLeagueId] = React.useState<string | undefined>(undefined)

  const debounceSearchValue = useDebounce(searchValue, 1000)

  const searchQuery = useSearchQuery()
  const page = searchQuery.page

  const { getTeamsQuery, teams, totalTeams, totalPages } = useTeams({
    page,
    name: debounceSearchValue,
    leagueId: currentFilterLeagueId
  })

  const deleteTeamMutation = useMutation({
    mutationKey: ['delete-team'],
    mutationFn: teamsApis.deleteOne,
    onSuccess: (data) => {
      toast.success(data.data.message)
      getTeamsQuery.refetch()
    }
  })

  const handleDeleteTeam = () => {
    if (!currentDeletingId) return
    deleteTeamMutation.mutate(currentDeletingId)
  }

  const handleFilterByLeague = (leagueId?: string) => {
    setCurrentFilterLeagueId(leagueId)
    searchParams.delete('page')
    setSearchParams(searchParams)
  }

  const { leagues } = useLeagues()

  return (
    <React.Fragment>
      <div className='space-y-8'>
        <div className='flex justify-between items-center'>
          <h1 className='text-xl font-medium tracking-tight'>Quản lý câu lạc bộ</h1>
          <Button variant='outline' onClick={() => setIsCreatingNew(true)}>
            <PlusCircle className='size-4' />
            Thêm câu lạc bộ mới
          </Button>
        </div>
        <div className='space-y-4'>
          {/* Tìm kiếm */}
          <div className='w-[300px]'>
            <SearchBox placeholder='Tìm kiếm câu lạc bộ...' onChange={(value) => searchSearchValue(value)} />
          </div>
          {/* Lọc theo giải đấu */}
          <div className='flex flex-wrap items-center space-x-2'>
            <Label>Giải đấu</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size='icon'
                  variant={currentFilterLeagueId === undefined ? 'default' : 'outline'}
                  onClick={() => handleFilterByLeague(undefined)}
                >
                  <Trophy className='size-4 stroke-1' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Tất cả giải đấu</TooltipContent>
            </Tooltip>
            {leagues.map((league) => (
              <Tooltip key={league._id}>
                <TooltipTrigger asChild>
                  <Button
                    size='icon'
                    variant={currentFilterLeagueId === league._id ? 'default' : 'outline'}
                    onClick={() => handleFilterByLeague(league._id)}
                  >
                    <img src={league.logo.url} alt={league.name} className='size-6' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{league.name}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
        {/* Danh sách CLB */}
        {totalTeams > 0 && !getTeamsQuery.isFetching && (
          <div className='grid grid-cols-12 gap-4'>
            {teams.map((team) => (
              <div key={team._id} className='col-span-2'>
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
                        <DropdownMenuItem onClick={() => setCurrentTeam(team)}>Chi tiết</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCurrentDeletingId(team._id)}>Xóa</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <Avatar className='size-16 rounded-none'>
                    <AvatarImage src={team.logo.url} alt={team.name} />
                  </Avatar>
                  <div className='text-center text-sm font-medium'>{team.name}</div>
                  <div className='text-xs text-muted-foreground'>100 cầu thủ</div>
                  <div className='flex items-center space-x-1'>
                    <Avatar className='size-4'>
                      <AvatarImage src={team.league.logo} alt={team.league.name} />
                    </Avatar>
                    <div className='text-xs'>{team.league.name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Loading */}
        {getTeamsQuery.isFetching && (
          <div className='flex justify-center p-10'>
            <Loader2 className='size-10 stroke-1 animate-spin' />
          </div>
        )}
        {/* Không có CLB nào */}
        {totalTeams === 0 && !getTeamsQuery.isFetching && (
          <div className='font-medium'>Không tìm thấy câu lạc bộ nào.</div>
        )}
        {/* Phân trang */}
        {totalPages > 1 && !getTeamsQuery.isFetching && <PaginationV2 totalPages={totalPages} />}
      </div>
      {/* Thêm câu lạc bộ mới */}
      <Dialog open={isCreatingNew} onOpenChange={setIsCreatingNew}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm câu lạc bộ mới</DialogTitle>
          </DialogHeader>
          <div className='mt-4'>
            <CreateTeamForm
              onCreateSuccess={() => {
                setIsCreatingNew(false)
                getTeamsQuery.refetch()
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
      {/* Cập nhật câu lạc bộ */}
      <Dialog
        open={!!currentTeam}
        onOpenChange={(value) => {
          if (!value) setCurrentTeam(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật câu lạc bộ</DialogTitle>
          </DialogHeader>
          <div className='mt-4'>
            <CreateTeamForm
              teamData={currentTeam}
              onUpdateSuccess={() => {
                setCurrentTeam(null)
                getTeamsQuery.refetch()
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
      {/* Xác nhận xóa câu lạc bộ */}
      <AlertDialog
        open={!!currentDeletingId}
        onOpenChange={(value) => {
          if (!value) setCurrentDeletingId(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa câu lạc bộ này?</AlertDialogTitle>
            <AlertDialogDescription>Câu lạc bộ sẽ bị xóa vĩnh viễn và không thể khôi phục.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTeam}>Tiếp tục</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  )
}
