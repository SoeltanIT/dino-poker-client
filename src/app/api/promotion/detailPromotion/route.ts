// app/api/users/me/route.ts
import { withAuthErrorHandling } from '@/@core/lib/api-wrapper'
import { getDetailPromotion } from '@/utils/api/internal/detailPromotion'
import { getListPromotion } from '@/utils/api/internal/listPromotion'

// 🔥 FIX: Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  return withAuthErrorHandling(request, async () => {
    const body = await request.json()
    // 🎯 Just your business logic here!
    return await getDetailPromotion(body?.id)
  })
}
