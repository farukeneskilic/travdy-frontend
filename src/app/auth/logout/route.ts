// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server'
const COOKIE = process.env.COOKIE_NAME || 'travdy_session'

export async function POST() {
    const res = NextResponse.json({ ok: true })
    res.cookies.set(COOKIE, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    })
    return res
}
