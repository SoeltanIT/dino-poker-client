// app/api/users/referral/shared-settings/route.ts
import { withAuthErrorHandling } from '@/@core/lib/api-wrapper'
import { getAffiliateUserList } from '@/utils/api/internal/getAffiliateUserList'

// 🔥 FIX: Force dynamic rendering
export const dynamic = 'force-dynamic'

// GET - Get shared settings
export async function GET(
  request: Request,
  { params, searchParams }: { params: { userId: string }; searchParams: { page: string; pageSize: string } }
) {
  return withAuthErrorHandling(request, async () => {
    return await getAffiliateUserList(params.userId, {
      page: Number(searchParams?.page ?? 1),
      pageSize: Number(searchParams?.pageSize ?? 10)
    })
  })
}
