import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE = process.env.COOKIE_NAME || 'travdy_session'
const PROTECTED_PREFIXES = ['/dashboard', '/account']

export function middleware(req: NextRequest) {
    const url = req.nextUrl
    if (PROTECTED_PREFIXES.some(p => url.pathname.startsWith(p))) {
        const hasSession = req.cookies.get(COOKIE)?.value
        if (!hasSession) {
            const login = new URL('/login', url)
            login.searchParams.set('next', url.pathname)
            return NextResponse.redirect(login)
        }
    }
    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/account/:path*'],
}
