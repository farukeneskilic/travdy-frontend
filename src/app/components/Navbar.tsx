import Link from 'next/link'

export default function Navbar() {
    return (
        <header className="container" style={{padding: '12px 0', display: 'flex', gap: 16}}>
            <nav style={{display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 12}}>
                <div style={{display: 'flex', gap: 16, alignItems: 'center'}}>
                    <Link href="/" style={{fontWeight: 800, fontSize: 20, color: 'var(--td-dark)'}}>Travdy</Link>
                    <Link href="/#activities">Activities</Link>
                    <Link href="/#attractions">Attractions</Link>
                    <Link href="/#top-picks">Top Picks</Link>
                    <Link href="/travel-budget">Travel Budget</Link>
                </div>
                <div style={{display: 'flex', gap: 8}}>
                    <Link href="/login" className="btn btn-blue">Log in</Link>
                </div>
            </nav>
        </header>
    )
}
