// app/api/users/referral-summary/route.ts
import { withAuthErrorHandling } from '@/@core/lib/api-wrapper'
import { getBackendClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

// 🔥 FIX: Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  return withAuthErrorHandling(request, async () => {
    // 🎯 Call the real backend directly
    const res = await getBackendClient('user').get(getApiEndpoint('referral_summary'))
    return res?.data
  })
} 