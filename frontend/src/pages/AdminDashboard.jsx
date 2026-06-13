import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import ConditionBadge from '../components/ConditionBadge'
import LeafRating from '../components/LeafRating'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// ── Circular Progress Ring ────────────────────────────────────────────────────
// ── Circular Progress Ring ────────────────────────────────────────────────────
function CircularProgress({ value, size = 48, strokeWidth = 4, color = '#FF9900' }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth={strokeWidth} />
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset}
        className="transition-all duration-1000 ease-out" />
    </svg>
  )
}

// ── Summary card ──────────────────────────────────────────────────────────────
function SummaryCard({ label, value, colorClass, icon, total }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  const colors = {
    orange: { ring: '#FF9900', bg: 'stat-card-orange' },
    amber: { ring: '#f59e0b', bg: 'stat-card-amber' },
    emerald: { ring: '#10b981', bg: 'stat-card-emerald' },
    rose: { ring: '#ef4444', bg: 'stat-card-rose' },
  }
  const c = colors[colorClass] || colors.orange
  return (
    <div className={`${c.bg} rounded-2xl border border-slate-200/50 dark:border-white/5 shadow-md shadow-black/[0.01] dark:shadow-black/20 px-6 py-5 flex items-center justify-between
                     transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-default group`}>
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-455 uppercase tracking-widest">{label}</span>
        <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight animate-count-up">{value}</span>
      </div>
      <div className="relative h-12 w-12 flex items-center justify-center">
        <CircularProgress value={pct || (value > 0 ? 100 : 0)} size={48} color={c.ring} />
        <div className="absolute inset-0 flex items-center justify-center text-slate-500 dark:text-slate-455 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>
    </div>
  )
}

// ── Confidence bar ─────────────────────────────────────────────────────────────
function ConfidenceBar({ value }) {
  if (value == null) return <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pending</span>
  const pct = Math.min(100, Math.max(0, value))
  const color = pct >= 85 ? '#10b981' : pct >= 70 ? '#f59e0b' : '#ef4444'
  const badgeStyle = pct >= 85
    ? 'bg-emerald-100/50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20'
    : pct >= 70
    ? 'bg-amber-100/50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20'
    : 'bg-rose-100/50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-500/20'
  return (
    <div className="flex items-center gap-2.5 min-w-[100px]">
      <div className="flex-1 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${badgeStyle}`}>{pct}%</span>
    </div>
  )
}

// ── Skeleton row ──────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-5 py-5">
          <div className="h-4 bg-slate-200 dark:bg-slate-800/60 rounded-lg w-full shimmer-bg" />
        </td>
      ))}
    </tr>
  )
}

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg className="animate-spin h-3.5 w-3.5 text-current" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}

