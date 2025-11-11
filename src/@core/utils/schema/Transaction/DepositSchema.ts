// utils/schema/Transaction/DepositSchema.ts

import { LangProps } from '@/types/langProps'
import { thousandSeparatorComma } from '@/utils/helper/formatNumber'
import { z } from 'zod'

const formatMaxMsg = (template: string | undefined, max: number) => {
  const display = thousandSeparatorComma(max)
  if (!template) return `Maximum amount is ${display}원`
  // Replace all occurrences of MAX safely
  return template.replace(/MAX/g, display)
}

export const DepositSchema = (lang?: LangProps, maxValue: number = 90000000) =>
  z.object({
    amount: z
      .string()
      .min(1, { message: lang?.form?.deposit_amount_required || 'Amount is required' })
      .regex(/^\d+$/, { message: lang?.form?.deposit_amount_number || 'Only numbers are allowed' })
      .refine(val => parseInt(val, 10) >= 10000, {
        message: lang?.form?.deposit_amount_min || 'Minimum amount is 10,000원'
      })
      .refine(val => parseInt(val, 10) <= maxValue, {
        message: formatMaxMsg(lang?.form?.deposit_amount_max, maxValue) || 'Maximum amount is 90,000,000원'
      })
      .refine(
        val => {
          const n = parseInt(val, 10)
          if (Number.isNaN(n)) return false
          return n % 10000 === 0
        },
        {
          message: lang?.form?.amount_multiple_of_10000 || 'Amount must be a multiple of 10,000 KRW'
        }
      ),

    // password: z.string().min(1, { message: lang?.form?.deposit_password_required || 'Password is required' }),

    account: z.string().optional(),
    promo_id: z.string().optional()
  })

export type DepositFormData = z.infer<ReturnType<typeof DepositSchema>>
