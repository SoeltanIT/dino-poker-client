// app/api/users/me/route.ts
import { getWebConfig } from '@/utils/api/internal/webConfig'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const result = await getWebConfig()
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.response?.data?.message || error.message || 'Internal Server Error',
        status: error?.response?.status || 500
      },
      { status: error?.response?.status || 500 }
    )
  }
}
