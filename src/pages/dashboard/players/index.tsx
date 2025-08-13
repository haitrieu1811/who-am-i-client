import { useMutation } from '@tanstack/react-query'
import { Loader2, PlusCircle } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

import playersApis from '~/apis/players.apis'
import CreatePlayerForm from '~/components/forms/create-player'
import PaginationV2 from '~/components/pagination'
import PlayerItem from '~/components/player-item'
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
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { PlayerPosition } from '~/constants/enum'
import useDebounce from '~/hooks/use-debounce'
import usePlayers from '~/hooks/use-players'
import useSearchQuery from '~/hooks/use-search-query'
import DashboardPlayersFilter from '~/pages/dashboard/players/filter'
import type { LeagueItem } from '~/types/leagues.types'
import type { NationItem } from '~/types/nations.types'
import type { PlayerItem as PlayerItemType } from '~/types/players.types'
import type { TeamItem } from '~/types/teams.types'

export default function DashboardPlayersPage() {
  const [isCreatingNew, setIsCreatingNew] = React.useState<boolean>(false)
  const [currentPlayer, setCurrentPlayer] = React.useState<PlayerItemType | null>(null)
  const [currentDeletingId, setCurrentDeletingId] = React.useState<string | null>(null)
  const [searchKeyword, setSearchKeyword] = React.useState<string>('')
  const [currentFilterPosition, setCurrentFilterPosition] = React.useState<PlayerPosition | undefined>(undefined)
  const [currentFilterNation, setCurrentFilterNation] = React.useState<NationItem | undefined>(undefined)
  const [currentFilterLeague, setCurrentFilterLeague] = React.useState<LeagueItem | undefined>(undefined)
  const [currentFilterTeam, setCurrentFilterTeam] = React.useState<TeamItem | undefined>(undefined)

  const debounceSearchKeyword = useDebounce(searchKeyword, 1000)

  const searchQuery = useSearchQuery()
  const page = searchQuery.page

  const { getPlayersQuery, players, totalPages, totalPlayers } = usePlayers({
    page,
    limit: '24',
    name: debounceSearchKeyword.trim() ? debounceSearchKeyword : undefined,
    nationId: currentFilterNation?._id,
    leagueId: currentFilterLeague?._id,
    teamId: currentFilterTeam?._id,
    position: currentFilterPosition?.toString()
  })

  const deletePlayerMutation = useMutation({
    mutationKey: ['delete-player'],
    mutationFn: playersApis.deleteOne,
    onSuccess: (data) => {
      toast.success(data.data.message)
      getPlayersQuery.refetch()
    }
  })

  const handleDeletePlayer = () => {
    if (!currentDeletingId) return
    deletePlayerMutation.mutate(currentDeletingId)
  }

  return (
    <React.Fragment>
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center space-x-4'>
            <h1 className='text-xl font-medium tracking-tight'>Quản lý cầu thủ</h1>
            <Badge variant='outline'>{totalPlayers} cầu thủ</Badge>
          </div>
          <Button variant='outline' onClick={() => setIsCreatingNew(true)}>
            <PlusCircle className='size-4' />
            Thêm cầu thủ mới
          </Button>
        </div>
        {/* Bộ lọc */}
        <DashboardPlayersFilter
          setSearchKeyword={setSearchKeyword}
          currentFilterNation={currentFilterNation}
          setCurrentFilterNation={setCurrentFilterNation}
          currentFilterLeague={currentFilterLeague}
          setCurrentFilterLeague={setCurrentFilterLeague}
          currentFilterTeam={currentFilterTeam}
          setCurrentFilterTeam={setCurrentFilterTeam}
          currentFilterPosition={currentFilterPosition}
          setCurrentFilterPosition={setCurrentFilterPosition}
        />
        {/* Danh sách cầu thủ */}
        {totalPlayers > 0 && !getPlayersQuery.isFetching && (
          <div className='grid grid-cols-12 gap-4'>
            {players.map((player) => (
              <div key={player._id} className='col-span-2'>
                <PlayerItem
                  playerData={player}
                  onDetail={() => setCurrentPlayer(player)}
                  onDelete={() => setCurrentDeletingId(player._id)}
                />
              </div>
            ))}
          </div>
        )}
        {/* Không có cầu thủ */}
        {totalPlayers === 0 && !getPlayersQuery.isFetching && (
          <div className='font-medium'>Không tìm thấy cầu thủ nào.</div>
        )}
        {/* Loading */}
        {getPlayersQuery.isFetching && (
          <div className='p-10 flex justify-center items-center'>
            <Loader2 className='size-10 animate-spin stroke-1' />
          </div>
        )}
        {/* Phân trang */}
        {totalPages > 1 && !getPlayersQuery.isFetching && <PaginationV2 totalPages={totalPages} />}
      </div>
      {/* Thêm cầu thủ mới */}
      <Dialog open={isCreatingNew} onOpenChange={setIsCreatingNew}>
        <DialogContent className='max-h-[90vh] overflow-y-auto pb-0'>
          <DialogHeader>
            <DialogTitle>Thêm cầu thủ mới</DialogTitle>
          </DialogHeader>
          <div className='mt-4'>
            <CreatePlayerForm
              onCreateSuccess={() => {
                setIsCreatingNew(false)
                getPlayersQuery.refetch()
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
      {/* Cập nhật cầu thủ */}
      <Dialog
        open={!!currentPlayer}
        onOpenChange={(value) => {
          if (!value) setCurrentPlayer(null)
        }}
      >
        <DialogContent className='max-h-[90vh] overflow-y-auto pb-0'>
          <DialogHeader>
            <DialogTitle>Cập nhật cầu thủ</DialogTitle>
          </DialogHeader>
          <div className='mt-4'>
            <CreatePlayerForm
              playerData={currentPlayer}
              onUpdateSuccess={() => {
                setCurrentPlayer(null)
                getPlayersQuery.refetch()
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
      {/* Xóa cầu thủ */}
      <AlertDialog
        open={!!currentDeletingId}
        onOpenChange={(value) => {
          if (!value) setCurrentDeletingId(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa cầu thủ này?</AlertDialogTitle>
            <AlertDialogDescription>
              Thông tin cầu thủ sẽ bị xóa vĩnh viễn và không thể khôi phục.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePlayer}>Tiếp tục</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  )
}
