import { z } from 'zod'

export const userSchema = z.object({
  username: z.string().min(1, 'Tên đăng nhập là bắt buộc.'),
  password: z.string().min(1, 'Mật khẩu là bắt buộc.')
})

export const loginSchema = userSchema.pick({
  username: true,
  password: true
})

export type LoginSchema = z.infer<typeof loginSchema>
