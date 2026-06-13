import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import LeafRating from '../components/LeafRating'
import ConditionBadge from '../components/ConditionBadge'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// ── Circular Confidence Ring ──────────────────────────────────────────────────
function ConfidenceRing({ value, size = 120 }) {
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  const color = value >= 85 ? '#10b981' : value >= 70 ? '#f59e0b' : '#ef4444'
  const bgColor = value >= 85 ? 'from-emerald-950/20' : value >= 70 ? 'from-amber-950/20' : 'from-rose-950/20'

  return (
    <div className={`relative inline-flex items-center justify-center bg-gradient-to-br ${bgColor} to-slate-900/40 border border-white/[0.06] rounded-full p-2`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#1e293b" strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black" style={{ color }}>{value}%</span>
        <span className="text-[8px] font-extrabold text-zinc-400 uppercase tracking-widest">Confidence</span>
      </div>
    </div>
  )
}

// ── Icons ─────────────────────────────────────────────────────────────────────
function CheckCircleIcon() {
  return (
    <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l7 4v5c0 5-3.5 9.3-7 10.5C8.5 20.3 5 16 5 11V6l7-4z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
    </svg>
  )
}

function WrenchIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3-3a5 5 0 01-5.7 7.4l-4.8 4.8a2.1 2.1 0 01-3-3l4.8-4.8a5 5 0 017.4-5.7l-3 3z" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
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
  return <div className={`animate-pulse rounded-xl bg-slate-800/40 shimmer-bg ${className}`} />
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
function Section({ children, className = '', delay = '0ms' }) {
  return (
    <section
      className={`glass-panel rounded-3xl shadow-2xl p-6 sm:p-8 animate-fade-in-up ${className}`}
      style={{ animationDelay: delay }}
    >
      {children}
    </section>
  )
}

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-455 mb-4">{children}</p>
  )
}

