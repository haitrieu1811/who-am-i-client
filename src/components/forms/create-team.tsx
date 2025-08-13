/* eslint-disable @typescript-eslint/no-unused-expressions */
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import { Loader2, UploadCloud } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import teamsApis from '~/apis/teams.apis'
import InputFile from '~/components/input-file'
import { Avatar, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Skeleton } from '~/components/ui/skeleton'
import useLeagues from '~/hooks/use-leagues'
import useUploadImage from '~/hooks/use-upload-image'
import type { CreateTeamResponse, TeamItem } from '~/types/teams.types'

const createTeamSchema = z.object({
  name: z.string().min(1, 'Tên câu lạc bộ là bắt buộc.'),
  leagueId: z.string('Vui lòng chọn giải đấu.')
})

type CreateTeamSchema = z.infer<typeof createTeamSchema>

type CreateTeamFormProps = {
  teamData?: TeamItem | null
  onCreateSuccess?: (data: AxiosResponse<CreateTeamResponse>) => void
  onUpdateSuccess?: (data: AxiosResponse<CreateTeamResponse>) => void
}

export default function CreateTeamForm({ teamData, onCreateSuccess, onUpdateSuccess }: CreateTeamFormProps) {
  const isUpdateMode = !!teamData

  const [logoFile, setLogoFile] = React.useState<File | null>(null)

  const logoPreview = React.useMemo(() => (logoFile ? URL.createObjectURL(logoFile) : null), [logoFile])

  const { leagues } = useLeagues()

  const { uploadImageMutation } = useUploadImage()

  const form = useForm<CreateTeamSchema>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: teamData?.name ?? '',
      leagueId: teamData?.league._id
    }
  })

  const createTeamMutation = useMutation({
    mutationKey: ['create-team'],
    mutationFn: teamsApis.insertOne,
    onSuccess: (data) => {
      form.reset()
      setLogoFile(null)
      toast.success(data.data.message)
      onCreateSuccess && onCreateSuccess(data)
    }
  })

  const updateTeamMutation = useMutation({
    mutationKey: ['update-team'],
    mutationFn: teamsApis.updateOne,
    onSuccess: (data) => {
      form.reset()
      setLogoFile(null)
      toast.success(data.data.message)
      onUpdateSuccess && onUpdateSuccess(data)
    }
  })

  const isPending = uploadImageMutation.isPending || createTeamMutation.isPending || updateTeamMutation.isPending

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!logoFile && !isUpdateMode) return
    let defaultLogoId = teamData?.logo._id ?? ''
    if (logoFile) {
      const form = new FormData()
      form.append('image', logoFile)
      const uploadImageRes = await uploadImageMutation.mutateAsync(form)
      const { _id: logoId } = uploadImageRes.data.data.images[0]
      defaultLogoId = logoId
    }
    const body = {
      logo: defaultLogoId,
      name: data.name,
      leagueId: data.leagueId
    }
    if (!isUpdateMode) {
      createTeamMutation.mutate(body)
      return
    }
    updateTeamMutation.mutate({
      body,
      teamId: teamData._id
    })
  })

  return (
    <Form {...form}>
      <form className='space-y-6' onSubmit={handleSubmit}>
        {/* Tên câu lạc bộ */}
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên câu lạc bộ</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Logo */}
        <div className='space-y-2'>
          <Label>Logo</Label>
          {!logoPreview && !isUpdateMode && <Skeleton className='size-16 rounded-full' />}
          {(logoPreview || isUpdateMode) && (
            <img src={logoPreview || teamData?.logo.url} alt='' className='size-16 object-cover' />
          )}
          {!logoFile && form.formState.isSubmitted && !isUpdateMode && (
            <p className='text-sm text-destructive'>Logo là bắt buộc</p>
          )}
          <InputFile
            onChange={(files) => {
              if (!files) return
              setLogoFile(files[0])
            }}
          >
            <Button type='button' variant='outline'>
              <UploadCloud className='size-4' />
              {!logoFile && !isUpdateMode && 'Tải logo lên'}
              {logoFile && !isUpdateMode && 'Thay đổi logo'}
              {isUpdateMode && 'Thay đổi logo'}
            </Button>
          </InputFile>
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
        <Button type='submit' disabled={isPending} className='w-full'>
          {isPending && <Loader2 className='size-4 animate-spin' />}
          {!isUpdateMode ? 'Thêm câu lạc bộ' : 'Cập nhật câu lạc bộ'}
        </Button>
      </form>
    </Form>
  )
}
