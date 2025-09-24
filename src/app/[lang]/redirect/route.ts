// app/[lang]/redirect/route.ts
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const revalidate = 0

// Whitelist your provider hosts
const ALLOWED_HOSTS = new Set(['multiplayerlobby1.lobbyroom88.com', 'multiplayerlobby2.lobbyroom88.com'])

export async function GET(req: NextRequest) {
  // IMPORTANT: nextUrl.searchParams.get() is already decoded once by the platform.
  // Do NOT call decodeURIComponent again.
  const val = req.nextUrl.searchParams.get('url') ?? ''
  if (!val) {
    return new Response(JSON.stringify({ error: 'missing url' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Validate protocol + host without new URL() (keeps {} untouched)
  const m = val.match(/^https?:\/\/([^\/?#]+)(?:[\/?#]|$)/i)
  if (!m) {
    return new Response(JSON.stringify({ error: 'bad url' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  const host = m[1].split(':')[0].toLowerCase()
  if (!ALLOWED_HOSTS.has(host)) {
    return new Response(JSON.stringify({ error: `host not allowed: ${host}` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Base64 the full target URL so we can safely inject it into JS without touching `{}` or `%2B`
  const b64 = Buffer.from(val, 'utf8').toString('base64')

  const html = `<!doctype html>
<meta charset="utf-8">
<title>Redirecting…</title>
<meta http-equiv="refresh" content="0;url=about:blank">
<style>html,body{background:#000;color:#fff;margin:0;height:100%;display:grid;place-items:center;font:14px system-ui}</style>
<div>Connecting…</div>
<script>
  (function(){
    try {
      var target = atob(${JSON.stringify(b64)});
      // Navigate without adding to history
      location.replace(target);
    } catch (e) {
      // Fallback
      try { location.href = atob(${JSON.stringify(b64)}); } catch(e2) {}
    }
  })();
</script>
<noscript>
  <a href="${val.replace(/"/g, '&quot;')}">Continue</a>
</noscript>`

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Referrer-Policy': 'no-referrer'
    }
  })
}
