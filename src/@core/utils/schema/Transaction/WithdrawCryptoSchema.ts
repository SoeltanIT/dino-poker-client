import { LangProps } from '@/types/langProps'
import { thousandSeparatorComma } from '@/utils/helper/formatNumber'
import { z } from 'zod'

const formatMaxMsg = (template: string | undefined, max: number) => {
  const display = thousandSeparatorComma(max)
  if (!template) return `Maximum amount is ${display}원`
  // Replace all occurrences of MAX safely
  return template.replace(/MAX/g, display)
}

export const WithdrawCryptoSchema = (lang?: LangProps, maxValue: number = 9000000) =>
  z.object({
    amount_crypto: z
      .string()
      .min(1, { message: lang?.form?.withdraw_amount_required || 'Amount is required' })
      .regex(/^\d+$/, { message: lang?.form?.withdraw_amount_number || 'Only numbers are allowed' })
      .refine(val => parseInt(val, 10) >= 10000, {
        message: lang?.form?.withdraw_amount_min || 'Minimum amount is 10,000원'
      })
      .refine(val => parseInt(val, 10) <= maxValue, {
        message: formatMaxMsg(lang?.form?.withdraw_amount_max, maxValue) || 'Maximum amount is 9,000,000원'
      }),

    // bankName: z.string().min(1, lang?.form?.bank_name_required || 'Bank name is required'),
    // accountNumber: z.string().min(1, lang?.form?.account_number_required || 'Account number is required'),
    // nameOfWithdrawal: z.string().min(1, lang?.form?.withdrawal_name_required || 'Name of withdrawal is required'),

    crypto: z.string().min(1, { message: lang?.form?.crypto_required || 'Crypto is required' }),

    coin_network: z.string().min(1, { message: lang?.form?.coin_network_required || 'Coin network is required' }),

    withdraw_address: z
      .string()
      .min(1, { message: lang?.form?.withdraw_address_required || 'Withdrawal address is required' })
      .regex(/^\S+$/, { message: lang?.form?.withdraw_address_no_space || 'No spaces allowed in withdraw address' }),

    withdrawalPassword: z
      .string()
      .min(1, { message: lang?.form?.withdraw_password_required || 'Withdrawal password is required' })
  })

export type WithdrawCryptoFormData = z.infer<ReturnType<typeof WithdrawCryptoSchema>>
