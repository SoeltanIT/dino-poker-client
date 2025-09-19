import { LangProps } from '@/types/langProps'
import { z } from 'zod'

const MIN_AGE = 19

export const registrationSchema = (lang: LangProps) =>
  z
    .object({
      // bank_account_number: z
      //   .string()
      //   .min(8, 'Bank account number must be at least 8 digits')
      //   .max(20, 'Bank account number must not exceed 20 digits')
      //   .regex(/^\d+$/, 'Bank account number must contain only numbers'),

      // bank_name: z
      //   .string()
      //   .min(2, 'Bank name must be at least 2 characters')
      //   .max(100, 'Bank name must not exceed 100 characters'),

      referral_code: z.string().optional(),

      email: z
        .string()
        .min(5, lang?.form?.email_min)
        .regex(
          /^[a-zA-Z0-9._-가-힣\u00C0-\u1FFF\u2C00-\uD7FF]+@[a-zA-Z0-9.-가-힣\u00C0-\u1FFF\u2C00-\uD7FF]+\.[a-zA-Z]{2,6}$/,
          lang?.form?.email_invalid
        )
        .max(50, lang?.form?.email_max),

      // id_card: z.string().min(0, 'ID card information is required').max(500, 'ID card information is too long'),

      // id_number: z
      //   .string()
      //   .min(6, 'ID number must be at least 6 characters')
      //   .max(20, 'ID number must not exceed 20 characters'),
      // // .regex(/^\d+$/, "ID number must contain only numbers"),

      language: z.string().length(2, 'Language code must be exactly 2 characters'),
      // .regex(
      //   /^[a-z]{2}$/,
      //   "Language code must be lowercase (e.g., en, es, fr)"
      // ),

      name: z.string().min(2, lang?.form?.name_min).max(30, lang?.form?.name_max),
      // .regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces"),

      password: z.string().min(4, lang?.form?.password_min).max(15, lang?.form?.password_max),
      // .regex(
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      //   "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      // ),

      phone_number: z
        .string()
        .min(7, lang?.form?.phone_min)
        .max(15, lang?.form?.phone_max)
        .regex(/^\d+$/, lang?.form?.phone_number_invalid),

      phone_number_code: z.string().min(2, 'Name must be 2-30 characters').max(30, 'Name must be 2-30 characters'),
      // .regex(
      //   /^\+\d{1,4}$/,
      //   "Phone code must start with + followed by 1-4 digits"
      // ),

      roles: z
        .number()
        .int('Role must be an integer')
        .min(1, 'Role must be at least 1')
        .max(10, 'Role must not exceed 10'),

      // selfie: z.string().min(0, 'Selfie is required').max(1000000, 'Selfie data is too large'),

      transaction_password: z
        .string()
        .min(4, lang?.form?.transaction_password_min)
        .max(15, lang?.form?.transaction_password_max),

      username: z.string().min(2, lang?.form?.username_min).max(30, lang?.form?.username_max),
      // .regex(
      //   /^[a-zA-Z0-9_]+$/,
      //   "Username must contain only letters, numbers, and underscores"
      // ),
      retypePassword: z
        .string({
          required_error: lang?.form?.retype_required
        })
        .min(4, lang?.form?.password_min)
        .max(15, lang?.form?.password_max),
      // .regex(
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      //   "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      // ).optional(),

      retype_transaction_password: z
        .string({
          required_error: lang?.form?.retype_transaction_required
        })
        .min(4, lang?.form?.transaction_password_min)
        .max(15, lang?.form?.transaction_password_max),

      consent: z
        .boolean({
          required_error: lang?.form?.consent_required
        })
        .refine(val => val === true, {
          message: lang?.form?.consent_required
        }),

      date_of_birth: z
        .date({
          required_error: lang?.form?.dob_required,
          invalid_type_error: lang?.form?.dob_invalid
        })
        .refine(
          date => {
            const today = new Date()
            const minDate = new Date(today.getFullYear() - MIN_AGE, today.getMonth(), today.getDate())
            return date <= minDate
          },
          {
            message: lang?.form?.dob_min_age
          }
        )
    })
    .refine(data => data.password === data.retypePassword, {
      message: lang?.form?.password_match,
      path: ['retypePassword']
    })
    .refine(data => data.transaction_password === data.retype_transaction_password, {
      message: lang?.form?.transaction_password_match,
      path: ['retype_transaction_password']
    })

export type RegistrationFormData = z.infer<ReturnType<typeof registrationSchema>>
