// app/layout.tsx
import type {Metadata} from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Travdy — Discover the best sights',
    description: 'Plan trips, find attractions, and track your travel budget.',
    icons: [{rel: 'icon', url: '/logo.svg'}],
}

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    )
}
