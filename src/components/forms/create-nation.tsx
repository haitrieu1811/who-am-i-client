/* eslint-disable @typescript-eslint/no-unused-expressions */
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import { Loader2, UploadCloud } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import nationsApis, { type CreateNationResponse } from '~/apis/nations.apis'
import InputFile from '~/components/input-file'
import { Button } from '~/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Skeleton } from '~/components/ui/skeleton'
import useUploadImage from '~/hooks/use-upload-image'
import type { NationItem } from '~/types/nations.types'

const createNationSchema = z.object({
  name: z.string().min(1, 'Tên quốc gia là bắt buộc.')
})

type CreateNationSchema = z.infer<typeof createNationSchema>

type CreateNationFormProps = {
  nationData?: NationItem | null
  onCreateSuccess?: (data: AxiosResponse<CreateNationResponse>) => void
  onUpdateSuccess?: (data: AxiosResponse<CreateNationResponse>) => void
}

export default function CreateNationForm({ nationData, onCreateSuccess, onUpdateSuccess }: CreateNationFormProps) {
  const isUpdateMode = !!nationData

  const [flagFile, setFlagFile] = React.useState<File | null>(null)

  const flagPreview = React.useMemo(() => (flagFile ? URL.createObjectURL(flagFile) : null), [flagFile])

  const form = useForm<CreateNationSchema>({
    resolver: zodResolver(createNationSchema),
    defaultValues: {
      name: nationData ? nationData.name : ''
    }
  })

  const createNationMutation = useMutation({
    mutationKey: ['create-nation'],
    mutationFn: nationsApis.insertOne,
    onSuccess: (data) => {
      toast.success(data.data.message)
      form.reset()
      setFlagFile(null)
      onCreateSuccess && onCreateSuccess(data)
    }
  })

  const updateNationMutation = useMutation({
    mutationKey: ['update-nation'],
    mutationFn: nationsApis.updateOne,
    onSuccess: (data) => {
      toast.success(data.data.message)
      form.reset()
      setFlagFile(null)
      onUpdateSuccess && onUpdateSuccess(data)
    }
  })

  const { uploadImageMutation } = useUploadImage()

  const isPending = createNationMutation.isPending || uploadImageMutation.isPending || updateNationMutation.isPending

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!flagFile && !isUpdateMode) return
    let defaultFlagId = nationData?.flag._id ?? ''
    if (flagFile) {
      const form = new FormData()
      form.append('image', flagFile)
      const uploadImageRes = await uploadImageMutation.mutateAsync(form)
      const { _id: flagId } = uploadImageRes.data.data.images[0]
      defaultFlagId = flagId
    }
    const body = {
      flag: defaultFlagId,
      name: data.name
    }
    if (!isUpdateMode) {
      createNationMutation.mutate(body)
      return
    }
    updateNationMutation.mutate({
      body,
      nationId: nationData._id
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
              <FormLabel>Tên quốc gia</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Quốc kỳ */}
        <div className='space-y-2'>
          <Label>Quốc kỳ</Label>
          {!flagPreview && !isUpdateMode && <Skeleton className='size-16 rounded-full' />}
          {(flagPreview || isUpdateMode) && (
            <img src={flagPreview || nationData?.flag.url} alt='' className='size-16 rounded-full object-cover' />
          )}
          {!flagFile && form.formState.isSubmitted && !isUpdateMode && (
            <p className='text-sm text-destructive'>Quốc kỳ là bắt buộc</p>
          )}
          <InputFile
            onChange={(files) => {
              if (!files) return
              setFlagFile(files[0])
            }}
          >
            <Button type='button' variant='outline'>
              <UploadCloud className='size-4' />
              {!flagFile && !isUpdateMode && 'Tải quốc kỳ lên'}
              {flagFile && !isUpdateMode && 'Thay đổi quốc kỳ'}
              {isUpdateMode && 'Thay đổi quốc kỳ'}
            </Button>
          </InputFile>
        </div>
        <Button type='submit' disabled={isPending} className='w-full'>
          {isPending && <Loader2 className='size-4 animate-spin' />}
          {!isUpdateMode ? 'Thêm quốc gia' : 'Cập nhật quốc gia'}
        </Button>
      </form>
    </Form>
  )
}
