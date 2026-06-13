import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ConditionBadge from '../components/ConditionBadge'
import LeafRating from '../components/LeafRating'
import RehomeBadge from '../components/RehomeBadge'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const FILTERS = ['All', 'Like New', 'Good', 'Acceptable']

const LEAF_MAP = { 'Like New': 5, 'Good': 4, 'Acceptable': 3, 'Liquidate': 1 }

function deriveCard(item) {
  const mrp = item.original_mrp || 2000
  const price = item.suggested_resale_price || 0
  const deduction = price > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0
  const leafRating = LEAF_MAP[item.ai_condition_tier] ?? 0
  const firstImage = item.image_paths?.split(',')[0]?.trim()
  return { ...item, mrp, price, deduction, leafRating, firstImage }
}

// ── Icons ─────────────────────────────────────────────────────────────────────
function PinIcon() {
  return (
    <svg className="h-3 w-3 text-emerald-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.006 3.913-5.076 3.913-9.077A8.202 8.202 0 0012 2a8.202 8.202 0 00-8.2 8.25c0 4 1.969 7.07 3.913 9.077a19.58 19.58 0 002.683 2.282 16.975 16.975 0 001.144.742zM12 13.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" clipRule="evenodd" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 7h12.8M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
  )
}

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden animate-pulse">
      <div className="h-48 bg-slate-200" />
      <div className="p-5 space-y-4">
        <div className="h-4 bg-slate-200 rounded w-1/2" />
        <div className="h-5 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-200 rounded w-1/3" />
        <div className="h-4 bg-slate-200 rounded w-2/3" />
        <div className="flex gap-3 pt-2">
          <div className="h-9 bg-slate-200 rounded-xl flex-1" />
          <div className="h-9 bg-slate-200 rounded-xl flex-1" />
        </div>
      </div>
    </div>
  )
}

// ── Product image ─────────────────────────────────────────────────────────────
function ProductImage({ firstImage, productName }) {
  const isPlaceholder = !firstImage || firstImage === 'placeholder.jpg'
  const initials = productName
    ? productName.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
    : '?'

  if (isPlaceholder) {
    return (
      <div className="h-48 w-full bg-slate-50 flex flex-col items-center justify-center gap-1 border-b border-slate-100">
        <div className="h-10 w-10 rounded-full bg-slate-200/50 flex items-center justify-center">
          <span className="text-sm font-extrabold text-slate-400">{initials}</span>
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">No Photo Available</span>
      </div>
    )
  }

  return (
    <img
      src={`${API}/uploads/${firstImage}`}
      alt={productName}
      className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
      onError={e => {
        e.target.style.display = 'none'
        e.target.nextSibling.style.display = 'flex'
      }}
    />
  )
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ visible }) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2
        bg-slate-900 text-white text-xs font-bold tracking-wide px-5 py-3.5 rounded-full shadow-2xl
        transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
    >
      <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      SUCCESSFULLY ADDED TO CART!
    </div>
  )
}

