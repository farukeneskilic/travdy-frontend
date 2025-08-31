// components/AttractionCard.tsx
import Image from 'next/image'
import Link from 'next/link'

export type Attraction = {
    id: string; city: string; title: string
    image: string; priceFrom?: string; rating?: number
}

export default function AttractionCard({a}: { a: Attraction }) {
    return (
        <article className="card" style={{position: 'relative', minWidth: 260}}>
            <div style={{position: 'relative'}}>
                {!!a.rating && <span className="badge">{a.rating.toFixed(1)}</span>}
                <Image
                    src={a.image}
                    alt={a.title}
                    width={640} height={480} className="card-img"
                    sizes="(max-width: 768px) 90vw, 33vw" priority={false}
                />
            </div>
            <div className="card-body">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                    <strong>{a.title}</strong>
                    {!!a.priceFrom && <small style={{opacity: .8}}>from {a.priceFrom}</small>}
                </div>
                <small style={{opacity: .7}}>{a.city}</small>
            </div>
            <Link href={`/attraction/${a.id}`} aria-label={`View ${a.title}`} style={{position: 'absolute', inset: 0}}/>
        </article>
    )
}
