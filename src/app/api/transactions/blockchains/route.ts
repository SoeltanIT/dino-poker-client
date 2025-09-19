import { withAuthErrorHandling } from '@/@core/lib/api-wrapper'
import { getListBlockchains } from '@/utils/api/internal/getBlockchains'

// 🔥 FIX: Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  return withAuthErrorHandling(request, async () => {
    return await getListBlockchains()
  })
}
