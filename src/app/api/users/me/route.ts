// ✅ FIXED API ROUTE - Keep your approach but improved

import { withAuthErrorHandling } from '@/@core/lib/api-wrapper'
import { getMe } from '@/utils/api/internal/user'

// 🔥 FIX: Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  return withAuthErrorHandling(request, async () => {
    // 🎯 Just your business logic here!
    return await getMe()
  })
}
