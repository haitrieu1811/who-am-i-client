/* eslint-disable @typescript-eslint/no-unused-expressions */
import { ChevronLeft, ChevronRight, Funnel, Loader2, RotateCcw } from 'lucide-react'
import React from 'react'

import PlayerItem from '~/components/player-item'
import SearchBox from '~/components/search-box'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { AppContext } from '~/contexts/app.context'
import useDebounce from '~/hooks/use-debounce'
import useLeagues from '~/hooks/use-leagues'
import usePlayers from '~/hooks/use-players'
import useTeams from '~/hooks/use-teams'
import { DashboardQuestionsPageContext } from '~/pages/dashboard/questions'
import type { PlayerItem as PlayerItemType } from '~/types/players.types'

type SelectPlayerProps = {
  defaultValue?: PlayerItemType | null
  onChange?: (playerData: PlayerItemType) => void
}

export default React.memo(function SelectPlayer({ defaultValue, onChange }: SelectPlayerProps) {
  const { currentLeague, setCurrentLeague, currentTeam, setCurrentTeam, page, setPage } = React.useContext(AppContext)
  const { existedPlayerIds } = React.useContext(DashboardQuestionsPageContext)

  const [searchKeyword, setSearchKeyword] = React.useState<string>('')
  const [currentPlayer, setCurrentPlayer] = React.useState<PlayerItemType | null>(null)

  const listRef = React.useRef<HTMLDivElement>(null)

  const debounceSearchKeyword = useDebounce(searchKeyword, 1000)

  const { players, totalPlayers, getPlayersQuery, totalPages } = usePlayers({
    name: debounceSearchKeyword.trim() ? debounceSearchKeyword : undefined,
    enabled: !!(debounceSearchKeyword.trim() || currentLeague?._id || currentTeam?._id),
    leagueId: currentLeague?._id,
    teamId: currentTeam?._id,
    page: page.toString()
  })
  const { leagues } = useLeagues()
  const { teams, totalTeams, getTeamsQuery } = useTeams({
    leagueId: currentLeague?._id,
    enabled: !!currentLeague?._id
  })

  React.useEffect(() => {
    if (!currentPlayer) return
    onChange && onChange(currentPlayer)
  }, [currentPlayer, onChange])

  return (
    <div className='space-y-4'>
      <SearchBox placeholder='Tìm kiếm cầu thủ...' onChange={(value) => setSearchKeyword(value)} />
      {/* Bộ lọc */}
      <div className='flex items-center space-x-1'>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='outline'>
              <Funnel className='size-4' />
              Bộ lọc
            </Button>
          </PopoverTrigger>
          <PopoverContent align='start'>
            <div className='space-y-6'>
              {/* Lọc theo giải đấu */}
              <div className='space-y-3'>
                <Label>Giải đấu</Label>
                <div className='grid grid-cols-12 gap-2'>
                  {leagues.map((league) => (
                    <div key={league._id} className='col-span-2 flex justify-center items-center'>
                      <Button
                        size='icon'
                        variant={currentLeague?._id === league._id ? 'default' : 'outline'}
                        onClick={() => {
                          setCurrentLeague(league)
                          setCurrentTeam(null)
                          setPage(1)
                        }}
                      >
                        <img src={league.logo.url} alt={league.name} className='size-6 object-contain' />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              {/* Lọc theo CLB */}
              {totalTeams > 0 && !getTeamsQuery.isFetching && (
                <div className='space-y-3'>
                  <Label>Câu lạc bộ</Label>
                  <div className='grid grid-cols-12 gap-2'>
                    {teams.map((team) => (
                      <div key={team._id} className='col-span-2'>
                        <Button
                          size='icon'
                          variant={currentTeam?._id === team._id ? 'default' : 'outline'}
                          onClick={() => {
                            setCurrentTeam(team)
                            setPage(1)
                          }}
                        >
                          <img src={team.logo.url} alt={team.name} className='size-6 object-contain' />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {getTeamsQuery.isFetching && (
                <div className='flex justify-center'>
                  <Loader2 className='stroke-1 animate-spin' />
                </div>
              )}
              {/* Đặt lại bộ lọc */}
              {currentLeague?._id && (
                <div className='flex justify-end'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      setCurrentLeague(null)
                      setCurrentTeam(null)
                    }}
                  >
                    <RotateCcw className='size-4' />
                    Đặt lại bộ lọc
                  </Button>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {/* Danh sách cầu thủ */}
      <div ref={listRef}>
        {totalPlayers > 0 && !getPlayersQuery.isPending && (
          <div className='space-y-4'>
            <div className='grid grid-cols-12 gap-4'>
              {players.map((player) => (
                <div key={player._id} className='col-span-6'>
                  <PlayerItem
                    playerData={player}
                    isSelectMode
                    isActive={player._id === currentPlayer?._id || player._id === defaultValue?._id}
                    disabled={existedPlayerIds?.includes(player._id)}
                    onClick={(playerData) => setCurrentPlayer(playerData)}
                  />
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className='flex justify-between items-center space-x-10'>
                <div className='text-sm text-muted-foreground'>
                  Trang {page} trên {totalPages}
                </div>
                <div className='flex items-center space-x-1'>
                  <Button
                    variant='outline'
                    size='sm'
                    disabled={page === 1}
                    onClick={() => {
                      setPage((prevState) => (prevState -= 1))
                      listRef.current?.scrollIntoView({
                        behavior: 'smooth'
                      })
                    }}
                  >
                    <ChevronLeft className='size-4' />
                    Trước
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    disabled={page === totalPages}
                    onClick={() => {
                      setPage((prevState) => (prevState += 1))
                      listRef.current?.scrollIntoView({
                        behavior: 'smooth'
                      })
                    }}
                  >
                    Sau
                    <ChevronRight className='size-4' />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Loading */}
        {getPlayersQuery.isFetching && (
          <div className='flex justify-center'>
            <Loader2 className='stroke-1 animate-spin' />
          </div>
        )}
      </div>
      {/* Không tìm thấy cầu thủ */}
      {totalPlayers === 0 && !getPlayersQuery.isPending && (
        <div className='flex flex-col justify-center items-center space-y-2 p-6 pb-0 text-center text-sm'>
          <h3 className='font-semibold'>Không tìm thấy cầu thủ</h3>
          <p className='text-muted-foreground'>Không có cầu thủ nào trùng khớp với từ khóa "{debounceSearchKeyword}"</p>
        </div>
      )}
    </div>
  )
})
