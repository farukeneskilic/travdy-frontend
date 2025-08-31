// src/lib/server-api.ts
import {cookies} from 'next/headers'

const API = process.env.AUTH_API_BASE!
const COOKIE = process.env.COOKIE_NAME || 'travdy_session'

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
    const token = (await cookies()).get(COOKIE)?.value
    const r = await fetch(`${API}${path}`, {
        ...init,
        headers: {
            ...(init?.headers || {}),
            ...(token ? {Authorization: `Bearer ${token}`} : {}),
        },
        // cache strategy as needed:
        next: {revalidate: 0},
    })
    if (!r.ok) {
        throw new Error(`API error ${r.status}`)
    }
    return r.json()
}
