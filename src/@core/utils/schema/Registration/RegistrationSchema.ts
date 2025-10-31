import { LangProps } from '@/types/langProps'
import { z } from 'zod'

export const registrationSchema = (lang: LangProps) =>
  z
    .object({
      email: z
        .string()
        .min(5, lang?.form?.email_min)
        .regex(
          /^[a-zA-Z0-9._-가-힣\u00C0-\u1FFF\u2C00-\uD7FF]+@[a-zA-Z0-9.-가-힣\u00C0-\u1FFF\u2C00-\uD7FF]+\.[a-zA-Z]{2,6}$/,
          lang?.form?.email_invalid
        )
        .max(50, lang?.form?.email_max),

      transaction_password: z
        .string()
        .min(4, { message: lang?.form?.transaction_password_min || 'Password min 4 characters' })
        .max(15, { message: lang?.form?.transaction_password_max || 'Password max 15 characters' }),

      retype_transaction_password: z
        .string({ required_error: lang?.form?.retype_transaction_required || 'Please retype password' })
        .min(4, { message: lang?.form?.transaction_password_min || 'Password min 4 characters' })
        .max(15, { message: lang?.form?.transaction_password_max || 'Password max 15 characters' }),

      username: z.string().min(2, lang?.form?.username_min).max(30, lang?.form?.username_max),

      password: z.string().min(4, lang?.form?.password_min).max(15, lang?.form?.password_max),

      retypePassword: z
        .string({ required_error: lang?.form?.retype_required })
        .min(4, lang?.form?.password_min)
        .max(15, lang?.form?.password_max),

      referral_code: z.string().optional(),

      roles: z.string().optional(),

      consent: z
        .boolean({
          required_error: lang?.form?.consent_required || 'You must agree to the terms and conditions'
        })
        .refine(val => val === true, {
          message: lang?.form?.consent_required || 'You must agree to the terms and conditions'
        })
    })
    .refine(data => data.password === data.retypePassword, {
      message: lang?.form?.password_match,
      path: ['retypePassword']
    })
    .refine(data => data.transaction_password === data.retype_transaction_password, {
      message: lang?.form?.transaction_password_match || 'Withdrawal passwords do not match',
      path: ['retype_transaction_password']
    })

export type RegistrationFormData = z.infer<ReturnType<typeof registrationSchema>>
