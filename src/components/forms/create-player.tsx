/* eslint-disable @typescript-eslint/no-unused-expressions */
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import { format } from 'date-fns'
import { CalendarIcon, Loader2, PlusCircle, UploadCloud } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import playersApis, { type CreatePlayerReqBody } from '~/apis/players.apis'
import CreateNationForm from '~/components/forms/create-nation'
import InputFile from '~/components/input-file'
import { Avatar, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Skeleton } from '~/components/ui/skeleton'
import { PlayerPosition } from '~/constants/enum'
import useLeagues from '~/hooks/use-leagues'
import useNations from '~/hooks/use-nations'
import useTeams from '~/hooks/use-teams'
import useUploadImage from '~/hooks/use-upload-image'
import { cn } from '~/lib/utils'
import { createPlayerSchema, type CreatePlayerSchema } from '~/rules/players.rules'
import type { CreatePlayerResponse, PlayerItem } from '~/types/players.types'

type CreatePlayerFormProps = {
  playerData?: PlayerItem | null
  onCreateSuccess?: (data: AxiosResponse<CreatePlayerResponse>) => void
  onUpdateSuccess?: (data: AxiosResponse<CreatePlayerResponse>) => void
}

export default function CreatePlayerForm({ playerData, onCreateSuccess, onUpdateSuccess }: CreatePlayerFormProps) {
  const isUpdateMode = !!playerData

  const [avatarFile, setAvatarFile] = React.useState<File | null>(null)
  const [isCreatingNewNation, setIsCreatingNewNation] = React.useState<boolean>(false)

  const avatarPreview = React.useMemo(() => (avatarFile ? URL.createObjectURL(avatarFile) : null), [avatarFile])

  const form = useForm<CreatePlayerSchema>({
    resolver: zodResolver(createPlayerSchema),
    defaultValues: {
      name: playerData?.name ?? '',
      nationId: playerData?.nation._id,
      leagueId: playerData?.league._id,
      teamId: playerData?.team._id,
      position: playerData?.position.toString(),
      shirtNumber: playerData?.shirtNumber.toString(),
      dateOfBirth: playerData?.dateOfBirth ? new Date(playerData.dateOfBirth) : new Date()
    }
  })

  const leagueId = form.watch('leagueId')

  const { nations, getNationsQuery } = useNations({
    limit: '1000'
  })
  const { leagues } = useLeagues()
  const { teams } = useTeams({
    limit: '1000',
    enabled: !!leagueId,
    leagueId
  })
  const { uploadImageMutation } = useUploadImage()

  React.useEffect(() => {
    form.resetField('teamId')
  }, [form, leagueId])

  const createPlayerMutation = useMutation({
    mutationKey: ['create-player'],
    mutationFn: playersApis.insertOne,
    onSuccess: (data) => {
      toast.success(data.data.message)
      // form.reset()
      setAvatarFile(null)
      onCreateSuccess && onCreateSuccess(data)
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
    const body: CreatePlayerReqBody = {
      ...data,
      avatar: playerData?.avatar._id ?? null,
      shirtNumber: Number(data.shirtNumber),
      position: Number(data.position)
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
                {!avatarFile && !isUpdateMode && 'Tải ảnh đại diện lên'}
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
                  <Input {...field} />
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
          {/* Quốc tịch */}
          <div className='space-y-2'>
            <FormField
              control={form.control}
              name='nationId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quốc tịch</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Vui lòng chọn quốc tịch' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {nations.map((nation) => (
                        <SelectItem key={nation._id} value={nation._id}>
                          <Avatar className='size-4'>
                            <AvatarImage src={nation.flag.url} alt={nation.name} />
                          </Avatar>
                          {nation.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-end'>
              <Button type='button' variant='outline' size='sm' onClick={() => setIsCreatingNewNation(true)}>
                <PlusCircle className='size-4' />
                Thêm quốc gia mới
              </Button>
            </div>
          </div>
          {/* Giải đấu */}
          <FormField
            control={form.control}
            name='leagueId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giải đấu</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Vui lòng chọn giải đấu' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {leagues.map((league) => (
                      <SelectItem key={league._id} value={league._id}>
                        <Avatar className='size-4'>
                          <AvatarImage src={league.logo.url} alt={league.name} />
                        </Avatar>
                        {league.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Câu lạc bộ */}
          <FormField
            control={form.control}
            name='teamId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Câu lạc bộ</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Vui lòng chọn câu lạc bộ' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team._id} value={team._id}>
                        <Avatar className='size-4'>
                          <AvatarImage src={team.logo.url} alt={team.name} />
                        </Avatar>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
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
                          <RadioGroupItem value={item.value} />
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
                getNationsQuery.refetch()
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
