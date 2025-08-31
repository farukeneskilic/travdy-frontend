// src/app/search/page.tsx
'use client'
import {useSearchParams} from 'next/navigation'

export default function SearchPage() {
    const params = useSearchParams()

    const location = params.get('location') || 'Any'
    const start = params.get('start') || '-'
    const end = params.get('end') || '-'
    const travelers = params.get('travelers') || '1'

    return (
        <main className="container" style={{paddingTop: 24}}>
            <h1>Search Results</h1>
            <p><strong>Location:</strong> {location}</p>
            <p><strong>Dates:</strong> {start} → {end}</p>
            <p><strong>Travelers:</strong> {travelers}</p>

            {/* Later: call your backend with these params and render cards */}
            <div className="card" style={{padding: 16, marginTop: 16}}>
                <em>TODO: Fetch results from backend based on the query parameters</em>
            </div>
        </main>
    )
}
