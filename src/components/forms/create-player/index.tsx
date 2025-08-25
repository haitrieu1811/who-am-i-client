/* eslint-disable @typescript-eslint/no-unused-expressions */
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import { format } from 'date-fns'
import { CalendarIcon, Filter, Loader2, UploadCloud } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import playersApis, { type CreatePlayerReqBody } from '~/apis/players.apis'
import PlayerFilters from '~/components/forms/create-player/player-filters'
import InputFile from '~/components/input-file'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { Skeleton } from '~/components/ui/skeleton'
import { PlayerPosition } from '~/constants/enum'
import useUploadImage from '~/hooks/use-upload-image'
import { cn } from '~/lib/utils'
import { createPlayerSchema, type CreatePlayerSchema } from '~/rules/players.rules'
import type { LeagueItem } from '~/types/leagues.types'
import type { NationItem } from '~/types/nations.types'
import type { CreatePlayerResponse, PlayerItem } from '~/types/players.types'
import type { TeamItem } from '~/types/teams.types'

type CreatePlayerFormProps = {
  playerData?: PlayerItem | null
  onCreateSuccess?: (data: AxiosResponse<CreatePlayerResponse>) => void
  onUpdateSuccess?: (data: AxiosResponse<CreatePlayerResponse>) => void
}

