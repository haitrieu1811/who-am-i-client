import { Flag, Loader2, RotateCcw, Trophy } from 'lucide-react'
import React from 'react'
import { useSearchParams } from 'react-router-dom'

import SearchBox from '~/components/search-box'
import { Button } from '~/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'
import { PlayerPosition } from '~/constants/enum'
import useLeagues from '~/hooks/use-leagues'
import useNations from '~/hooks/use-nations'
import useTeams from '~/hooks/use-teams'
import { cn } from '~/lib/utils'
import type { LeagueItem } from '~/types/leagues.types'
import type { NationItem } from '~/types/nations.types'
import type { TeamItem } from '~/types/teams.types'

type DashboardPlayersFilterProps = {
  setSearchKeyword: React.Dispatch<React.SetStateAction<string>>
  currentFilterNation: NationItem | undefined
  setCurrentFilterNation: React.Dispatch<React.SetStateAction<NationItem | undefined>>
  currentFilterLeague: LeagueItem | undefined
  setCurrentFilterLeague: React.Dispatch<React.SetStateAction<LeagueItem | undefined>>
  currentFilterTeam: TeamItem | undefined
  setCurrentFilterTeam: React.Dispatch<React.SetStateAction<TeamItem | undefined>>
  currentFilterPosition: PlayerPosition | undefined
  setCurrentFilterPosition: React.Dispatch<React.SetStateAction<PlayerPosition | undefined>>
}

