import { withAuthErrorHandling } from '@/@core/lib/api-wrapper'
import { withdrawCryptoRequest } from '@/utils/api/internal/withdrawCrypto'

// 🔥 FIX: Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  return withAuthErrorHandling(request, async () => {
    const body = await request.json()
    return await withdrawCryptoRequest(body)
  })
}
