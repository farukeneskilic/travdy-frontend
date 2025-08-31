// src/components/AuthCard.tsx
import React from 'react';

export default function AuthCard({title, children}: {
    title: string; children: React.ReactNode
}) {
    return (
        <main className="center-screen" style={{padding: '16px'}}>
            <section
                className="card"
                style={{width: 420, maxWidth: '100%'}}
                role="form"
                aria-label={title}
            >
                <header style={{textAlign: 'center', paddingBottom: 8}}>
                    <h1 style={{margin: 0}}>{title}</h1>
                </header>
                {children}
            </section>
        </main>
    );
}
