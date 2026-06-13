import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import LeafRating from '../components/LeafRating'
import ConditionBadge from '../components/ConditionBadge'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// ── Icons ─────────────────────────────────────────────────────────────────────
function CheckCircleIcon() {
  return (
    <svg className="h-5 w-5 text-white flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg className="h-7 w-7 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l7 4v5c0 5-3.5 9.3-7 10.5C8.5 20.3 5 16 5 11V6l7-4z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
    </svg>
  )
}

function WrenchIcon() {
  return (
    <svg className="h-7 w-7 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3-3a5 5 0 01-5.7 7.4l-4.8 4.8a2.1 2.1 0 01-3-3l4.8-4.8a5 5 0 017.4-5.7l-3 3z" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg className="h-7 w-7 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
    </svg>
  )
}

function ChevronIcon({ open }) {
  return (
    <svg className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton({ className }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200 ${className}`} />
}

function LoadingSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-8">
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-36 w-full" />
      <Skeleton className="h-28 w-full" />
    </div>
  )
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ children, className = '' }) {
  return (
    <section className={`bg-white rounded-3xl shadow-xl shadow-slate-100/50 border border-slate-100 p-6 sm:p-8 ${className}`}>
      {children}
    </section>
  )
}

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-4">{children}</p>
  )
}

// ── Timeline ─────────────────────────────────────────────────────────────────
function Timeline({ events }) {
  return (
    <ol className="mt-5 space-y-0 border-l border-slate-100 pl-4.5 ml-1">
      {events.map((e, i) => {
        const isLast = i === events.length - 1
        return (
          <li key={i} className="relative mb-5 last:mb-0">
            {/* Dot marker */}
            <div className="absolute -left-[25px] top-1 h-3.5 w-3.5 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 border-2 border-white shadow-sm" />
            
            <div>
              <p className="text-xs font-bold text-slate-800">{e.event}</p>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wide">{e.date}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function HealthCard() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [timelineOpen, setTimelineOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`${API}/api/health/${id}`)
      .then(r => r.json())
      .then(json => {
        if (json.error) { setError(true) } else { setData(json) }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50">
        <div className="h-1.5 w-full bg-emerald-500 animate-pulse" />
        <LoadingSkeleton />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center py-10">
          <svg className="mx-auto h-10 w-10 text-slate-355" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-slate-400 text-xs font-bold tracking-wider uppercase mt-3">Health card profile not found.</p>
        </div>
      </div>
    )
  }

  const {
    product_name, order_id, return_reason,
    ai_condition_tier, ai_confidence, ai_damage_notes,
    leaf_rating, original_mrp, suggested_resale_price,
    price_deduction_percentage, warranty_status,
    refurbishment_notes, lifecycle,
  } = data

  const mrp = original_mrp || 2000
  const resalePrice = suggested_resale_price || 0

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">

      {/* ── Verified banner ──────────────────────────────────────────────── */}
      <div
        className="w-full py-4 px-4 flex items-center justify-center gap-2 text-white text-xs font-black uppercase tracking-widest shadow-md"
        style={{ background: 'linear-gradient(90deg, #059669 0%, #10b981 100%)' }}
      >
        <CheckCircleIcon />
        <span>AI VERIFIED BY AMAZON REHOME ECO-SYSTEM</span>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-2xl px-4 py-10 space-y-6 animate-fade-in-up">

        {/* ── S1: Product Identity ──────────────────────────────────────── */}
        <Section>
          <SectionLabel>Product Identity</SectionLabel>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight tracking-tight">
            {product_name}
          </h1>
          <div className="mt-3.5 flex flex-wrap gap-2 items-center">
            <span className="font-mono text-xs font-bold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md">
              ID: {order_id}
            </span>
            {return_reason && (
              <span className="inline-block rounded-full bg-orange-50 border border-orange-100 px-3 py-0.5 text-xs text-orange-700 font-bold">
                Reason: {return_reason}
              </span>
            )}
          </div>
        </Section>

        {/* ── S2: Condition Summary ─────────────────────────────────────── */}
        <Section>
          <SectionLabel>Condition Summary</SectionLabel>
          <div className="flex flex-col items-center gap-4 text-center pb-5 border-b border-slate-50">
            <LeafRating rating={leaf_rating ?? 0} />
            <ConditionBadge tier={ai_condition_tier || 'Pending'} />
            {ai_damage_notes && (
              <p className="text-sm font-semibold text-slate-600 max-w-md leading-relaxed bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl">
                "{ai_damage_notes}"
              </p>
            )}
          </div>

          {/* Confidence bar */}
          {ai_confidence != null && (
            <div className="mt-5">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Grading Confidence</span>
                <span className="text-xs font-bold text-slate-700">{ai_confidence}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${ai_confidence}%`,
                    backgroundColor: ai_confidence >= 85 ? '#10b981' : ai_confidence >= 70 ? '#f59e0b' : '#ef4444',
                  }}
                />
              </div>
            </div>
          )}
        </Section>

        {/* ── S3: Price Transparency ────────────────────────────────────── */}
        <Section>
          <SectionLabel>Price Transparency</SectionLabel>
          <div className="relative flex flex-col sm:flex-row items-stretch gap-4">

            {/* Original MRP */}
            <div className="flex-1 rounded-2xl border border-slate-150 bg-slate-50/50 p-5 flex flex-col justify-center text-center sm:text-left">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Original MRP</p>
              <p className="text-2xl font-bold text-slate-300 line-through">
                ₹{mrp.toLocaleString('en-IN')}
              </p>
            </div>

            {/* % OFF badge */}
            {price_deduction_percentage > 0 && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10
                              hidden sm:flex h-12 w-12 flex-col items-center justify-center rounded-full
                              bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-300/40">
                <span className="text-xs font-black leading-none">{price_deduction_percentage}%</span>
                <span className="text-[8px] font-extrabold leading-none mt-0.5">OFF</span>
              </div>
            )}

            {/* Rehome Price */}
            <div className="flex-1 rounded-2xl border-2 border-orange-400 bg-orange-50/[0.15] p-5 flex flex-col justify-center text-center sm:text-right">
              <p className="text-[10px] font-extrabold text-orange-500 uppercase tracking-wider mb-1">Rehome Price</p>
              <p className="text-3xl font-black text-orange-500">
                ₹{resalePrice > 0 ? resalePrice.toLocaleString('en-IN') : '—'}
              </p>
            </div>

          </div>
        </Section>

        {/* ── S4: Trust Details ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

          {/* Warranty */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/50 border border-slate-100 p-6 flex flex-col gap-4">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <ShieldIcon />
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Warranty</p>
              <p className="text-sm font-bold text-slate-800">{warranty_status || 'Not available'}</p>
            </div>
          </div>

          {/* Refurbishment */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/50 border border-slate-100 p-6 flex flex-col gap-4">
            <div className="h-10 w-10 rounded-2xl bg-blue-50 flex items-center justify-center">
              <WrenchIcon />
            </div>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Refurbishment</p>
              <p className={`text-sm font-bold ${refurbishment_notes ? 'text-slate-800' : 'text-slate-400'}`}>
                {refurbishment_notes || 'Not Required'}
              </p>
            </div>
          </div>

          {/* Item History / Timeline */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/50 border border-slate-100 p-6 flex flex-col gap-4">
            <div className="h-10 w-10 rounded-2xl bg-orange-50 flex items-center justify-center">
              <ClockIcon />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Item History</p>
              <button
                className="cursor-pointer flex items-center gap-1.5 text-xs font-bold text-orange-500 hover:text-orange-600 transition"
                onClick={() => setTimelineOpen(o => !o)}
                aria-expanded={timelineOpen}
              >
                {timelineOpen ? 'Hide History' : 'View Timeline'}
                <ChevronIcon open={timelineOpen} />
              </button>
              {timelineOpen && lifecycle?.length > 0 && (
                <Timeline events={lifecycle} />
              )}
            </div>
          </div>

        </div>

        {/* ── S5: Footer ────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-3.5 pt-6 pb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-gradient-to-tr from-amber-500 to-orange-400 text-sm font-black text-slate-950">
            a
          </div>
          <p className="text-[10px] font-bold text-slate-400 text-center leading-relaxed uppercase tracking-wider">
            Verified by Amazon Rehome AI · Condition evaluated in real-time
          </p>
        </div>

      </main>
    </div>
  )
}
