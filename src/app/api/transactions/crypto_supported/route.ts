import { withAuthErrorHandling } from '@/@core/lib/api-wrapper'
import { getCryptoSupported } from '@/utils/api/internal/getCryptoSupported'

// 🔥 FIX: Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  return withAuthErrorHandling(request, async () => {
    return await getCryptoSupported()
  })
}
