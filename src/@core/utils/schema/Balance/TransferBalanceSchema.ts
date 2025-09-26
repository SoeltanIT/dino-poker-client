import { z } from 'zod'
import { LangProps } from '@/types/langProps'

export const TransferBalanceSchema = (lang?: LangProps) =>
  z.object({
    transfer: z
      .string()
      .nonempty({ message: lang?.form?.transfer_required })
      .refine(v => /^\d+$/.test(v), {
        message: lang?.form?.transfer_numeric_only ?? 'Amount must be numbers only'
      })
      .refine(v => Number(v) > 0, {
        message: lang?.form?.transfer_gt_zero ?? 'Amount must be greater than 0'
      })
  })

export type TransferBalanceFormData = z.infer<ReturnType<typeof TransferBalanceSchema>>
