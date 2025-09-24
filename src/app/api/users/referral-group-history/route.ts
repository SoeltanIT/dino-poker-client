// app/api/users/referral-history/route.ts
import { withAuthErrorHandling } from '@/@core/lib/api-wrapper'
import { getReferralGroupHistory } from '@/utils/api/internal/getReferralHistory'

// 🔥 FIX: Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  return withAuthErrorHandling(request, async () => {
    // 🎯 Get query parameters
    const body = await request.json()

    const page = Number(body.page ?? 1)
    const pageSize = Number(body.pageSize ?? 10)

    return await getReferralGroupHistory({ page, pageSize })
  })
}
