import { useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react'
import React from 'react'

import CreateNationForm from '~/components/forms/create-nation'
import SearchBox from '~/components/search-box'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Skeleton } from '~/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import useDebounce from '~/hooks/use-debounce'
import useLeagues from '~/hooks/use-leagues'
import useNations from '~/hooks/use-nations'
import useTeams from '~/hooks/use-teams'
import { cn } from '~/lib/utils'
import type { LeagueItem } from '~/types/leagues.types'
import type { NationItem } from '~/types/nations.types'
import type { TeamItem } from '~/types/teams.types'

const NATIONS_LIMIT = 20

type PlayerFiltersProps = {
  defaultNation?: NationItem
  defaultLeague?: LeagueItem
  defaultTeam?: TeamItem
  onNationChange: (nation: NationItem) => void
  onLeagueChange: (league: LeagueItem) => void
  onTeamChange: (team: TeamItem | undefined) => void
}

export default function PlayerFilters({
  defaultNation,
  defaultLeague,
  defaultTeam,
  onNationChange,
  onLeagueChange,
  onTeamChange
}: PlayerFiltersProps) {
  const queryClient = useQueryClient()

  const [nationName, setNationName] = React.useState<string>('')
  const [nationPage, setNationPage] = React.useState<number>(1)
  const [nationId, setNationId] = React.useState<string | undefined>(defaultNation?._id)
  const [leagueId, setLeagueId] = React.useState<string | undefined>(defaultLeague?._id)
  const [teamId, setTeamId] = React.useState<string | undefined>(defaultTeam?._id)
  const [isCreatingNewNation, setIsCreatingNewNation] = React.useState<boolean>(false)

  const debounceNationName = useDebounce(nationName, 1000)

  const { nations, getNationsQuery, pagination, totalNations } = useNations({
    page: nationPage.toString(),
    limit: NATIONS_LIMIT.toString(),
    name: debounceNationName.trim() ? debounceNationName.trim() : undefined
  })

  const { leagues } = useLeagues()
  const { teams, totalTeams } = useTeams({
    enabled: !!leagueId,
    leagueId
  })

  const handleChangeNationName = (name: string) => {
    setNationName(name)
    setNationPage(1)
  }

  const handleNationChange = (nation: NationItem) => {
    setNationId(nation._id)
    onNationChange(nation)
  }

  const handleLeagueChange = (league: LeagueItem) => {
    setLeagueId(league._id)
    setTeamId(undefined)
    onTeamChange(undefined)
    onLeagueChange(league)
  }

  const handleTeamChange = (team: TeamItem) => {
    setTeamId(team._id)
    onTeamChange(team)
  }

  return (
    <React.Fragment>
      <Tabs defaultValue='nationality' className='w-full gap-4'>
        <TabsList>
          <TabsTrigger value='nationality'>Quốc tịch</TabsTrigger>
          <TabsTrigger value='league'>Giải đấu</TabsTrigger>
          <TabsTrigger value='team'>Câu lạc bộ</TabsTrigger>
        </TabsList>
        {/* Quốc tịch */}
        <TabsContent value='nationality'>
          <div className='space-y-4'>
            <div className='flex justify-between items-center space-x-2'>
              <div className='flex-1'>
                <SearchBox placeholder='Tìm quốc gia...' onChange={handleChangeNationName} />
              </div>
              <Button variant='outline' size='icon' onClick={() => setIsCreatingNewNation(true)}>
                <PlusCircle className='size-4' />
              </Button>
            </div>
            {/* Danh sách quốc gia */}
            {totalNations > 0 && !getNationsQuery.isFetching && (
              <div className='grid grid-cols-12 gap-4'>
                {nations.map((nation) => (
                  <div
                    key={nation._id}
                    className={cn(
                      'col-span-3 border-2 rounded-md flex flex-col justify-center items-center p-4 space-y-4 bg-secondary duration-100',
                      {
                        'hover:cursor-pointer': nation._id !== nationId,
                        'border-primary pointer-events-none': nation._id === nationId
                      }
                    )}
                    onClick={() => handleNationChange(nation)}
                  >
                    <img src={nation.flag.url} alt={nation.name} className='size-6 object-contain' />
                    <span className='text-center text-[13px] font-medium'>{nation.name}</span>
                  </div>
                ))}
              </div>
            )}
            {/* Loading */}
            {getNationsQuery.isFetching && (
              <div className='grid grid-cols-12 gap-4'>
                {Array(NATIONS_LIMIT)
                  .fill(0)
                  .map((_, index) => (
                    <Skeleton key={index} className='col-span-3 aspect-square' />
                  ))}
              </div>
            )}
            {/* Phân trang */}
            {(pagination?.totalPages ?? 1) > 1 && !getNationsQuery.isFetching && (
              <div className='flex justify-between items-center space-x-10'>
                <div className='text-sm text-muted-foreground'>
                  Trang {pagination?.page} trên {pagination?.totalPages}
                </div>
                <div className='flex items-center space-x-2'>
                  <Button
                    size='sm'
                    variant='outline'
                    disabled={nationPage === 1}
                    onClick={() => setNationPage((prevState) => (prevState -= 1))}
                  >
                    <ChevronLeft />
                    Trước
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    disabled={nationPage === pagination?.totalPages}
                    onClick={() => setNationPage((prevState) => (prevState += 1))}
                  >
                    Sau
                    <ChevronRight />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        {/* Giải đấu */}
        <TabsContent value='league'>
          <div className='space-y-4'>
            {/* Danh sách giải đấu */}
            <div className='grid grid-cols-12 gap-4'>
              {leagues.map((league) => (
                <div
                  key={league._id}
                  className={cn(
                    'col-span-3 border-2 rounded-md flex flex-col justify-center items-center p-4 space-y-4 bg-secondary duration-100',
                    {
                      'hover:cursor-pointer': league._id !== leagueId,
                      'border-primary pointer-events-none': league._id === leagueId
                    }
                  )}
                  onClick={() => handleLeagueChange(league)}
                >
                  <img src={league.logo.url} alt={league.name} className='size-6 object-contain' />
                  <span className='text-center text-[13px] font-medium'>{league.name}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        {/* CLB */}
        <TabsContent value='team'>
          <div className='space-y-4'>
            {/* Danh sách CLB */}
            {totalTeams > 0 && (
              <div className='grid grid-cols-12 gap-4'>
                {teams.map((team) => (
                  <div
                    key={team._id}
                    className={cn(
                      'col-span-3 border-2 rounded-md flex flex-col justify-center items-center p-4 space-y-4 bg-secondary duration-100',
                      {
                        'hover:cursor-pointer': team._id !== teamId,
                        'border-primary pointer-events-none': team._id === teamId
                      }
                    )}
                    onClick={() => handleTeamChange(team)}
                  >
                    <img src={team.logo.url} alt={team.name} className='size-6 object-contain' />
                    <span className='text-center text-[13px] font-medium'>{team.name}</span>
                  </div>
                ))}
              </div>
            )}
            {totalTeams === 0 && <div className='text-sm'>Vui lòng chọn giải đấu trước.</div>}
          </div>
        </TabsContent>
      </Tabs>
      {/* Thêm quốc gia mới */}
      <Dialog open={isCreatingNewNation} onOpenChange={setIsCreatingNewNation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm quốc gia mới</DialogTitle>
          </DialogHeader>
          <div className='mt-4'>
            <CreateNationForm
              onCreateSuccess={() => {
                setIsCreatingNewNation(false)
                queryClient.invalidateQueries({
                  queryKey: ['get-nations']
                })
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
