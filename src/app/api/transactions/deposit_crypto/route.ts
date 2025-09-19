import { withAuthErrorHandling } from '@/@core/lib/api-wrapper'
import { depositRequest } from '@/utils/api/internal/deposit'
import { depositCryptoRequest } from '@/utils/api/internal/depositCrypto'

// 🔥 FIX: Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  return withAuthErrorHandling(request, async () => {
    const body = await request.json()
    return await depositCryptoRequest(body)
  })
}
