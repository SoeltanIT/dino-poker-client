// app/api/users/me/route.ts
import { withAuthErrorHandling } from '@/@core/lib/api-wrapper'
import { getListMyPromotion } from '@/utils/api/internal/listMyPromotion'

// 🔥 FIX: Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  return withAuthErrorHandling(request, async () => {
    // 🎯 Just your business logic here!
    return await getListMyPromotion()
  })
}
