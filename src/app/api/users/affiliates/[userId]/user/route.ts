// app/api/users/referral/shared-settings/route.ts
import { withAuthErrorHandling } from '@/@core/lib/api-wrapper'
import { getAffiliateUserList } from '@/utils/api/internal/getAffiliateUserList'

// 🔥 FIX: Force dynamic rendering
export const dynamic = 'force-dynamic'

// GET - Get shared settings
export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') ?? '1'
  const pageSize = searchParams.get('pageSize') ?? '10'
  return withAuthErrorHandling(request, async () => {
    return await getAffiliateUserList(params.userId, {
      page: Number(page),
      pageSize: Number(pageSize)
    })
  })
}
