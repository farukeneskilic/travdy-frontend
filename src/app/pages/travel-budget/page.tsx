// src/app/travel-budget/page.tsx
'use client';

import Link from "next/link";
import React, {useEffect, useMemo, useState} from 'react';

type Categories = {
    accommodation: number;
    food: number;
    activities: number;
    transport: number;
    other: number;
};

type BudgetState = {
    estimated: number;
    categories: Categories;
};

const empty: BudgetState = {
    estimated: 0,
    categories: {accommodation: 0, food: 0, activities: 0, transport: 0, other: 0},
};
const STORAGE_KEY = 'travdy_budget';

export default function TravelBudgetPage() {
    const [state, setState] = useState<BudgetState>(empty);

    // load/save
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) setState(JSON.parse(raw));
        } catch {
        }
    }, []);
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch {
        }
    }, [state]);

    const totalPlanned = useMemo(() => {
        const c = state.categories;
        return c.accommodation + c.food + c.activities + c.transport + c.other;
    }, [state]);

    const remaining = Math.max(0, state.estimated - totalPlanned);
    const over = Math.max(0, totalPlanned - state.estimated);

    const setCat = (k: keyof Categories, v: number) =>
        setState(s => ({...s, categories: {...s.categories, [k]: Math.max(0, v)}}));

    return (
        <main className="container" style={{paddingTop: 16, paddingBottom: 24}}>
            {/* top nav mimic (optional: if you don’t already show Navbar here) */}
            <header style={{display: 'flex', justifyContent: 'flex-end', gap: 16, marginBottom: 8}}>
                <Link href="/public">Home</Link>
                <a href="/travel-budget" aria-current="page">Travel Budget</a>
                <a href="/login">Login</a>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(260px, 1fr) minmax(380px, 2fr) minmax(220px, 1fr)',
                gap: 16
            }}>
                {/* Left: form */}
                <section className="card" aria-labelledby="budget-form-title" style={{background: '#D9EFF6'}}>
                    <div style={{padding: 16}}>
                        <h2 id="budget-form-title" style={{marginTop: 4}}>Set Your Travel Budget</h2>

                        <label htmlFor="estimated"><small>Estimated Budget</small></label>
                        <input
                            id="estimated"
                            inputMode="decimal"
                            className="input"
                            placeholder="Enter your total estimated budget"
                            value={state.estimated || ''}
                            onChange={e => setState(s => ({...s, estimated: Number(e.target.value || 0)}))}
                        />
                        <div style={{height: 10}}/>

                        <h3 style={{marginBottom: 6}}>Expense Categories</h3>

                        <Field
                            id="acc" label="Accommodation"
                            value={state.categories.accommodation}
                            placeholder="Estimated cost for accommodation"
                            onChange={v => setCat('accommodation', v)}
                        />
                        <Field
                            id="food" label="Food"
                            value={state.categories.food}
                            placeholder="Estimated cost for food"
                            onChange={v => setCat('food', v)}
                        />
                        <Field
                            id="act" label="Activities"
                            value={state.categories.activities}
                            placeholder="Estimated cost for activities"
                            onChange={v => setCat('activities', v)}
                        />
                        <Field
                            id="transport" label="Transport"
                            value={state.categories.transport}
                            placeholder="Estimated cost for transport"
                            onChange={v => setCat('transport', v)}
                        />
                        <Field
                            id="other" label="Other"
                            value={state.categories.other}
                            placeholder="Estimated cost for other"
                            onChange={v => setCat('other', v)}
                        />

                        <div style={{height: 10}}/>
                        <SummaryBar
                            estimated={state.estimated}
                            planned={totalPlanned}
                            remaining={remaining}
                            over={over}
                        />
                    </div>
                </section>

                {/* Center: chart */}
                <section className="card" aria-labelledby="budget-tracker-title" style={{background: '#D6D6D6'}}>
                    <div style={{padding: 16}}>
                        <h3 id="budget-tracker-title">Budget Tracker</h3>
                        <div style={{display: 'grid', placeItems: 'center', minHeight: 520}}>
                            <BudgetPie
                                size={280}
                                data={[
                                    {
                                        label: 'Accommodation',
                                        value: state.categories.accommodation,
                                        color: 'var(--td-blue)'
                                    },
                                    {label: 'Food', value: state.categories.food, color: '#0E7490'},
                                    {label: 'Activities', value: state.categories.activities, color: '#0284C7'},
                                    {label: 'Transport', value: state.categories.transport, color: '#0891B2'},
                                    {label: 'Other', value: state.categories.other, color: '#67E8F9'},
                                ]}
                            />
                        </div>
                    </div>
                </section>

                {/* Right: tips */}
                <aside className="card" aria-labelledby="tips-title" style={{background: '#F7F7F7'}}>
                    <div style={{padding: 16}}>
                        <h3 id="tips-title">Money-Saving Tips</h3>
                        <ul style={{listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 14}}>
                            <Tip icon="✈️" text="Book flights in advance to catch early bird deals."/>
                            <Tip icon="🍜" text="Try street food for a budget-friendly, authentic experience."/>
                            <Tip icon="🏳️" text="Consider hostels or Airbnb for affordable accommodation."/>
                        </ul>
                    </div>
                </aside>
            </div>
        </main>
    );
}

