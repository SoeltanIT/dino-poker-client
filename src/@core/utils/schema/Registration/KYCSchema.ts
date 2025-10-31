import { LangProps } from '@/types/langProps'
import { z } from 'zod'

export const KYCSchema = (lang?: LangProps) =>
  z
    .object({
      name: z
        .string()
        .min(2, { message: lang?.form?.name_min || 'Name must be at least 2 characters' })
        .max(50, { message: lang?.form?.name_max || 'Name must not exceed 50 characters' }),

      date_of_birth: z
        .date({
          required_error: lang?.form?.dob_required || 'Date of birth is required',
          invalid_type_error: lang?.form?.dob_invalid || 'Invalid date'
        })
        .refine(
          date => {
            const today = new Date()
            const birthDate = new Date(date)
            const age = today.getFullYear() - birthDate.getFullYear()
            const monthDiff = today.getMonth() - birthDate.getMonth()
            const dayDiff = today.getDate() - birthDate.getDate()

            // Check if user has turned 19 yet this year
            if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
              return age - 1 >= 19
            }
            return age >= 19
          },
          {
            message: lang?.form?.dob_min_age || 'You must be at least 19 years old'
          }
        ),

      phone_number: z
        .string()
        .min(7, { message: lang?.form?.phone_min || 'Phone number must be at least 7 digits' })
        .max(15, { message: lang?.form?.phone_max || 'Phone number must not exceed 15 digits' })
        .regex(/^\d+$/, { message: lang?.form?.phone_number_invalid || 'Phone number must contain only numbers' }),

      transaction_password: z
        .string()
        .min(4, { message: lang?.form?.transaction_password_min || 'Password min 4 characters' })
        .max(15, { message: lang?.form?.transaction_password_max || 'Password max 15 characters' }),

      retype_transaction_password: z
        .string({ required_error: lang?.form?.retype_transaction_required || 'Please retype password' })
        .min(4, { message: lang?.form?.transaction_password_min || 'Password min 4 characters' })
        .max(15, { message: lang?.form?.transaction_password_max || 'Password max 15 characters' }),

      bank_account_number: z
        .string()
        .min(8, { message: lang?.form?.bank_account_min || 'Bank account number must be at least 8 digits' })
        .max(20, { message: lang?.form?.bank_account_max || 'Bank account number must not exceed 20 digits' })
        .regex(/^\d+$/, {
          message: lang?.form?.bank_account_numeric || 'Bank account number must contain only numbers'
        }),

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
    .refine(data => data.transaction_password === data.retype_transaction_password, {
      message: lang?.form?.transaction_password_match || 'Withdrawal passwords do not match',
      path: ['retype_transaction_password']
    })

export type KYCFormData = z.infer<ReturnType<typeof KYCSchema>>

export const KYCSchemaStep1 = (lang?: LangProps) =>
  z.object({
    name: z
      .string()
      .min(2, { message: lang?.form?.name_min || 'Name must be at least 2 characters' })
      .max(50, { message: lang?.form?.name_max || 'Name must not exceed 50 characters' }),

    date_of_birth: z
      .date({
        required_error: lang?.form?.dob_required || 'Date of birth is required',
        invalid_type_error: lang?.form?.dob_invalid || 'Invalid date'
      })
      .refine(
        date => {
          const today = new Date()
          const birthDate = new Date(date)
          const age = today.getFullYear() - birthDate.getFullYear()
          const monthDiff = today.getMonth() - birthDate.getMonth()
          const dayDiff = today.getDate() - birthDate.getDate()

          // Check if user has turned 19 yet this year
          if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            return age - 1 >= 19
          }
          return age >= 19
        },
        {
          message: lang?.form?.dob_min_age || 'You must be at least 19 years old'
        }
      ),

    phone_number: z
      .string()
      .min(7, { message: lang?.form?.phone_min || 'Phone number must be at least 7 digits' })
      .max(15, { message: lang?.form?.phone_max || 'Phone number must not exceed 15 digits' })
      .regex(/^\d+$/, { message: lang?.form?.phone_number_invalid || 'Phone number must contain only numbers' }),
    id_card: z
      .string()
      .trim()
      .min(1, { message: lang?.form?.id_card_required || 'ID Card image is required' })
      .max(255, { message: lang?.form?.id_card_max || 'ID Card filename is too long' })
      .regex(/\.(jpg|jpeg|png|bmp)$/i, {
        message: lang?.form?.invalidFileType || 'Invalid image format'
      })
  })

export type KYCStep1FormData = z.infer<ReturnType<typeof KYCSchemaStep1>>

export const KYCSchemaStep2 = (lang?: LangProps) =>
  z.object({
    consent: z
      .boolean({
        required_error: lang?.form?.consent_required || 'You must agree to the terms and conditions'
      })
      .refine(val => val === true, {
        message: lang?.form?.consent_required || 'You must agree to the terms and conditions'
      }),
    // transaction_password: z
    //   .string()
    //   .min(4, { message: lang?.form?.transaction_password_min || 'Password min 4 characters' })
    //   .max(15, { message: lang?.form?.transaction_password_max || 'Password max 15 characters' }),
    bank_account_number: z
      .string()
      .min(8, { message: lang?.form?.bank_account_min || 'Bank account number must be at least 8 digits' })
      .max(20, { message: lang?.form?.bank_account_max || 'Bank account number must not exceed 20 digits' })
      .regex(/^\d+$/, {
        message: lang?.form?.bank_account_numeric || 'Bank account number must contain only numbers'
      }),

    bank_name: z
      .string()
      .min(2, { message: lang?.form?.bank_name_required || 'Bank name is required' })
      .max(50, { message: lang?.form?.bank_name_max || 'Bank name must not exceed 50 characters' })

    // retype_transaction_password: z
    //   .string({ required_error: lang?.form?.retype_transaction_required || 'Please retype password' })
    //   .min(4, { message: lang?.form?.transaction_password_min || 'Password min 4 characters' })
    //   .max(15, { message: lang?.form?.transaction_password_max || 'Password max 15 characters' })
  })
// .refine(data => data.transaction_password === data.retype_transaction_password, {
//   message: lang?.form?.transaction_password_match || 'Withdrawal passwords do not match',
//   path: ['retype_transaction_password']
// })

export type KYCStep2FormData = z.infer<ReturnType<typeof KYCSchemaStep2>>