// ── Timeline ─────────────────────────────────────────────────────────────────
function Timeline({ events }) {
  return (
    <ol className="mt-5 space-y-0 border-l-2 border-white/10 pl-5 ml-1">
      {events.map((e, i) => {
        return (
          <li key={i} className="relative mb-5 last:mb-0 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
            {/* Dot marker */}
            <div className="absolute -left-[27px] top-1 h-4 w-4 rounded-full bg-gradient-to-tr from-orange-500 to-amber-450 border-2 border-[#080c14] shadow-md shadow-orange-500/20" />
            
            <div>
              <p className="text-xs font-bold text-slate-200">{e.event}</p>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wide">{e.date}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

// ── Trust Detail Card ─────────────────────────────────────────────────────────
function TrustCard({ icon, gradient, iconBg, label, children, delay = '0ms' }) {
  return (
    <div
      className={`glass-panel rounded-3xl p-6 flex flex-col gap-4 animate-fade-in-up hover:-translate-y-1 transition-all duration-300`}
      style={{ animationDelay: delay }}
    >
      <div className={`h-12 w-12 rounded-2xl ${iconBg} flex items-center justify-center shadow-md`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-455 mb-1.5">{label}</p>
        {children}
      </div>
    </div>
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
      <div className="min-h-screen bg-[#080c14] mesh-gradient">
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-green-400 animate-pulse" />
        <LoadingSkeleton />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#080c14] mesh-gradient flex items-center justify-center">
        <div className="text-center py-10 animate-fade-in-up">
          <div className="h-16 w-16 mx-auto rounded-full bg-slate-900/40 flex items-center justify-center border border-white/10 mb-4">
            <svg className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm font-bold text-slate-200">Health card not found</p>
          <p className="text-xs text-slate-400 mt-1">The product may not have been graded yet.</p>
          <Link to="/admin" className="mt-4 inline-block text-xs font-bold text-orange-500 hover:text-orange-400 hover:underline">
            ← Back to Admin Dashboard
          </Link>
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
    <div className="min-h-screen bg-[#080c14] pb-16 mesh-gradient">

      {/* ── Verified banner ──────────────────────────────────────────────── */}
      <div
        className="w-full py-4 px-4 flex items-center justify-center gap-3 text-emerald-400 bg-emerald-950/40 border-b border-emerald-500/25 text-xs font-black uppercase tracking-widest shadow-lg relative overflow-hidden"
      >
        {/* Animated shine effect */}
        <div className="absolute inset-0 shimmer-bg opacity-10" />
        <CheckCircleIcon />
        <span className="relative z-10 tracking-widest">AI VERIFIED BY AMAZON REHOME ECO-SYSTEM</span>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-2xl px-4 py-10 space-y-6">

        {/* ── S1: Product Identity ──────────────────────────────────────── */}
        <Section delay="0ms">
          <SectionLabel>Product Identity</SectionLabel>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 leading-tight tracking-tight">
            {product_name}
          </h1>
          <div className="mt-4 flex flex-wrap gap-2.5 items-center">
            <span className="font-mono text-xs font-bold bg-slate-900/50 text-slate-400 px-3 py-1.5 rounded-lg border border-white/[0.06]">
              ID: {order_id}
            </span>
            {return_reason && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-950/20 border border-orange-500/20 px-3.5 py-1 text-xs text-orange-400 font-bold">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                {return_reason}
              </span>
            )}
          </div>
        </Section>

        {/* ── S2: Condition Summary ─────────────────────────────────────── */}
        <Section delay="100ms">
          <SectionLabel>Condition Summary</SectionLabel>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {/* Confidence Ring */}
            {ai_confidence != null && (
              <div className="flex-shrink-0">
                <ConfidenceRing value={ai_confidence} />
              </div>
            )}
            
            {/* Grade details */}
            <div className="flex flex-col items-center sm:items-start gap-4 text-center sm:text-left flex-1">
              <div className="scale-110 origin-left">
                <LeafRating rating={leaf_rating ?? 0} />
              </div>
              <ConditionBadge tier={ai_condition_tier || 'Pending'} />
              {ai_damage_notes && (
                <p className="text-sm font-semibold text-slate-350 leading-relaxed bg-slate-950/40 border border-white/[0.05] px-5 py-3.5 rounded-2xl italic">
                  "{ai_damage_notes}"
                </p>
              )}
            </div>
          </div>
        </Section>

        {/* ── S3: Price Transparency ────────────────────────────────────── */}
        <Section delay="200ms">
          <SectionLabel>Price Transparency</SectionLabel>
          <div className="relative flex flex-col sm:flex-row items-stretch gap-4">

            {/* Original MRP */}
            <div className="flex-1 rounded-2xl border border-white/[0.06] bg-slate-900/40 p-6 flex flex-col justify-center text-center sm:text-left">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Original MRP</p>
              <p className="text-2xl font-bold text-slate-500 line-through">
                ₹{mrp.toLocaleString('en-IN')}
              </p>
            </div>

            {/* % OFF badge */}
            {price_deduction_percentage > 0 && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10
                              hidden sm:flex h-14 w-14 flex-col items-center justify-center rounded-full
                              bg-gradient-to-tr from-orange-500 to-amber-600 text-white shadow-xl shadow-orange-500/20">
                <span className="text-sm font-black leading-none">{price_deduction_percentage}%</span>
                <span className="text-[7px] font-extrabold leading-none mt-0.5">OFF</span>
              </div>
            )}

            {/* Rehome Price */}
            <div className="flex-1 rounded-2xl border-2 border-orange-500/50 bg-orange-950/10 p-6 flex flex-col justify-center text-center sm:text-right shadow-[0_0_15px_rgba(239,68,68,0.05)]">
              <p className="text-[10px] font-extrabold text-orange-500 uppercase tracking-widest mb-1">Rehome Price</p>
              <p className="text-3xl font-black text-orange-500 drop-shadow-[0_0_6px_rgba(249,115,22,0.2)]">
                ₹{resalePrice > 0 ? resalePrice.toLocaleString('en-IN') : '—'}
              </p>
            </div>

          </div>
        </Section>

        {/* ── S4: Trust Details ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

          {/* Warranty */}
          <TrustCard
            icon={<ShieldIcon />}
            iconBg="bg-gradient-to-tr from-emerald-500/20 to-green-450/10 border border-emerald-500/30 text-emerald-400"
            label="Warranty"
            delay="300ms"
          >
            <p className="text-sm font-bold text-slate-200">{warranty_status || 'Not available'}</p>
          </TrustCard>

          {/* Refurbishment */}
          <TrustCard
            icon={<WrenchIcon />}
            iconBg="bg-gradient-to-tr from-blue-500/20 to-indigo-400/10 border border-blue-500/30 text-blue-400"
            label="Refurbishment"
            delay="400ms"
          >
            <p className={`text-sm font-bold ${refurbishment_notes ? 'text-slate-200' : 'text-slate-500'}`}>
              {refurbishment_notes || 'Not Required'}
            </p>
          </TrustCard>

          {/* Item History / Timeline */}
          <TrustCard
            icon={<ClockIcon />}
            iconBg="bg-gradient-to-tr from-orange-500/20 to-amber-400/10 border border-orange-500/30 text-orange-400"
            label="Item History"
            delay="500ms"
          >
            <button
              className="cursor-pointer flex items-center gap-1.5 text-xs font-bold text-orange-500 hover:text-orange-400 transition"
              onClick={() => setTimelineOpen(o => !o)}
              aria-expanded={timelineOpen}
            >
              {timelineOpen ? 'Hide History' : 'View Timeline'}
              <ChevronIcon open={timelineOpen} />
            </button>
            {timelineOpen && lifecycle?.length > 0 && (
              <Timeline events={lifecycle} />
            )}
          </TrustCard>

        </div>

        {/* ── S5: Footer ────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-4 pt-8 pb-6 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 text-sm font-black text-slate-900 shadow-lg shadow-orange-500/20">
            a
          </div>
          <p className="text-[10px] font-bold text-slate-400 text-center leading-relaxed uppercase tracking-widest">
            Verified by Amazon Rehome AI · Condition evaluated in real-time
          </p>
          <Link
            to="/rehome"
            className="mt-2 text-xs font-bold text-orange-500 hover:text-orange-400 flex items-center gap-1 transition-colors"
          >
            ← Browse Marketplace
          </Link>
        </div>

      </main>
    </div>
  )
}