// ── Icons for Summary Cards ───────────────────────────────────────────────────
function PackageIcon() {
  return (
    <svg className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg className="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [returns, setReturns] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState({}) // { [id]: 'grade' | 'approve' }
  const navigate = useNavigate()

  const fetchReturns = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/returns`)
      const data = await res.json()
      setReturns(data)
    } catch {
      // keep existing data on poll failure
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch + 30s poll
  useEffect(() => {
    fetchReturns()
    const interval = setInterval(fetchReturns, 30000)
    return () => clearInterval(interval)
  }, [fetchReturns])

  // ── Actions ────────────────────────────────────────────────────────────────
  async function handleGrade(id) {
    setActionLoading(prev => ({ ...prev, [id]: 'grade' }))
    try {
      const res = await fetch(`${API}/api/grade/${id}`, { method: 'POST' })
      const result = await res.json()
      setReturns(prev =>
        prev.map(r =>
          r.id === id
            ? {
                ...r,
                ai_condition_tier: result.condition_tier,
                ai_confidence: result.confidence,
                ai_damage_notes: result.damage_notes,
                suggested_resale_price: result.suggested_resale_price,
                routing_decision: result.routing_decision,
                routing_reason: result.routing_reason,
                status: 'graded',
              }
            : r
        )
      )
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: null }))
    }
  }

  async function handleApprove(id) {
    setActionLoading(prev => ({ ...prev, [id]: 'approve' }))
    try {
      await fetch(`${API}/api/approve/${id}`, { method: 'POST' })
      setReturns(prev =>
        prev.map(r => (r.id === id ? { ...r, status: 'listed' } : r))
      )
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: null }))
    }
  }

  // ── Summary counts ─────────────────────────────────────────────────────────
  const total = returns.length
  const pending = returns.filter(r => r.status === 'pending_grading').length
  const listed = returns.filter(r => r.status === 'listed').length
  const donatedOrLiquidated = returns.filter(r =>
    r.routing_decision && (
      r.routing_decision.toLowerCase().includes('donat') ||
      r.routing_decision.toLowerCase().includes('liquidat')
    )
  ).length

  // ── Leaf rating derived from confidence ────────────────────────────────────
  function confidenceToLeaves(confidence) {
    if (confidence == null) return 0
    if (confidence >= 95) return 5
    if (confidence >= 85) return 4
    if (confidence >= 75) return 3
    if (confidence >= 65) return 2
    return 1
  }

  return (
    <div className="min-h-screen py-10 mesh-gradient">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 animate-fade-in-up">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-orange-600 dark:text-orange-400 text-[10px] font-bold tracking-widest mb-3">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
              OPERATIONS CONTROL CENTER
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1.5 leading-relaxed">
              Monitor returns, trigger AI automated condition grading, and approve regional marketplace listings.
            </p>
          </div>
          <button
            onClick={fetchReturns}
            className="self-start sm:self-center inline-flex items-center gap-2.5 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 px-5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-350 dark:hover:border-white/20 cursor-pointer shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
          >
            <svg className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Sync Data
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <SummaryCard label="Total Returns"         value={total}               colorClass="orange"  icon={<PackageIcon />} total={total} />
          <SummaryCard label="Pending AI Grading"    value={pending}             colorClass="amber"   icon={<ClockIcon />}   total={total} />
          <SummaryCard label="Listed on Rehome"      value={listed}              colorClass="emerald" icon={<GlobeIcon />}   total={total} />
          <SummaryCard label="Donated / Liquidated"  value={donatedOrLiquidated} colorClass="rose"    icon={<TrashIcon />}   total={total} />
        </div>

        {/* Table card */}
        <div className="glass-panel rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-slate-900/40">
                  {['Order ID', 'Product Details', 'Reason', 'Customer Declared',
                    'AI Grade Assessment', 'Confidence Score', 'Routing Decision', 'Operation Action'].map(col => (
                    <th
                      key={col}
                      className="px-5 py-4 text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04] text-sm">
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
                  : returns.map((row, index) => {
                      const busy = actionLoading[row.id]
                      const canGrade   = row.status === 'pending_grading'
                      const canApprove = row.status === 'graded' &&
                        row.routing_decision === 'Resell on Amazon Rehome'

                      return (
                        <tr
                          key={row.id}
                          className="table-row-stagger hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors duration-200"
                          style={{ '--stagger-delay': `${index * 80}ms` }}
                        >
                          {/* Order ID */}
                          <td className="px-5 py-5 whitespace-nowrap">
                            <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 px-2.5 py-1 rounded-md">{row.order_id}</span>
                          </td>

                          {/* Product Name */}
                          <td className="px-5 py-5 text-slate-900 dark:text-slate-100 font-bold max-w-[200px]">
                            <span className="line-clamp-2 leading-relaxed" title={row.product_name}>{row.product_name}</span>
                          </td>

                          {/* Return Reason */}
                          <td className="px-5 py-5 whitespace-nowrap">
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-350 bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 px-2.5 py-1 rounded-full">{row.return_reason}</span>
                          </td>

                          {/* Customer Condition */}
                          <td className="px-5 py-5 text-slate-700 dark:text-slate-300 font-semibold whitespace-nowrap">
                            {row.customer_condition}
                          </td>

                          {/* AI Grade */}
                          <td className="px-5 py-5">
                            <div className="flex flex-col gap-2 items-start">
                              <ConditionBadge tier={row.ai_condition_tier || 'Pending'} />
                              {row.ai_confidence != null && (
                                <LeafRating rating={confidenceToLeaves(row.ai_confidence)} />
                              )}
                            </div>
                          </td>

                          {/* Confidence */}
                          <td className="px-5 py-5">
                            <ConfidenceBar value={row.ai_confidence} />
                          </td>

                          {/* Routing Decision */}
                          <td className="px-5 py-5 text-slate-700 whitespace-nowrap">
                            {row.routing_decision ? (
                              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-extrabold tracking-wide border ${
                                row.routing_decision.includes('Resell')
                                  ? 'bg-emerald-100/50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/20'
                                  : row.routing_decision.includes('Refurbish')
                                  ? 'bg-blue-100/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-500/20'
                                  : 'bg-rose-100/50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/50 dark:border-rose-500/20'
                              }`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${
                                  row.routing_decision.includes('Resell') ? 'bg-emerald-500'
                                  : row.routing_decision.includes('Refurbish') ? 'bg-blue-500'
                                  : 'bg-rose-500'
                                }`} />
                                {row.routing_decision}
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500 font-bold italic uppercase tracking-wider">
                                Pending assessment
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-5 whitespace-nowrap">
                            <div className="flex flex-col gap-2.5 min-w-[140px]">
                              {canGrade && (
                                <button
                                  onClick={() => handleGrade(row.id)}
                                  disabled={!!busy}
                                  className="cursor-pointer inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-[11px] font-extrabold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-lg hover:shadow-orange-500/20 hover:-translate-y-0.5 shadow-sm transition-all duration-300 whitespace-nowrap"
                                >
                                  {busy === 'grade' ? <><Spinner /> Grading...</> : (
                                    <>
                                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                                      </svg>
                                      Grade Now
                                    </>
                                  )}
                                </button>
                              )}

                              {canApprove && (
                                <button
                                  onClick={() => handleApprove(row.id)}
                                  disabled={!!busy}
                                  className="cursor-pointer inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-[11px] font-extrabold text-white bg-gradient-to-r from-emerald-600 to-green-500 hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 shadow-sm transition-all duration-300 whitespace-nowrap"
                                >
                                  {busy === 'approve' ? <><Spinner /> Approving...</> : (
                                    <>
                                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      Approve for Rehome
                                    </>
                                  )}
                                </button>
                              )}

                              <button
                                onClick={() => navigate(`/health/${row.id}`)}
                                className="cursor-pointer inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900/40 px-4 py-2.5 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 hover:border-slate-350 dark:hover:border-white/20 transition-all shadow-sm whitespace-nowrap"
                              >
                                <svg className="h-3.5 w-3.5 text-slate-500 dark:text-slate-550" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                View Health Card
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
              </tbody>
            </table>

            {!loading && returns.length === 0 && (
              <div className="py-24 text-center">
                <div className="h-16 w-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-900/50 flex items-center justify-center border border-slate-200 dark:border-white/10 mb-4 shadow-lg shadow-black/[0.01] dark:shadow-black/10">
                  <svg className="h-8 w-8 text-slate-500 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-350">No returns found</p>
                <p className="text-xs text-slate-500 mt-1">Submit a return to see it appear here.</p>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  )
}
