import { z } from 'zod'
import { LangProps } from '@/types/langProps'
import { thousandSeparatorComma } from '@/utils/helper/formatNumber'

const formatMaxMsg = (template: string | undefined, max: number) => {
  const display = thousandSeparatorComma(max)
  if (!template) return `Maximum amount is ${display} KRW`
  // Replace all occurrences of MAX safely
  return template.replace(/MAX/g, display)
}

export const WithdrawSchema = (lang?: LangProps, maxValue: number = 9000000) =>
  z.object({
    amount: z
      .string()
      .min(1, { message: lang?.form?.withdraw_amount_required || 'Amount is required' })
      .regex(/^\d+$/, { message: lang?.form?.withdraw_amount_number || 'Only numbers are allowed' })
      .refine(val => parseInt(val, 10) >= 10000, {
        message: lang?.form?.withdraw_amount_min || 'Minimum amount is 10,000 KRW'
      })
      .refine(val => parseInt(val, 10) <= maxValue, {
        message: formatMaxMsg(lang?.form?.withdraw_amount_max, maxValue) || 'Maximum amount is 9,000,000 KRW'
      }),

    // bankName: z.string().min(1, lang?.form?.bank_name_required || 'Bank name is required'),
    // accountNumber: z.string().min(1, lang?.form?.account_number_required || 'Account number is required'),
    // nameOfWithdrawal: z.string().min(1, lang?.form?.withdrawal_name_required || 'Name of withdrawal is required'),

    withdrawalPassword: z
      .string()
      .min(1, { message: lang?.form?.withdraw_password_required || 'Withdrawal password is required' })
  })

export type WithdrawFormData = z.infer<ReturnType<typeof WithdrawSchema>>
