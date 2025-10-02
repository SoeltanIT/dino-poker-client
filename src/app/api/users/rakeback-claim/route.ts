import { withAuthErrorHandling } from '@/@core/lib/api-wrapper'
import { getBackendClient, serverApiClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

// 🔥 FIX: Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  return withAuthErrorHandling(request, async () => {
    // 🎯 Call the real backend directly
    const res = await serverApiClient.post(getApiEndpoint('rakeBackClaim'), {}, undefined, 'user')
    return res?.data
  })
}