// ── Product card ──────────────────────────────────────────────────────────────
function ProductCard({ item, onAddToCart }) {
  const navigate = useNavigate()

  return (
    <div className="group bg-white rounded-3xl border border-slate-100 overflow-hidden
                    flex flex-col hover:shadow-xl hover:border-slate-200 transition-all duration-300">

      {/* Image Container */}
      <div className="relative overflow-hidden cursor-pointer" onClick={() => navigate(`/health/${item.id}`)}>
        <ProductImage firstImage={item.firstImage} productName={item.product_name} />
        {/* fallback div hidden by default */}
        <div
          className="h-48 w-full bg-slate-50 flex-col items-center justify-center gap-1 hidden border-b border-slate-100"
          aria-hidden="true"
        >
          <span className="text-xl font-bold text-slate-300">
            {item.product_name?.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
          </span>
          <span className="text-xs text-slate-400">No image</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-1.5">
          <RehomeBadge />
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100
                           px-2 py-0.5 text-[10px] font-bold text-emerald-700">
            <PinIcon />
            REGIONAL LISTING
          </span>
        </div>

        {/* Product name */}
        <h3 
          onClick={() => navigate(`/health/${item.id}`)}
          className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 cursor-pointer hover:text-orange-500 transition-colors" 
          title={item.product_name}
        >
          {item.product_name}
        </h3>

        {/* Condition badge */}
        <div className="my-0.5">
          <ConditionBadge tier={item.ai_condition_tier || 'Pending'} />
        </div>

        {/* Price row */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-xs text-slate-400 line-through">₹{item.mrp.toLocaleString('en-IN')}</span>
          <span className="text-lg font-extrabold text-orange-500">
            ₹{item.price > 0 ? item.price.toLocaleString('en-IN') : '—'}
          </span>
          {item.deduction > 0 && (
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md">{item.deduction}% SAVED</span>
          )}
        </div>

        {/* Leaf rating */}
        {item.leafRating > 0 && (
          <div className="scale-90 origin-left border-t border-slate-50 pt-2.5">
            <LeafRating rating={item.leafRating} />
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto pt-2.5 flex gap-2">
          <button
            onClick={() => navigate(`/health/${item.id}`)}
            className="cursor-pointer flex-1 rounded-xl border border-slate-200 bg-white px-2 py-2 text-xs font-bold
                       text-slate-600 hover:bg-slate-50 transition shadow-sm"
          >
            Health Card
          </button>
          <button
            onClick={() => onAddToCart(item.id)}
            className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 rounded-xl px-2 py-2
                       text-xs font-bold text-white hover:opacity-95 transition shadow-sm bg-gradient-to-r from-orange-500 to-amber-500"
          >
            <CartIcon />
            Add to Cart
          </button>
        </div>

      </div>
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
        <svg className="h-8 w-8 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      </div>
      <div>
        <p className="text-base font-bold text-slate-800">No items listed on Rehome yet</p>
        <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">Grade and approve returned listings from the operations Admin Dashboard to list them here.</p>
      </div>
      <Link
        to="/admin"
        className="mt-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-90 transition bg-gradient-to-r from-orange-500 to-amber-500"
      >
        Go to Admin Dashboard
      </Link>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function Rehome() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
  const [toastVisible, setToastVisible] = useState(false)
  const toastTimer = useRef(null)

  const fetchMarketplace = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/marketplace`)
      const data = await res.json()
      setItems(data.map(deriveCard))
    } catch {
      // keep existing data
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMarketplace()
  }, [fetchMarketplace])

  function handleAddToCart() {
    setToastVisible(true)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastVisible(false), 2000)
  }

  const filtered = activeFilter === 'All'
    ? items
    : items.filter(i => i.ai_condition_tier === activeFilter)

  return (
    <div className="min-h-screen bg-slate-50/50">

      {/* ── Hero banner ──────────────────────────────────────────────────── */}
      <div className="w-full px-6 py-12 sm:py-16 bg-[#0f172a] border-b border-slate-800 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute right-0 bottom-0 h-40 w-40 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 top-0 h-32 w-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="mx-auto max-w-5xl flex items-center justify-between gap-8 relative z-10 animate-fade-in-up">

          {/* Left */}
          <div className="flex flex-col gap-3 flex-1">
            <span className="inline-flex self-start items-center gap-1.5 rounded-full bg-orange-500/10 px-2.5 py-0.5 text-[10px] font-bold text-orange-400 border border-orange-500/20">
              AMAZON RESALE PROGRAM
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight">
              Amazon <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">Rehome</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed">
              Shop verified, AI-graded returns available locally. Give returned items a second life, save money, and reduce environmental waste.
            </p>
          </div>

          {/* Right — illustration placeholder */}
          <div className="hidden sm:flex flex-shrink-0 h-32 w-52 rounded-3xl border border-slate-800
                          items-center justify-center text-center bg-slate-900/60 backdrop-blur shadow-inner">
            <div className="flex flex-col items-center gap-2 px-4">
              <svg className="h-7 w-7 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
              </svg>
              <p className="text-[10px] font-bold text-slate-300 tracking-wide">ECO-FRIENDLY CIRCULAR ECONOMY</p>
              <p className="text-[9px] text-slate-500 leading-snug">Saving carbon footprints locally</p>
            </div>
          </div>

        </div>
      </div>

      {/* ── Filter bar ───────────────────────────────────────────────────── */}
      <div className="bg-white/80 backdrop-blur border-b border-slate-100 sticky top-[65px] z-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex items-center gap-2 py-3.5 overflow-x-auto scrollbar-hide">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`cursor-pointer flex-shrink-0 rounded-full px-4.5 py-1.5 text-xs font-bold transition-all duration-200 ${
                  activeFilter === f
                    ? 'text-white shadow-sm shadow-orange-500/20 bg-gradient-to-r from-orange-500 to-amber-500'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
            <span className="ml-auto text-xs font-bold text-slate-400 flex-shrink-0 pl-4 uppercase tracking-wider">
              {loading ? '...' : `${filtered.length} item${filtered.length !== 1 ? 's' : ''} found`}
            </span>
          </div>
        </div>
      </div>

      {/* ── Product grid ─────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10 animate-fade-in-up">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(item => (
              <ProductCard key={item.id} item={item} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </main>

      {/* ── Toast ────────────────────────────────────────────────────────── */}
      <Toast visible={toastVisible} />

    </div>
  )
}
