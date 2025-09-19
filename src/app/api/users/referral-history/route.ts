// app/api/users/referral-history/route.ts
import { withAuthErrorHandling } from '@/@core/lib/api-wrapper'
import { getBackendClient, serverApiClient } from '@/@core/lib/axios-client'
import { getReferralHistory } from '@/utils/api/internal/getReferralHistory'
import { getApiEndpoint } from '@/utils/api_endpoint'

// 🔥 FIX: Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  return withAuthErrorHandling(request, async () => {
    // 🎯 Get query parameters
    const body = await request.json()

    const page = Number(body.page ?? 1)
    const pageSize = Number(body.pageSize ?? 10)

    return await getReferralHistory({ page, pageSize })
  })
}
