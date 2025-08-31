// app/page.tsx
import Image from 'next/image'
import Navbar from './components/Navbar'
import Section from '../app/components/Section'
import AttractionCard from '../app/components/AttractionCard'
import {getFeaturedCities, getTopAttractions} from '../app/lib/api'

export default async function AttractionPage() {
    const [cities, top] = await Promise.all([getFeaturedCities(), getTopAttractions()])

    const handleSearch = `(() => {
    const form = document.querySelector('form.search');
    form?.addEventListener('submit', () => {
      // In a real app, route to /search with URL params
    });
  })();`

    return (
        <>
            <Navbar/>

            {/* Hero */}
            <section className="container" style={{marginTop: 16}}>
                <div className="hero" aria-label="Discover the best sights with Travdy">
                    <Image
                        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1600&auto=format&fit=crop"
                        alt="" width={1600} height={800} className="hero-image" priority
                    />
                    <div className="hero-content">
                        <h1 style={{fontSize: 36, fontWeight: 800, margin: 0}}>Discover the best sights with Travdy</h1>
                        <p style={{opacity: .95, margin: '6px 0 14px'}}>Explore amazing attractions in your city!</p>
                    </div>
                </div>
            </section>

            {/* Top attractions (cities grid) */}
            <Section id="attractions" title="Top attractions">
                {cities.map(city => (<AttractionCard key={city.id} a={city}/>))}
            </Section>

            {/* Highly rated carousel */}
            <Section id="top-picks" title="Highly rated attractions" asCarousel>
                {top.map(a => (<AttractionCard key={a.id} a={a}/>))}
            </Section>

            {/* Promo banner */}
            <section className="container" style={{marginTop: 24}}>
                <div className="banner">
                    <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
                        <span className="card"
                              style={{width: 40, height: 40, display: 'grid', placeItems: 'center'}}>💌</span>
                        <div>
                            <strong>Hey there!</strong>
                            <div style={{opacity: .7}}>Want exclusive deals and personalized recommendations? Join our
                                Travel Club!
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-blue">Subscribe now</button>
                </div>
            </section>

            {/* Footer */}
            <footer className="container footer">
                <div>
                    <strong>Travdy</strong>
                    <div>Your trusted travel companion since 2023</div>
                </div>
                <div style={{display: 'grid', gap: 6}}>
                    <a href="#">Help Center</a>
                    <a href="#">Contact Us</a>
                    <a href="#">User Guide</a>
                </div>
            </footer>

            {/* Tiny inline handler stub (optional) */}
            <script dangerouslySetInnerHTML={{__html: handleSearch}}/>
        </>
    )
}
