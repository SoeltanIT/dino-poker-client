import { z } from 'zod'
import { LangProps } from '@/types/langProps'

export const KYCSchema = (lang?: LangProps) =>
  z.object({
    bank_account_number: z
      .string()
      .min(8, { message: lang?.form?.bank_account_min || 'Bank account number must be at least 8 digits' })
      .max(20, { message: lang?.form?.bank_account_max || 'Bank account number must not exceed 20 digits' })
      .regex(/^\d+$/, { message: lang?.form?.bank_account_numeric || 'Bank account number must contain only numbers' }),

    bank_name: z
      .string()
      .min(2, { message: lang?.form?.bank_name_required || 'Bank name is required' })
      .max(50, { message: lang?.form?.bank_name_max || 'Bank name must not exceed 50 characters' }),

    id_card: z
      .string()
      .trim()
      .min(1, { message: lang?.form?.id_card_required || 'ID Card image is required' })
      .max(255, { message: lang?.form?.id_card_max || 'ID Card filename is too long' })
      .regex(/\.(jpg|jpeg|png|bmp)$/i, {
        message: lang?.form?.invalidFileType || 'Invalid image format'
      }),

    consent: z
      .boolean({
        required_error: lang?.form?.consent_required || 'You must agree to the terms and conditions'
      })
      .refine(val => val === true, {
        message: lang?.form?.consent_required || 'You must agree to the terms and conditions'
      })
  })

export type KYCFormData = z.infer<ReturnType<typeof KYCSchema>>
