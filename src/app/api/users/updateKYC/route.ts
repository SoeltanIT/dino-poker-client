import { withAuthErrorHandling } from '@/@core/lib/api-wrapper'
import { updateUser } from '@/utils/api/internal/updateUser'

// 🔥 FIX: Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function PUT(request: Request) {
  return withAuthErrorHandling(request, async () => {
    const body = await request.json()
    return await updateUser(body)
  })
}
