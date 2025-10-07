// app/api/users/referral/shared-settings/route.ts
import { withAuthErrorHandling } from '@/@core/lib/api-wrapper'
import { getReferralSettings } from '@/utils/api/internal/getReferralSettings'
import { serverApiClient } from '@/@core/lib/axios-client'

// 🔥 FIX: Force dynamic rendering
export const dynamic = 'force-dynamic'

// GET - Get shared settings
export async function GET(request: Request) {
  return withAuthErrorHandling(request, async () => {
    return await getReferralSettings()
  })
}

// PUT - Update shared settings
export async function PUT(request: Request) {
  return withAuthErrorHandling(request, async () => {
    const body = await request.json()
    const response = await serverApiClient.put('/v1/referral/shared-settings', body, undefined, 'user')
    return response.data
  })
}
