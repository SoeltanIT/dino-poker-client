import { LangProps } from '@/types/langProps'
import { z } from 'zod'

export const ChangePasswordSchema = (lang: LangProps) =>
  z
    .object({
      type: z.string().min(1, {
        message: lang?.form?.type_required || 'Type is required.'
      }),
      currentPassword: z.string().min(1, {
        message: lang?.form?.current_password_required || 'Current password is required.'
      }),
      newPassword: z.string().min(8, {
        message: lang?.form?.new_password_min || 'New password must be at least 8 characters.'
      }),
      retypeNewPassword: z.string().min(1, {
        message: lang?.form?.retype_new_password_required || 'Please retype your new password.'
      })
    })
    .refine(data => data.newPassword === data.retypeNewPassword, {
      message: lang?.form?.new_password_match || "Passwords don't match",
      path: ['retypeNewPassword']
    })

export type ChangePasswordType = z.infer<ReturnType<typeof ChangePasswordSchema>>
