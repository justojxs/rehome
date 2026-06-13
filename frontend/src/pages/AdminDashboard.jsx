import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import ConditionBadge from '../components/ConditionBadge'
import LeafRating from '../components/LeafRating'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// ── Summary card ──────────────────────────────────────────────────────────────
function SummaryCard({ label, value, borderColor, icon }) {
  return (
    <div
      className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-5 flex items-center justify-between transition-all duration-300 hover:shadow-md hover:border-slate-200"
      style={{ borderLeft: `4px solid ${borderColor}` }}
    >
      <div className="flex flex-col gap-1">
        <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{value}</span>
      </div>
      <div className="h-10 w-10 rounded-full flex items-center justify-center bg-slate-50 text-slate-500">
        {icon}
      </div>
    </div>
  )
}

// ── Confidence bar ─────────────────────────────────────────────────────────────
function ConfidenceBar({ value }) {
  if (value == null) return <span className="text-xs text-slate-400 font-medium">Pending</span>
  const pct = Math.min(100, Math.max(0, value))
  const color = pct >= 85 ? '#10b981' : pct >= 70 ? '#f59e0b' : '#ef4444'
  return (
    <div className="flex items-center gap-2 min-w-[90px]">
      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold text-slate-700 w-7 text-right">{pct}%</span>
    </div>
  )
}

// ── Skeleton row ──────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 bg-slate-150 rounded w-full" />
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
    <div className="min-h-screen bg-slate-50/50 py-10">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 animate-fade-in-up">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Monitor returns, trigger AI automated condition grading, and approve regional marketplace listings.</p>
          </div>
          <button
            onClick={fetchReturns}
            className="self-start sm:self-center inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-sm transition-all"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Sync Data
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <SummaryCard label="Total Returns"          value={total}               borderColor="#FF9900" icon={<PackageIcon />} />
          <SummaryCard label="Pending AI Grading"     value={pending}             borderColor="#f59e0b" icon={<ClockIcon />} />
          <SummaryCard label="Listed on Rehome"       value={listed}              borderColor="#10b981" icon={<GlobeIcon />} />
          <SummaryCard label="Donated / Liquidated"   value={donatedOrLiquidated}  borderColor="#ef4444" icon={<TrashIcon />} />
        </div>

        {/* Table card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-100/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75">
                  {['Order ID', 'Product Details', 'Reason', 'Customer Declared',
                    'AI Grade Assessment', 'Confidence Score', 'Routing Decision', 'Operation Action'].map(col => (
                    <th
                      key={col}
                      className="px-5 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
                  : returns.map(row => {
                      const busy = actionLoading[row.id]
                      const canGrade   = row.status === 'pending_grading'
                      const canApprove = row.status === 'graded' &&
                        row.routing_decision === 'Resell on Amazon Rehome'

                      return (
                        <tr key={row.id} className="hover:bg-orange-500/[0.02] transition-colors duration-150">
                          {/* Order ID */}
                          <td className="px-5 py-5 font-mono text-xs font-bold text-slate-500 whitespace-nowrap">
                            {row.order_id}
                          </td>

                          {/* Product Name */}
                          <td className="px-5 py-5 text-slate-800 font-bold max-w-[200px]">
                            <span className="line-clamp-2 leading-relaxed" title={row.product_name}>{row.product_name}</span>
                          </td>

                          {/* Return Reason */}
                          <td className="px-5 py-5 text-slate-500 font-medium whitespace-nowrap">
                            {row.return_reason}
                          </td>

                          {/* Customer Condition */}
                          <td className="px-5 py-5 text-slate-500 font-medium whitespace-nowrap">
                            {row.customer_condition}
                          </td>

                          {/* AI Grade */}
                          <td className="px-5 py-5">
                            <div className="flex flex-col gap-1.5 items-start">
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
                          <td className="px-5 py-5 text-slate-700 max-w-[160px]">
                            {row.routing_decision ? (
                              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${
                                row.routing_decision.includes('Resell')
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : row.routing_decision.includes('Refurbish')
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}>
                                {row.routing_decision}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400 font-medium italic">Pending assessment</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-5">
                            <div className="flex flex-col gap-2 min-w-[140px]">
                              {canGrade && (
                                <button
                                  onClick={() => handleGrade(row.id)}
                                  disabled={!!busy}
                                  className="cursor-pointer inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 shadow-sm transition-all"
                                >
                                  {busy === 'grade' ? <><Spinner /> Grading...</> : 'Grade Now'}
                                </button>
                              )}

                              {canApprove && (
                                <button
                                  onClick={() => handleApprove(row.id)}
                                  disabled={!!busy}
                                  className="cursor-pointer inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all"
                                >
                                  {busy === 'approve' ? <><Spinner /> Approving...</> : 'Approve for Rehome'}
                                </button>
                              )}

                              <button
                                onClick={() => navigate(`/health/${row.id}`)}
                                className="cursor-pointer inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                              >
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
              <div className="py-20 text-center text-slate-400 text-sm font-medium">
                <svg className="mx-auto h-10 w-10 text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                No returns found in the operations logs.
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  )
}
