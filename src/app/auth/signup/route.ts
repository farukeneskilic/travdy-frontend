// src/app/api/auth/signup/route.ts
import {NextResponse} from 'next/server'

const API = process.env.AUTH_API_BASE!
const COOKIE = process.env.COOKIE_NAME || 'travdy_session'

export async function POST(req: Request) {
    try {
        const body = await req.json() as { email: string; password: string; displayName: string }
        const r = await fetch(`${API}/auth/signup`, {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                email: body.email,
                password: body.password,
                displayName: body.displayName
            }),
        })

        const data = await r.json()
        if (!r.ok || !data?.token) {
            return NextResponse.json(
                {error: data?.error ?? {message: 'Could not create account'}},
                {status: r.status || 400}
            )
        }

        const res = NextResponse.json({
            ok: true, user: {
                userId: data.userId, email: data.email, displayName: data.displayName
            }
        })

        res.cookies.set(COOKIE, data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        })
        return res
    } catch {
        return NextResponse.json({error: {message: 'Signup failed'}}, {status: 500})
    }
}
