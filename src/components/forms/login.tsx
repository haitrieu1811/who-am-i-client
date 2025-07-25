import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import isEmpty from 'lodash/isEmpty'
import { Loader2 } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import usersApis from '~/apis/users.apis'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { AppContext } from '~/contexts/app.context'
import { cn, isEntityError } from '~/lib/utils'
import { loginSchema, type LoginSchema } from '~/rules/users.rules'
import type { ErrorResponse } from '~/types/utils.types'

export default function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const { setIsAuthenticated, setUser } = React.useContext(AppContext)

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: usersApis.login,
    onSuccess: (data) => {
      toast.success(data.data.message)
      setIsAuthenticated(true)
      setUser(data.data.data.user)
    },
    onError: (error) => {
      if (isEntityError<ErrorResponse<LoginSchema>>(error)) {
        const formErrors = error.response?.data.errors
        if (!isEmpty(formErrors)) {
          Object.keys(formErrors).forEach((key) => {
            form.setError(key as keyof LoginSchema, {
              message: formErrors[key as keyof LoginSchema],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  const handleSubmit = form.handleSubmit((data) => {
    loginMutation.mutate(data)
  })

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>Chào mừng trở lại</CardTitle>
          <CardDescription>Điền thông tin chính xác để đăng nhập</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit}>
              <div className='grid gap-6'>
                {/* Tên đăng nhập */}
                <FormField
                  control={form.control}
                  name='username'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên đăng nhập</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Mật khẩu */}
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <Input type='password' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type='submit' disabled={loginMutation.isPending} className='w-full'>
                  {loginMutation.isPending && <Loader2 className='size-4 animate-spin' />}
                  Đăng nhập
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