export default function DashboardPlayersFilter({
  setSearchKeyword,
  currentFilterNation,
  setCurrentFilterNation,
  currentFilterLeague,
  setCurrentFilterLeague,
  currentFilterTeam,
  setCurrentFilterTeam,
  currentFilterPosition,
  setCurrentFilterPosition
}: DashboardPlayersFilterProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  const { nations, getNationsQuery, totalNations } = useNations({
    limit: '200'
  })
  const { leagues, getLeaguesQuery } = useLeagues()
  const { teams, totalTeams, getTeamsQuery } = useTeams({
    enabled: !!currentFilterLeague,
    leagueId: currentFilterLeague?._id
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilter = ({ value, field }: { value?: any; field: 'league' | 'team' | 'position' | 'nation' }) => {
    searchParams.delete('page')
    setSearchParams(searchParams)
    switch (field) {
      case 'nation':
        setCurrentFilterNation(value)
        if (!currentFilterLeague) {
          setCurrentFilterTeam(undefined)
        }
        break
      case 'league':
        setCurrentFilterLeague(value)
        setCurrentFilterTeam(undefined)
        break
      case 'team':
        setCurrentFilterTeam(value)
        break
      case 'position':
        if (value === undefined) setCurrentFilterPosition(undefined)
        else setCurrentFilterPosition(Number(value))
        if (!currentFilterLeague) {
          setCurrentFilterTeam(undefined)
        }
        break
      default:
        break
    }
  }

  return (
    <React.Fragment>
      <div className='space-y-4'>
        {/* Tìm kiếm */}
        <div className='w-[300px]'>
          <SearchBox placeholder='Tìm kiếm cầu thủ...' onChange={(value) => setSearchKeyword(value)} />
        </div>
        <div className='flex items-center space-x-2'>
          {/* Vị trí */}
          <div className='flex items-center space-x-2'>
            {[
              {
                value: PlayerPosition.Gk.toString(),
                name: 'Thủ môn',
                shortName: 'GK'
              },
              {
                value: PlayerPosition.Df.toString(),
                name: 'Hậu vệ',
                shortName: 'DF'
              },
              {
                value: PlayerPosition.Mf.toString(),
                name: 'Tiền vệ',
                shortName: 'MF'
              },
              {
                value: PlayerPosition.Fw.toString(),
                name: 'Tiền đạo',
                shortName: 'FW'
              }
            ].map((item) => (
              <Tooltip key={item.value}>
                <TooltipTrigger asChild>
                  <Button
                    size='icon'
                    variant={currentFilterPosition === Number(item.value) ? 'default' : 'outline'}
                    onClick={() => handleFilter({ field: 'position', value: item.value })}
                  >
                    <div
                      className={cn({
                        'text-yellow-500': Number(item.value) === PlayerPosition.Gk,
                        'text-blue-500': Number(item.value) === PlayerPosition.Df,
                        'text-green-500': Number(item.value) === PlayerPosition.Mf,
                        'text-red-500': Number(item.value) === PlayerPosition.Fw
                      })}
                    >
                      {item.shortName}
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{item.name}</TooltipContent>
              </Tooltip>
            ))}
            {currentFilterPosition !== undefined && (
              <Button variant='outline' onClick={() => setCurrentFilterPosition(undefined)}>
                <RotateCcw className='size-4' />
                Đặt lại
              </Button>
            )}
          </div>
          {/* Quốc tịch */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant='outline'>
                {!currentFilterNation ? (
                  <React.Fragment>
                    <Flag className='size-4' />
                    <span>Quốc tịch</span>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <img
                      src={currentFilterNation.flag.url}
                      alt={currentFilterNation.name}
                      className='size-4 object-cover'
                    />
                    <span>{currentFilterNation.name}</span>
                  </React.Fragment>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align='start' className='max-h-[400px] overflow-y-auto'>
              {totalNations > 0 && !getNationsQuery.isFetching && (
                <div className='space-y-2'>
                  <div className='grid grid-cols-12 gap-2'>
                    {nations.map((nation) => (
                      <div key={nation._id} className='col-span-2'>
                        <Button
                          size='icon'
                          variant={currentFilterNation?._id === nation._id ? 'default' : 'outline'}
                          title={nation.name}
                          onClick={() => handleFilter({ field: 'nation', value: nation })}
                        >
                          <img src={nation.flag.url} alt={nation.name} className='size-6' />
                        </Button>
                      </div>
                    ))}
                  </div>
                  {currentFilterNation?._id !== undefined && (
                    <div className='flex justify-end'>
                      <Button variant='outline' onClick={() => handleFilter({ field: 'nation' })}>
                        <RotateCcw className='size-4' />
                        Đặt lại
                      </Button>
                    </div>
                  )}
                </div>
              )}
              {getNationsQuery.isFetching && (
                <div className='flex items-center justify-center p-10'>
                  <Loader2 className='size-6 animate-spin stroke-1' />
                </div>
              )}
            </PopoverContent>
          </Popover>
          {/* Giải đấu */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant='outline'>
                {!currentFilterLeague ? (
                  <React.Fragment>
                    <Trophy className='size-4' />
                    <span>Giải đấu</span>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <img
                      src={currentFilterLeague.logo.url}
                      alt={currentFilterLeague.name}
                      className='size-4 object-cover'
                    />
                    <span>{currentFilterLeague.name}</span>
                  </React.Fragment>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align='start' className='max-h-[400px] overflow-y-auto'>
              {!getLeaguesQuery.isFetching && (
                <div className='space-y-2'>
                  <div className='grid grid-cols-12 gap-2'>
                    {leagues.map((league) => (
                      <div key={league._id} className='col-span-2'>
                        <Button
                          size='icon'
                          variant={currentFilterLeague?._id === league._id ? 'default' : 'outline'}
                          title={league.name}
                          onClick={() => handleFilter({ field: 'league', value: league })}
                        >
                          <img src={league.logo.url} alt={league.name} className='size-6' />
                        </Button>
                      </div>
                    ))}
                  </div>
                  {currentFilterLeague?._id !== undefined && (
                    <div className='flex justify-end'>
                      <Button variant='outline' onClick={() => handleFilter({ field: 'league' })}>
                        <RotateCcw className='size-4' />
                        Đặt lại
                      </Button>
                    </div>
                  )}
                </div>
              )}
              {getNationsQuery.isFetching && (
                <div className='flex items-center justify-center p-10'>
                  <Loader2 className='size-6 animate-spin stroke-1' />
                </div>
              )}
            </PopoverContent>
          </Popover>
          {/* CLB */}
          {totalTeams > 0 && !getTeamsQuery.isFetching && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant='outline'>
                  {!currentFilterTeam ? (
                    <React.Fragment>
                      <Trophy className='size-4' />
                      <span>Câu lạc bộ</span>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <img
                        src={currentFilterTeam.logo.url}
                        alt={currentFilterTeam.name}
                        className='size-4 object-cover'
                      />
                      <span>{currentFilterTeam.name}</span>
                    </React.Fragment>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align='start' className='max-h-[400px] overflow-y-auto'>
                {!getTeamsQuery.isFetching && (
                  <div className='space-y-2'>
                    <div className='grid grid-cols-12 gap-2'>
                      {teams.map((team) => (
                        <div key={team._id} className='col-span-2'>
                          <Button
                            size='icon'
                            variant={currentFilterTeam?._id === team._id ? 'default' : 'outline'}
                            title={team.name}
                            onClick={() => handleFilter({ field: 'team', value: team })}
                          >
                            <img src={team.logo.url} alt={team.name} className='size-6' />
                          </Button>
                        </div>
                      ))}
                    </div>
                    {currentFilterTeam?._id !== undefined && (
                      <div className='flex justify-end'>
                        <Button variant='outline' onClick={() => handleFilter({ field: 'team' })}>
                          <RotateCcw className='size-4' />
                          Đặt lại
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                {getNationsQuery.isFetching && (
                  <div className='flex items-center justify-center p-10'>
                    <Loader2 className='size-6 animate-spin stroke-1' />
                  </div>
                )}
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </React.Fragment>
  )
}
