import { z } from 'zod'
import { LangProps } from '@/types/langProps'

export const ChangeSharedSettingSchema = (lang: LangProps) =>
  z.object({
    user_share: z
      .number({
        required_error: lang?.form?.user_share_required || 'User share is required',
        invalid_type_error: lang?.form?.user_share_numeric_only || 'User share must be a number'
      })
      .min(0, { message: lang?.form?.user_share_min || 'User share must be at least 0' })
      .max(100, { message: lang?.form?.user_share_max || 'User share must be at most 100' })
      .transform(val => (Number.isNaN(Number(val)) ? undefined : Number(val))),
    affiliate_share: z
      .number({
        required_error: lang?.form?.affiliate_share_required || 'Affiliate share is required',
        invalid_type_error: lang?.form?.affiliate_share_numeric_only || 'Affiliate share must be a number'
      })
      .min(0, { message: lang?.form?.affiliate_share_min || 'Affiliate share must be at least 0' })
      .max(100, { message: lang?.form?.affiliate_share_max || 'Affiliate share must be at most 100' })
      .transform(val => (Number.isNaN(Number(val)) ? undefined : Number(val)))
  })

export type ChangeSharedSettingType = z.infer<ReturnType<typeof ChangeSharedSettingSchema>>
