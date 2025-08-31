// src/components/HeroSearch.tsx
'use client';

import {useRouter} from 'next/navigation';
import {useState} from 'react';

export default function HeroSearch() {
    const [location, setLocation] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [trav, setTrav] = useState(2);
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const p = new URLSearchParams();
        if (location) p.set('location', location.trim());
        if (start) p.set('start', start);
        if (end) p.set('end', end);
        if (trav) p.set('travelers', String(trav));
        router.push(`/search?${p.toString()}`);
    };

    return (
        <form className="search" onSubmit={handleSubmit}>
            <input
                aria-label="Location"
                placeholder="Where to explore?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />
            <input aria-label="Start date" type="date" value={start} onChange={(e) => setStart(e.target.value)}/>
            <input aria-label="End date" type="date" value={end} onChange={(e) => setEnd(e.target.value)}/>
            <select aria-label="Travelers" value={trav} onChange={(e) => setTrav(parseInt(e.target.value, 10))}>
                {[1, 2, 3, 4, 5, 6].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'traveler' : 'travelers'}</option>
                ))}
            </select>
            <button className="btn btn-blue" aria-label="Search">Search</button>
        </form>
    );
}
