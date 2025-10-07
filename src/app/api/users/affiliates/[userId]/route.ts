// app/api/users/referral/route.ts
import { withAuthErrorHandling } from '@/@core/lib/api-wrapper'
import { getBackendClient } from '@/@core/lib/axios-client'
import { getApiEndpoint } from '@/utils/api_endpoint'

// 🔥 FIX: Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  // Extract query parameters from the request URL
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') ?? '1'
  const pageSize = searchParams.get('pageSize') ?? '10'

  return await withAuthErrorHandling(request, async () => {
    // 🎯 Call the real backend directly
    const res = await getBackendClient('user').get(`${getApiEndpoint('affiliates')}/${params.userId}`, {
      params: {
        page: Number(page),
        pageSize: Number(pageSize)
      }
    })

    return res?.data
  })
}
