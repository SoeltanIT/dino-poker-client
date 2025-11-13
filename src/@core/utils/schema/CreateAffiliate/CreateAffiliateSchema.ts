import { LangProps } from '@/types/langProps'
import { z } from 'zod'

export const CreateAffiliateSchema = (lang: LangProps) =>
  z.object({
    code_name: z
      .string()
      .min(2, { message: lang?.form?.code_name_min || 'Code name must be at least 2 characters' })
      .max(30, { message: lang?.form?.code_name_max || 'Code name must be at most 30 characters' })
      .regex(
        /^[a-zA-Z0-9._-]+$/,
        lang?.form?.code_name_invalid ||
          'Code name can only contain Latin letters, numbers, and special characters (._-)'
      ),
    nickname: z
      .string()
      .min(2, lang?.form?.nickname_min)
      .regex(/^[가-힣]+$/, lang?.form?.nickname_invalid || 'Nickname can only contain Korean characters')
      .max(12, lang?.form?.nickname_max),
    username: z
      .string()
      .min(4, lang?.form?.username_min)
      .max(12, lang?.form?.username_max)
      .regex(
        /^[a-zA-Z0-9._-]+$/,
        lang?.form?.username_invalid || 'Username can only contain Latin letters, numbers, and special characters (._-)'
      ),
    password: z
      .string()
      .min(4, { message: lang?.form?.password_min || 'Password must be at least 4 characters' })
      .max(15, { message: lang?.form?.password_max || 'Password must be at most 15 characters' }),
    bank_name: z.string().min(1, { message: lang?.form?.bank_name_required || 'Bank name is required' }),
    bank_account_number: z
      .string()
      .min(8, { message: lang?.form?.bank_account_min || 'Account number must be at least 8 characters' })
      .max(20, { message: lang?.form?.bank_account_max || 'Account number must be at most 20 characters' })
      .regex(/^\d+$/, { message: lang?.form?.bank_account_numeric || 'Account number must contain only numbers' }),
    parent_code: z.string().optional()
  })

export type CreateAffiliateType = z.infer<ReturnType<typeof CreateAffiliateSchema>>
