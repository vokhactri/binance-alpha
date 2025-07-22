import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin')
    const referer = request.headers.get('referer')

    const isAllowedDomain = (domain: string) => {
      return domain === 'http://localhost:3000'
        || domain === 'https://alpha.trivk.dev'
        || domain.endsWith('.alpha.trivk.dev')
    }

    const isValidOrigin = origin && isAllowedDomain(origin)
    const isValidReferer = referer && (
      isAllowedDomain(referer)
      || isAllowedDomain(new URL(referer).origin)
    )

    if (!isValidOrigin && !isValidReferer) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const userAgent = request.headers.get('user-agent')
    const blockedUserAgents = ['curl/', 'wget/', 'python-requests/', 'postman', 'insomnia', 'httpie']

    if (userAgent && blockedUserAgents.some(blocked => userAgent.toLowerCase().includes(blocked))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const response = NextResponse.next()

    // CORS Headers
    response.headers.set('Access-Control-Allow-Origin', origin || 'http://localhost:3000')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key')
    response.headers.set('Access-Control-Max-Age', '86400')

    // Security Headers
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*'],
}