export default function CreatePlayerForm({ playerData, onCreateSuccess, onUpdateSuccess }: CreatePlayerFormProps) {
  const queryClient = useQueryClient()

  const isUpdateMode = !!playerData

  const [isOpenPlayerFilters, setIsOpenPlayerFilters] = React.useState<boolean>(false)

  const [avatarFile, setAvatarFile] = React.useState<File | null>(null)

  const [nation, setNation] = React.useState<NationItem | undefined>(undefined)
  const [league, setLeague] = React.useState<LeagueItem | undefined>(undefined)
  const [team, setTeam] = React.useState<TeamItem | undefined>(undefined)

  React.useEffect(() => {
    if (!playerData) return
    setNation(playerData.nation)
    setLeague(playerData.league)
    setTeam(playerData.team)
  }, [playerData])

  const avatarPreview = React.useMemo(() => (avatarFile ? URL.createObjectURL(avatarFile) : null), [avatarFile])

  const form = useForm<CreatePlayerSchema>({
    resolver: zodResolver(createPlayerSchema),
    defaultValues: {
      name: playerData?.name ?? '',
      position: playerData?.position.toString(),
      shirtNumber: playerData?.shirtNumber.toString(),
      dateOfBirth: playerData?.dateOfBirth ? new Date(playerData.dateOfBirth) : new Date()
    }
  })

  const { uploadImageMutation } = useUploadImage()

  // const handleReset = () => {
  //   form.reset()
  //   setAvatarFile(null)
  //   setNation(undefined)
  //   setLeague(undefined)
  //   setTeam(undefined)
  // }

  const createPlayerMutation = useMutation({
    mutationKey: ['create-player'],
    mutationFn: playersApis.insertOne,
    onSuccess: (data) => {
      toast.success(data.data.message)
      onCreateSuccess && onCreateSuccess(data)
      queryClient.invalidateQueries({
        queryKey: ['get-players']
      })
    }
  })

  const updatePlayerMutation = useMutation({
    mutationKey: ['update-player'],
    mutationFn: playersApis.updateOne,
    onSuccess: (data) => {
      toast.success(data.data.message)
      form.reset()
      setAvatarFile(null)
      onUpdateSuccess && onUpdateSuccess(data)
    }
  })

  const isPending = uploadImageMutation.isPending || createPlayerMutation.isPending || updatePlayerMutation.isPending

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!nation || !league || !team) return
    const body: CreatePlayerReqBody = {
      ...data,
      avatar: playerData?.avatar._id ?? null,
      shirtNumber: Number(data.shirtNumber),
      position: Number(data.position),
      nationId: nation._id,
      leagueId: league._id,
      teamId: team._id
    }
    if (avatarFile) {
      const form = new FormData()
      form.append('image', avatarFile)
      const res = await uploadImageMutation.mutateAsync(form)
      const { _id: avatarId } = res.data.data.images[0]
      body.avatar = avatarId
    }
    if (!isUpdateMode) {
      createPlayerMutation.mutate(body)
      return
    }
    updatePlayerMutation.mutate({
      body,
      playerId: playerData._id
    })
  })

  return (
    <React.Fragment>
      <Form {...form}>
        <form className='space-y-6 relative' onSubmit={handleSubmit}>
          {/* Avatar */}
          <div className='space-y-2 flex items-center flex-col'>
            {!avatarPreview && !isUpdateMode && <Skeleton className='size-16 rounded-full' />}
            {(avatarPreview || isUpdateMode) && (
              <img src={avatarPreview || playerData?.avatar.url} alt='' className='size-16 rounded-full object-cover' />
            )}
            <InputFile
              onChange={(files) => {
                if (!files) return
                setAvatarFile(files[0])
              }}
            >
              <Button type='button' variant='outline'>
                <UploadCloud className='size-4' />
                {!avatarFile && !isUpdateMode && 'Tải ảnh đại diện'}
                {avatarFile && !isUpdateMode && 'Thay đổi ảnh đại diện'}
                {isUpdateMode && 'Thay đổi ảnh đại diện'}
              </Button>
            </InputFile>
          </div>
          {/* Tên cầu thủ */}
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên cầu thủ</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Số áo */}
          <FormField
            control={form.control}
            name='shirtNumber'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số áo</FormLabel>
                <FormControl>
                  <Input defaultValue={field.value} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Ngày sinh */}
          <FormField
            control={form.control}
            name='dateOfBirth'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Ngày sinh</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                      >
                        {field.value ? format(field.value, 'PPP') : <span>Chọn một ngày</span>}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                      captionLayout='dropdown'
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>Ngày sinh sẽ được dùng tính toán cho tuổi.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Quốc tịch, giải đấu, CLB */}
          <div className='space-y-3 border-2 rounded-md p-4'>
            <div className='flex flex-col space-y-2'>
              {/* Quốc tịch */}
              <Badge variant='outline' className='p-2 gap-2'>
                <span>Quốc tịch:</span>
                {nation && (
                  <div className='inline-flex gap-1'>
                    <img src={nation.flag.url} alt={nation.name} className='size-4 object-contain' />
                    <span className='text-xs font-medium'>{nation.name}</span>
                  </div>
                )}
                {!nation && form.formState.isSubmitted && (
                  <span className='text-destructive'>Vui lòng chọn quốc tịch</span>
                )}
              </Badge>
              {/* Giải đấu */}
              <Badge variant='outline' className='p-2 gap-2'>
                <span>Giải đấu:</span>
                {league && (
                  <div className='inline-flex gap-1'>
                    <img src={league.logo.url} alt={league.name} className='size-4 object-contain' />
                    <span className='text-xs font-medium'>{league.name}</span>
                  </div>
                )}
                {!league && form.formState.isSubmitted && (
                  <span className='text-destructive'>Vui lòng chọn giải đấu</span>
                )}
              </Badge>
              {/* CLB */}
              <Badge variant='outline' className='p-2 gap-2'>
                <span>Câu lạc bộ:</span>
                {team && (
                  <div className='inline-flex gap-1'>
                    <img src={team.logo.url} alt={team.name} className='size-4 object-contain' />
                    <span className='text-xs font-medium'>{team.name}</span>
                  </div>
                )}
                {!team && form.formState.isSubmitted && (
                  <span className='text-destructive'>Vui lòng chọn câu lạc bộ</span>
                )}
              </Badge>
            </div>
            <Button type='button' variant='outline' onClick={() => setIsOpenPlayerFilters(true)}>
              <Filter className='size-4' />
              Bộ lọc cầu thủ
            </Button>
          </div>
          {/* Vị trí thi đấu */}
          <FormField
            control={form.control}
            name='position'
            render={({ field }) => (
              <FormItem className='space-y-3'>
                <FormLabel>Vị trí thi đấu</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className='flex flex-col'>
                    {[
                      {
                        label: 'Thủ môn',
                        value: PlayerPosition.Gk.toString(),
                        position: 'GK'
                      },
                      {
                        label: 'Hậu vệ',
                        value: PlayerPosition.Df.toString(),
                        position: 'DF'
                      },
                      {
                        label: 'Tiền vệ',
                        value: PlayerPosition.Mf.toString(),
                        position: 'MF'
                      },
                      {
                        label: 'Tiền đạo',
                        value: PlayerPosition.Fw.toString(),
                        position: 'FW'
                      }
                    ].map((item) => (
                      <FormItem key={item.value} className='flex items-center gap-3'>
                        <FormControl>
                          <RadioGroupItem value={item.value} checked={item.value === form.watch('position')} />
                        </FormControl>
                        <FormLabel className='font-normal'>
                          <div
                            className={cn('font-semibold', {
                              'text-yellow-500': item.value === PlayerPosition.Gk.toString(),
                              'text-blue-500': item.value === PlayerPosition.Df.toString(),
                              'text-green-500': item.value === PlayerPosition.Mf.toString(),
                              'text-red-500': item.value === PlayerPosition.Fw.toString()
                            })}
                          >
                            {item.position}
                          </div>
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='sticky bottom-0 inset-x-0 bg-background pb-6'>
            <Button disabled={isPending} type='submit' className='w-full'>
              {isPending && <Loader2 className='size-4 animate-spin' />}
              {!isUpdateMode ? 'Thêm cầu thủ' : 'Cập nhật cầu thủ'}
            </Button>
          </div>
        </form>
      </Form>
      {/* Chọn quốc tịch, giải đấu, CLB */}
      <Dialog open={isOpenPlayerFilters} onOpenChange={setIsOpenPlayerFilters}>
        <DialogContent className='max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Bộ lọc cầu thủ</DialogTitle>
            <DialogDescription>Chọn quốc tịch, giải đấu, câu lạc bộ</DialogDescription>
          </DialogHeader>
          <PlayerFilters
            defaultNation={nation}
            defaultLeague={league}
            defaultTeam={team}
            onNationChange={setNation}
            onLeagueChange={setLeague}
            onTeamChange={setTeam}
          />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
