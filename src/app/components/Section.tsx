// components/Section.tsx
import {ReactNode} from 'react'

export default function Section({id, title, children, asCarousel = false}: {
    id?: string; title: string; children: ReactNode; asCarousel?: boolean
}) {
    return (
        <section id={id} className="container" style={{marginTop: 24}}>
            <h2 style={{marginBottom: 12}}>{title}</h2>
            <div className={asCarousel ? 'carousel' : 'grid grid-auto-tiles'}>
                {children}
            </div>
        </section>
    )
}
