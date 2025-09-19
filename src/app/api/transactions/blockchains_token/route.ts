import { withAuthErrorHandling } from '@/@core/lib/api-wrapper'
import { getListBlockchainsToken } from '@/utils/api/internal/getBlockchainsToken'

// 🔥 FIX: Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  return withAuthErrorHandling(request, async () => {
    const body = await request.json()
    return await getListBlockchainsToken(body?.id)
  })
}
