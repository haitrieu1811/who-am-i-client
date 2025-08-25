import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import React from 'react'

import SelectItem from '~/components/game/select-item'
import { Button } from '~/components/ui/button'
import { AppContext } from '~/contexts/app.context'
import useLeagues from '~/hooks/use-leagues'
import usePlayers from '~/hooks/use-players'
import useTeams from '~/hooks/use-teams'
import type { PlayerItem } from '~/types/players.types'

type SelectAnswerProps = {
  onChange: (data: PlayerItem) => void
}

export default function SelectAnswer({ onChange }: SelectAnswerProps) {
  const { currentLeague, setCurrentLeague, currentTeam, setCurrentTeam, page, setPage } = React.useContext(AppContext)

  const containerRef = React.useRef<HTMLDivElement>(null)

  const { leagues } = useLeagues()
  const { teams, totalTeams, getTeamsQuery } = useTeams({
    leagueId: currentLeague?._id,
    enabled: !!currentLeague
  })
  const { getPlayersQuery, players, totalPlayers, totalPages, pagination } = usePlayers({
    enabled: !!currentLeague || !!currentTeam,
    leagueId: currentLeague?._id,
    teamId: currentTeam?._id,
    page: page.toString()
  })

  return (
    <div
      ref={containerRef}
      className='grid grid-cols-12 gap-6 w-[1000px] md:w-auto max-w-[1000px] md:max-w-none overflow-x-auto'
    >
      {/* Chọn giải đấu */}
      <div className='col-span-4 space-y-4'>
        <h3 className='text-center font-semibold'>Giải đấu</h3>
        <div className='grid grid-cols-12 gap-4'>
          {leagues.map((league) => (
            <div key={league._id} className='col-span-6'>
              <SelectItem
                name={league.name}
                logo={league.logo.url}
                isActive={league._id === currentLeague?._id}
                onClick={() => {
                  setCurrentLeague(league)
                  setCurrentTeam(null)
                }}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Chọn CLB */}
      <div className='col-span-4 space-y-4'>
        <h3 className='text-center font-semibold'>Câu lạc bộ</h3>
        {!getTeamsQuery.isFetching && totalTeams > 0 && (
          <div className='grid grid-cols-12 gap-4'>
            {teams.map((team) => (
              <div key={team._id} className='col-span-6'>
                <SelectItem
                  name={team.name}
                  logo={team.logo.url}
                  isActive={team._id === currentTeam?._id}
                  onClick={() => {
                    setCurrentTeam(team)
                    setPage(1)
                    containerRef.current?.scrollIntoView({
                      behavior: 'smooth'
                    })
                  }}
                />
              </div>
            ))}
          </div>
        )}
        {getTeamsQuery.isFetching && (
          <div className='flex justify-center items-center p-10'>
            <Loader2 className='size-10 animate-spin stroke-1' />
          </div>
        )}
        {!getTeamsQuery.isFetching && totalTeams === 0 && (
          <div className='text-center text-sm text-muted-foreground'>Không có câu lạc bộ nào.</div>
        )}
      </div>
      {/* Chọn cầu thủ */}
      <div className='col-span-4 space-y-4'>
        <h3 className='text-center font-semibold'>Cầu thủ</h3>
        {!getPlayersQuery.isFetching && totalPlayers > 0 && (
          <div className='space-y-4'>
            <div className='grid grid-cols-12 gap-4'>
              {players.map((player) => (
                <div key={player._id} className='col-span-6'>
                  <SelectItem name={player.name} logo={player.team.logo.url} onClick={() => onChange(player)} />
                </div>
              ))}
            </div>
            {/* Phân trang */}
            {totalPages > 1 && (
              <div className='flex justify-between items-center space-x-2'>
                <div className='font-medium text-sm'>
                  Trang {pagination?.page} trên {totalPages}
                </div>
                <div className='flex items-center space-x-1'>
                  <Button
                    disabled={pagination?.page === 1}
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      setPage((prevState) => (prevState -= 1))
                      containerRef.current?.scrollIntoView({
                        behavior: 'smooth'
                      })
                    }}
                  >
                    <ChevronLeft className='size-4' />
                    Trước
                  </Button>
                  <Button
                    disabled={pagination?.page === totalPages}
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      setPage((prevState) => (prevState += 1))
                      containerRef.current?.scrollIntoView({
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
          <div className='flex justify-center items-center p-10'>
            <Loader2 className='size-10 animate-spin stroke-1' />
          </div>
        )}
        {/* Không có cầu thủ */}
        {!getPlayersQuery.isFetching && totalPlayers === 0 && (
          <div className='text-center text-sm text-muted-foreground'>Không có cầu thủ nào.</div>
        )}
      </div>
    </div>
  )
}
