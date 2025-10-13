import { withAuthErrorHandling } from '@/@core/lib/api-wrapper'
import { serverApiClient } from '@/@core/lib/axios-client'

// 🔥 Force dynamic rendering
export const dynamic = 'force-dynamic'

// PATCH - Update shared setting by ID
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  return withAuthErrorHandling(request, async () => {
    const body = await request.json()
    const response = await serverApiClient.patch(
      `/v1/referral/shared-settings/${params.id}`,
      body,
      undefined,
      'user',
      false
    )
    return response.data
  })
}
