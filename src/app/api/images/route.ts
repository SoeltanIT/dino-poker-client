// app/api/i/route.ts
import { NextRequest } from 'next/server'

export const runtime = 'edge' // optional

export async function GET(req: NextRequest) {
  const src = req.nextUrl.searchParams.get('src')
  if (!src) return new Response('Missing src', { status: 400 })

  // Basic allowlist/validation if you want:
  try {
    new URL(src)
  } catch {
    return new Response('Bad URL', { status: 400 })
  }
  const ua = req.headers.get('user-agent') || 'MyAppImageProxy/1.0'
  const accept = req.headers.get('accept') || 'image/avif,image/webp,image/*,*/*;q=0.8'

  const upstream = await fetch(src, {
    headers: { 'user-agent': ua, accept }
  })

  if (!upstream.ok) return new Response('Upstream error', { status: upstream.status })

  return new Response(upstream.body, {
    headers: {
      'content-type': upstream.headers.get('content-type') ?? 'image/webp',
      // cache aggressively at the edge
      'cache-control': 'public, s-maxage=31536000, immutable'
    }
  })
}
