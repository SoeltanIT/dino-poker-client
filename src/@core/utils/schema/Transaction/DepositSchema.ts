// utils/schema/Transaction/DepositSchema.ts

import { z } from 'zod'
import { LangProps } from '@/types/langProps'

export const DepositSchema = (lang?: LangProps) =>
  z.object({
    amount: z
      .string()
      .min(1, { message: lang?.form?.deposit_amount_required || 'Amount is required' })
      .regex(/^\d+$/, { message: lang?.form?.deposit_amount_number || 'Only numbers are allowed' })
      .refine(val => parseInt(val, 10) >= 10000, {
        message: lang?.form?.deposit_amount_min || 'Minimum amount is 10,000 KRW'
      })
      .refine(val => parseInt(val, 10) <= 9000000, {
        message: lang?.form?.deposit_amount_max || 'Maximum amount is 9,000,000 KRW'
      }),

    // password: z.string().min(1, { message: lang?.form?.deposit_password_required || 'Password is required' }),

    account: z.string().optional(),
    promo_id: z.string().optional()
  })

export type DepositFormData = z.infer<ReturnType<typeof DepositSchema>>
