import { z } from 'zod'
import { LangProps } from '@/types/langProps'

export const CreateAffiliateSchema = (lang: LangProps) =>
  z.object({
    code_name: z
      .string()
      .min(2, { message: lang?.form?.username_min || 'Code name must be at least 2 characters' })
      .max(30, { message: lang?.form?.username_max || 'Code name must be at most 30 characters' }),
    username: z
      .string()
      .min(2, { message: lang?.form?.username_min || 'Username must be at least 2 characters' })
      .max(30, { message: lang?.form?.username_max || 'Username must be at most 30 characters' }),
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
    parent_code: z.string().optional(),
    commission: z
      .number({
        required_error: 'Commission is required',
        invalid_type_error: 'Commission must be a number'
      })
      .min(0, { message: 'Commission must be at least 0' })
      .max(100, { message: 'Commission cannot exceed 100' })
  })

export type CreateAffiliateType = z.infer<ReturnType<typeof CreateAffiliateSchema>>
