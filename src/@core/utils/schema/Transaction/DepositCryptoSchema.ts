// utils/schema/Transaction/DepositSchema.ts

import { z } from 'zod'
import { LangProps } from '@/types/langProps'

export const DepositCryptoSchema = (lang?: LangProps, tab?: string) =>
  z.object({
    promo_id: z.string().optional()

    // password: z.string().min(1, { message: lang?.form?.deposit_password_required || 'Password is required' }),

    // coin_network: z.string().min(1, { message: lang?.form?.coin_network_required || 'Coin network is required' }),

    // crypto: z.string().min(1, { message: lang?.form?.crypto_required || 'Crypto is required' })
  })

export type DepositCryptoFormData = z.infer<ReturnType<typeof DepositCryptoSchema>>