/* ---------- small components ---------- */

function Field({
                   id, label, value, placeholder, onChange,
               }: { id: string; label: string; value: number; placeholder: string; onChange: (v: number) => void }) {
    return (
        <div style={{marginBottom: 10}}>
            <label htmlFor={id}><small>{label}</small></label>
            <input
                id={id}
                inputMode="decimal"
                className="input"
                placeholder={placeholder}
                value={value || ''}
                onChange={e => onChange(Number(e.target.value || 0))}
            />
        </div>
    );
}

function Tip({icon, text}: { icon: string; text: string }) {
    return (
        <li style={{display: 'grid', gridTemplateColumns: '24px 1fr', gap: 10}}>
            <span aria-hidden="true">{icon}</span>
            <span>{text}</span>
        </li>
    );
}

function SummaryBar({
                        estimated, planned, remaining, over,
                    }: { estimated: number; planned: number; remaining: number; over: number }) {
    const ok = estimated >= planned;
    return (
        <div className="card" style={{background: '#fff', padding: 12}}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8}}>
                <Stat label="Estimated" value={estimated}/>
                <Stat label="Planned" value={planned}/>
                <Stat label={ok ? 'Remaining' : 'Over'} value={ok ? remaining : over} danger={!ok}/>
            </div>
            <div style={{marginTop: 10, height: 8, borderRadius: 999, background: '#E5E7EB', overflow: 'hidden'}}
                 aria-hidden>
                <div
                    style={{
                        width: `${estimated ? Math.min(100, (planned / Math.max(1, estimated)) * 100) : 0}%`,
                        height: '100%', background: ok ? 'var(--td-green)' : '#EF4444'
                    }}
                />
            </div>
        </div>
    );
}

function Stat({label, value, danger}: { label: string; value: number; danger?: boolean }) {
    const color = danger ? '#B91C1C' : 'inherit';
    return (
        <div>
            <small style={{opacity: .7}}>{label}</small>
            <div style={{fontWeight: 700, color}}>{formatCurrency(value)}</div>
        </div>
    );
}

function formatCurrency(n: number) {
    if (!Number.isFinite(n)) return '-';
    return new Intl.NumberFormat(undefined, {style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(n);
}

/* ---------- SVG Pie Chart (no deps) ---------- */

function BudgetPie({size = 260, data}: {
    size?: number;
    data: { label: string; value: number; color: string }[];
}) {
    const total = Math.max(0.0001, data.reduce((s, d) => s + (d.value || 0), 0));
    const radius = size / 2;
    let angle = -Math.PI / 2; // start at top

    const slices = data.map((d, i) => {
        const share = (d.value || 0) / total;
        const theta = share * Math.PI * 2;
        const start = polar(radius, angle);
        const end = polar(radius, angle + theta);
        const largeArc = theta > Math.PI ? 1 : 0;
        angle += theta;
        const path = [
            `M ${radius} ${radius}`,
            `L ${radius + start.x} ${radius + start.y}`,
            `A ${radius} ${radius} 0 ${largeArc} 1 ${radius + end.x} ${radius + end.y}`,
            'Z'
        ].join(' ');
        return <path key={i} d={path} fill={d.color} aria-label={`${d.label}: ${Math.round(share * 100)}%`}/>;
    });

    return (
        <figure aria-label="Budget distribution">
            <svg width={size} height={size} role="img">{slices}</svg>
            <figcaption style={{textAlign: 'center', marginTop: 8, fontSize: 12, opacity: .8}}>
                {data.map((d, i) => (
                    <span key={i} style={{display: 'inline-flex', alignItems: 'center', gap: 6, margin: '0 8px'}}>
            <span style={{width: 10, height: 10, background: d.color, display: 'inline-block', borderRadius: 2}}/>
                        {d.label}
          </span>
                ))}
            </figcaption>
        </figure>
    );
}

function polar(r: number, a: number) {
    return {x: r * Math.cos(a), y: r * Math.sin(a)};
}
