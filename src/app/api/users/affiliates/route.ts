// app/api/users/affiliates/route.ts
import { withAuthErrorHandling } from '@/@core/lib/api-wrapper'
import { serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

// 🔥 FIX: Force dynamic rendering
export const dynamic = 'force-dynamic'

// POST - Create affiliate
export async function POST(request: Request) {
  return withAuthErrorHandling(request, async () => {
    const body = await request.json()
    const response = await serverApiClient.post(getApiEndpoint('group_referral'), body)
    return response.data
  })
}
