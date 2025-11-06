import { get } from '@vercel/edge-config'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export interface AppFeatures {
  sports: boolean
  promotion: boolean
  crypto: boolean
}

export async function GET() {
  try {
    // Fetch from edge config
    const features = await get<AppFeatures>('appFeatures')
    // Fallback to environment variables if edge config is not available
    const fallbackFeatures: AppFeatures = {
      sports: false,
      promotion: false,
      crypto: false
    }

    // Merge edge config with fallback (edge config takes priority)
    const appFeatures: AppFeatures = {
      sports: features?.sports ?? fallbackFeatures.sports,
      promotion: features?.promotion ?? fallbackFeatures.promotion,
      crypto: features?.crypto ?? fallbackFeatures.crypto
    }

    return NextResponse.json(appFeatures, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })
  } catch (error: any) {
    console.error('[AppFeatures] Error fetching from edge config:', error)

    // Fallback to environment variables on error
    const fallbackFeatures: AppFeatures = {
      sports: false,
      promotion: false,
      crypto: false
    }

    return NextResponse.json(fallbackFeatures, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    })
  }
}
