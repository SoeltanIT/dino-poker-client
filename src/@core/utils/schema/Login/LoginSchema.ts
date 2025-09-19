import { LangProps } from '@/types/langProps'
import { z } from 'zod'

export const LoginSchema = (lang: LangProps) =>
  z.object({
    username: z
      .string({
        required_error: lang?.form?.username_required || 'Username is required'
      })
      .nonempty(lang?.form?.username_required || 'Username is required'),

    password: z
      .string({
        required_error: lang?.form?.password_required || 'Password is required'
      })
      .nonempty(lang?.form?.password_required || 'Password is required')
  })

export type LoginFormData = z.infer<ReturnType<typeof LoginSchema>>
