import { LangProps } from '@/types/langProps'
import { z } from 'zod'

export const adjustmentSchema = (lang: LangProps) =>
  z.object({
    username: z
      .string()
      .min(4, lang?.form?.username_min)
      .max(12, lang?.form?.username_max)
      .regex(
        /^[a-zA-Z0-9._-]+$/,
        lang?.form?.username_invalid || 'Username can only contain Latin letters, numbers, and special characters (._-)'
      ),
    nickname: z
      .string()
      .min(2, lang?.form?.nickname_min)
      .regex(/^[가-힣]+$/, lang?.form?.nickname_invalid || 'Nickname can only contain Korean characters')
      .max(12, lang?.form?.nickname_max)
  })

export type AdjustmentFormData = z.infer<ReturnType<typeof adjustmentSchema>>
