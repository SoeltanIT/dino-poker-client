import { z } from 'zod'
import { LangProps } from '@/types/langProps'

export const WithdrawSchema = (lang?: LangProps) =>
  z.object({
    amount: z
      .string()
      .min(1, { message: lang?.form?.withdraw_amount_required || 'Amount is required' })
      .regex(/^\d+$/, { message: lang?.form?.withdraw_amount_number || 'Only numbers are allowed' })
      .refine(val => parseInt(val, 10) >= 10000, {
        message: lang?.form?.withdraw_amount_min || 'Minimum amount is 10,000 KRW'
      })
      .refine(val => parseInt(val, 10) <= 9000000, {
        message: lang?.form?.withdraw_amount_max || 'Maximum amount is 9,000,000 KRW'
      }),

    // bankName: z.string().min(1, lang?.form?.bank_name_required || 'Bank name is required'),
    // accountNumber: z.string().min(1, lang?.form?.account_number_required || 'Account number is required'),
    // nameOfWithdrawal: z.string().min(1, lang?.form?.withdrawal_name_required || 'Name of withdrawal is required'),

    withdrawalPassword: z
      .string()
      .min(1, { message: lang?.form?.withdraw_password_required || 'Withdrawal password is required' })
  })

export type WithdrawFormData = z.infer<ReturnType<typeof WithdrawSchema>>
