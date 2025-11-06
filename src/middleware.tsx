import { match as matchLocale } from '@formatjs/intl-localematcher'
import { get } from '@vercel/edge-config'
import { jwtDecode } from 'jwt-decode'
import Negotiator from 'negotiator'
import { getToken } from 'next-auth/jwt'
import { type NextRequest, NextResponse } from 'next/server'
import { i18n } from './i18n-config'

const secret = process.env.NEXTAUTH_SECRET || ''

const isDev = process.env.NODE_ENV === 'development'

const maintenancePath = '/maintenance.html'

const getLocale = (request: NextRequest): string => {
  const headers: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    headers[key] = value
  })
  const languages = new Negotiator({ headers }).languages(i18n.locales)
  return matchLocale(languages, i18n.locales, i18n.defaultLocale)
}

const isBypassedPath = (path: string) => /(firebase-messaging-sw|api|robots|sitemap|google)/.test(path)

const protectedRoutes = [
  '/bank-account',
  '/bet-history',
  '/my-wallet',
  '/transaction-history',
  '/my-promotion',
  '/my-referral'
]
const guestOnlyRoutes = ['/forgot-password']

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl

  if (!isDev) {
    const isInMaintenanceMode = await get<boolean>('isInMaintenanceMode')

    if (isInMaintenanceMode) {
      req.nextUrl.pathname = maintenancePath
      return NextResponse.rewrite(req.nextUrl)
    } else if (pathname.startsWith(maintenancePath)) {
      req.nextUrl.pathname = '/'
      return NextResponse.rewrite(req.nextUrl)
    }
  }

  const currentLocale = pathname.split('/')[1]

  if (isBypassedPath(pathname)) return NextResponse.next()

  // 🌐 Locale handling (unchanged)
  const hasLocalePrefix = i18n.locales.some(locale => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))

  if (!hasLocalePrefix) {
    const detectedLocale = getLocale(req)
    const newUrl = new URL(req.url)
    newUrl.pathname = `/${detectedLocale}${pathname.startsWith('/') ? '' : '/'}${pathname}`
    newUrl.search = searchParams.toString()
    return NextResponse.redirect(newUrl)
  }

  // 🛑 Break redirect loop if already redirected for expired token
  const hasRedirected = req.cookies.get('token-expired')?.value === '1'
  if (hasRedirected) {
    //console.log('[Middleware] Skipping redirect loop after token-expired redirect')
    const res = NextResponse.next()
    res.cookies.delete('token-expired') // cleanup
    return res
  }

  const res = NextResponse.next()
  res.headers.set('locale', currentLocale)

  // 🎨 Theme sync (unchanged)
  const theme = req.cookies.get('theme-mode')?.value
  if (theme === 'light' || theme === 'dark') {
    res.cookies.set('theme-mode', theme, { path: '/', sameSite: 'lax' })
    res.headers.set('x-theme', theme)
  }

  // 🔑 Auth & Token Expiration
  const token = await getToken({ req, secret })
  const now = Math.floor(Date.now() / 1000)

  // 🔥 FIX: Always use the ORIGINAL JWT token expiration, not NextAuth's refreshed exp
  let realTokenExp: number | undefined = undefined

  if (token?.accessToken) {
    try {
      const decoded = jwtDecode<{ exp?: number }>(token.accessToken)
      if (decoded.exp) {
        realTokenExp = decoded.exp
        console.log('[Middleware] Real JWT exp:', decoded.exp, 'Current time:', now, 'Expired:', decoded.exp < now)
      }
    } catch (e) {
      //console.warn('[Middleware] Failed to decode accessToken:', e)
    }
  }

  // 🔥 FIX: Enhanced cookie clearing
  const clearAuthCookies = (response: NextResponse) => {
    const cookieNames = [
      'next-auth.session-token',
      '__Secure-next-auth.session-token',
      '_authorization',
      'next-auth.csrf-token',
      '__Host-next-auth.csrf-token',
      '__Secure-next-auth.csrf-token',
      'next-auth.callback-url',
      '__Secure-next-auth.callback-url'
    ]

    cookieNames.forEach(name => {
      response.cookies.set(name, '', {
        maxAge: 0,
        path: '/',
        secure: true, // 🔥 Add secure flag
        httpOnly: true, // 🔥 Add httpOnly flag where possible
        sameSite: 'lax' // 🔥 Add sameSite
      })
    })
    return response
  }

  const redirectToHome = () => {
    console.log('[Middleware] Token expired - redirecting to home')
    const redirectUrl = new URL(`/${currentLocale}`, req.url)
    const response = clearAuthCookies(NextResponse.redirect(redirectUrl))
    response.cookies.set('token-expired', '1', {
      path: '/',
      maxAge: 10, // 10 seconds marker
      sameSite: 'lax'
    })
    return response
  }

  // 🔥 FIX: Check REAL token expiration, not NextAuth's refreshed exp
  if (token?.accessToken && realTokenExp && realTokenExp < now) {
    console.log('[Auth Check] Real JWT token expired')
    return redirectToHome()
  }

  const role = req.cookies.get('user_roles')

  if (role?.value != '3' && pathname == `/${currentLocale}/affiliates`) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // 🔐 Protected route check
  const isProtected = protectedRoutes.some(route => pathname.startsWith(`/${currentLocale}${route}`))
  if (isProtected) {
    if (!token?.accessToken) {
      //console.log('[Protected] Guest accessing protected route')
      return redirectToHome()
    }
    // 🔥 FIX: Use real token expiration
    if (realTokenExp && realTokenExp < now) {
      //console.log('[Protected] Real JWT token expired on protected route')
      return redirectToHome()
    }
  }

  // 🚫 Guest-only route check (unchanged)
  const isGuestOnly = guestOnlyRoutes.some(route => pathname.startsWith(`/${currentLocale}${route}`))
  if (isGuestOnly && token?.accessToken) {
    //console.log('[Redirect] Guest-only page accessed by logged-in user:', pathname)
    return NextResponse.redirect(new URL(`/${currentLocale}`, req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/|favicon.ico|images|robots.txt|sitemap).*)']
}
