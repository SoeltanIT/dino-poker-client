import { LangProps } from '@/types/langProps'
import { z } from 'zod'

export const usernameAdjustmentSchema = (lang: LangProps) =>
  z.object({
    username: z
      .string()
      .min(2, lang?.form?.username_min)
      .max(30, lang?.form?.username_max)
      .regex(
        /^[a-zA-Z0-9._-]+$/,
        lang?.form?.username_invalid || 'Username can only contain Latin letters, numbers, and special characters (._-)'
      )
  })

export type UsernameAdjustmentFormData = z.infer<ReturnType<typeof usernameAdjustmentSchema>>
