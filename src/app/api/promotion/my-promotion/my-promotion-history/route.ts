// app/api/users/me/route.ts
import { withAuthErrorHandling } from '@/@core/lib/api-wrapper'
import { cancelPromotion, getListMyPromotionHistory } from '@/utils/api/internal/listMyPromotionHistory'

// 🔥 FIX: Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  return withAuthErrorHandling(request, async () => {
    // 🎯 Just your business logic here!
    return await getListMyPromotionHistory()
  })
}

export async function PATCH(request: Request) {
  return withAuthErrorHandling(request, async () => {
    const { id } = await request.json()
    return await cancelPromotion(id)
  })
}
