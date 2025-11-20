import { checkUsername } from '@/utils/api/internal/checkUsername'
import { NextRequest, NextResponse } from 'next/server'

// Add this line at the top
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = await checkUsername(body)

    return NextResponse.json(data)
  } catch (error: any) {
    //console.error('[API][users/register] ❌ Error:', error?.message)

    return NextResponse.json(
      {
        message: error?.response?.data?.message || error.message || 'Internal Server Error',
        status: error?.response?.status || 500
      },
      { status: error?.response?.status || 500 }
    )
  }
}
