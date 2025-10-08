import { authOptions } from '@/lib/authOptions'
import { getServerSession } from 'next-auth/next'


export async function GET() {
  const session = await getServerSession(authOptions)

  if (!(session as any)?.accessToken) {
    console.log('🔍 No access token found in session')

    return new Response('Unauthorized - No access token', { status: 401 })
  }

  console.log('🔍 Access token found:', (session as any).accessToken.substring(0, 20) + '...')

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_TRANS_URL}/v1/notification-stream`, {
    headers: {
      Authorization: `Bearer ${(session as any).accessToken}`,
      'Content-Type': 'text/event-stream'
    }
  })

  return response
}
