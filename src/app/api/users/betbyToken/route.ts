// app/api/users/referral/route.ts
import { withAuthErrorHandling } from '@/@core/lib/api-wrapper'
import { getBackendClient } from '@/@core/lib/axios-client'
import { getBetbyToken } from '@/utils/api/internal/getBetbyToken'
import { getApiEndpoint } from '@/utils/api_endpoint'

// 🔥 FIX: Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  return withAuthErrorHandling(request, async () => {
    // 🎯 Call the real backend directly
    const body = await request.json()
    return await getBetbyToken(body)
  })
}
