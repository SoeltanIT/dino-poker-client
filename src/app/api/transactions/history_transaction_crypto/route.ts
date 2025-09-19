import { withAuthErrorHandling } from '@/@core/lib/api-wrapper'
import { getListBlockchains } from '@/utils/api/internal/getBlockchains'
import { getTransactionCrypto } from '@/utils/api/internal/getTransactionCrypto'

// 🔥 FIX: Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  return withAuthErrorHandling(request, async () => {
    const body = await request.json()

    const page = Number(body.page ?? 1)
    const pageSize = Number(body.pageSize ?? 10)
    return await getTransactionCrypto({ page, pageSize })
  })
}
