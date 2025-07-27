/* eslint-disable @typescript-eslint/no-unused-expressions */
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import { Loader2, UploadCloud } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import leaguesApis from '~/apis/leagues.apis'
import InputFile from '~/components/input-file'
import { Button } from '~/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Skeleton } from '~/components/ui/skeleton'
import useUploadImage from '~/hooks/use-upload-image'
import type { CreateLeagueResponse, LeagueItem } from '~/types/leagues.types'

const createLeagueSchema = z.object({
  name: z.string().min(1, 'Tên giải đấu là bắt buộc.')
})

type CreateLeagueSchema = z.infer<typeof createLeagueSchema>

type CreateLeagueFormProps = {
  leagueData?: LeagueItem | null
  onCreateSuccess?: (data: AxiosResponse<CreateLeagueResponse>) => void
  onUpdateSuccess?: (data: AxiosResponse<CreateLeagueResponse>) => void
}

export default function CreateLeagueForm({ leagueData, onCreateSuccess, onUpdateSuccess }: CreateLeagueFormProps) {
  const isUpdateMode = !!leagueData

  const [logoFile, setLogoFile] = React.useState<File | null>(null)

  const logoPreview = React.useMemo(() => (logoFile ? URL.createObjectURL(logoFile) : null), [logoFile])

  const form = useForm<CreateLeagueSchema>({
    resolver: zodResolver(createLeagueSchema),
    defaultValues: {
      name: leagueData?.name ?? ''
    }
  })

  const createLeagueMutation = useMutation({
    mutationKey: ['create-league'],
    mutationFn: leaguesApis.insertOne,
    onSuccess: (data) => {
      toast.success(data.data.message)
      form.reset()
      setLogoFile(null)
      onCreateSuccess && onCreateSuccess(data)
    }
  })

  const updateLeagueMutation = useMutation({
    mutationKey: ['update-league'],
    mutationFn: leaguesApis.updateOne,
    onSuccess: (data) => {
      toast.success(data.data.message)
      form.reset()
      setLogoFile(null)
      onUpdateSuccess && onUpdateSuccess(data)
    }
  })

  const { uploadImageMutation } = useUploadImage()

  const isPending = uploadImageMutation.isPending || createLeagueMutation.isPending || updateLeagueMutation.isPending

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!logoFile && !isUpdateMode) return
    let defaultLogoId = leagueData?.logo._id ?? ''
    if (logoFile) {
      const form = new FormData()
      form.append('image', logoFile)
      const uploadImageRes = await uploadImageMutation.mutateAsync(form)
      const { _id: logoId } = uploadImageRes.data.data.images[0]
      defaultLogoId = logoId
    }
    const body = {
      logo: defaultLogoId,
      name: data.name
    }
    if (!isUpdateMode) {
      createLeagueMutation.mutate(body)
      return
    }
    updateLeagueMutation.mutate({
      body,
      leagueId: leagueData._id
    })
  })

  return (
    <Form {...form}>
      <form className='space-y-6' onSubmit={handleSubmit}>
        {/* Tên */}
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên giải đấu</FormLabel>
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
            <img src={logoPreview || leagueData?.logo.url} alt='' className='size-16 rounded-full object-cover' />
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
        <Button type='submit' disabled={isPending} className='w-full'>
          {isPending && <Loader2 className='size-4 animate-spin' />}
          {!isUpdateMode ? 'Thêm giải đấu' : 'Cập nhật giải đấu'}
        </Button>
      </form>
    </Form>
  )
}
