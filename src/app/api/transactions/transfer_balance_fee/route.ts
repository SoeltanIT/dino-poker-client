// app/api/users/me/route.ts
import { withAuthErrorHandling } from '@/@core/lib/api-wrapper'
import { getTransferBalanceFee } from '@/utils/api/internal/transferBalanceFee'

// 🔥 FIX: Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  return withAuthErrorHandling(request, async () => {
    // 🎯 Just your business logic here!
    return await getTransferBalanceFee()
  })
}
