import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ConditionBadge from '../components/ConditionBadge'
import LeafRating from '../components/LeafRating'
import RehomeBadge from '../components/RehomeBadge'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const FILTERS = ['All', 'Like New', 'Good', 'Acceptable']

const LEAF_MAP = { 'Like New': 5, 'Good': 4, 'Acceptable': 3, 'Liquidate': 1 }

// Category-based gradient backgrounds for products without images
const PRODUCT_GRADIENTS = [
  'from-orange-950/20 to-amber-950/10',
  'from-blue-950/20 to-indigo-950/10',
  'from-emerald-950/20 to-green-950/10',
  'from-purple-950/20 to-fuchsia-950/10',
  'from-rose-950/20 to-pink-950/10',
  'from-cyan-950/20 to-sky-950/10',
]

// Category-based emoji icons for product types
function getProductEmoji(name) {
  const n = (name || '').toLowerCase()
  if (n.includes('headphone') || n.includes('earphone') || n.includes('audio')) return '🎧'
  if (n.includes('phone') || n.includes('mobile') || n.includes('samsung') || n.includes('iphone')) return '📱'
  if (n.includes('laptop') || n.includes('macbook') || n.includes('computer')) return '💻'
  if (n.includes('shoe') || n.includes('sneaker') || n.includes('nike') || n.includes('adidas')) return '👟'
  if (n.includes('watch') || n.includes('fitbit') || n.includes('garmin')) return '⌚'
  if (n.includes('bag') || n.includes('backpack') || n.includes('wildcraft')) return '🎒'
  if (n.includes('camera') || n.includes('gopro') || n.includes('canon')) return '📷'
  if (n.includes('fryer') || n.includes('kitchen') || n.includes('oven') || n.includes('philips')) return '🍳'
  if (n.includes('book') || n.includes('kindle')) return '📚'
  if (n.includes('speaker') || n.includes('alexa') || n.includes('echo')) return '🔊'
  return '📦'
}

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
    <svg className="h-3 w-3 text-emerald-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
    <div className="bg-slate-900/40 rounded-3xl border border-white/5 overflow-hidden animate-pulse">
      <div className="h-52 bg-slate-900/60 shimmer-bg" />
      <div className="p-5 space-y-4">
        <div className="h-4 bg-slate-800 rounded-lg w-1/2 shimmer-bg" />
        <div className="h-5 bg-slate-800 rounded-lg w-3/4 shimmer-bg" />
        <div className="h-4 bg-slate-800 rounded-lg w-1/3 shimmer-bg" />
        <div className="h-4 bg-slate-800 rounded-lg w-2/3 shimmer-bg" />
        <div className="flex gap-3 pt-2">
          <div className="h-10 bg-slate-800 rounded-xl flex-1 shimmer-bg" />
          <div className="h-10 bg-slate-800 rounded-xl flex-1 shimmer-bg" />
        </div>
      </div>
    </div>
  )
}

// ── Product image ─────────────────────────────────────────────────────────────
function ProductImage({ firstImage, productName, index }) {
  const isPlaceholder = !firstImage || firstImage === 'placeholder.jpg'
  const emoji = getProductEmoji(productName)
  const gradient = PRODUCT_GRADIENTS[(index || 0) % PRODUCT_GRADIENTS.length]

  if (isPlaceholder) {
    return (
      <div className={`h-52 w-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center gap-2 border-b border-white/5 relative overflow-hidden`}>
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/5 blur-sm" />
        <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/5 blur-sm" />
        
        <span className="text-5xl drop-shadow-sm animate-float" style={{ animationDelay: `${(index || 0) * -1.5}s` }}>{emoji}</span>
        <span className="text-[10px] font-extrabold text-slate-350 uppercase tracking-widest mt-1 bg-slate-900/60 border border-white/5 px-3 py-0.5 rounded-full backdrop-blur-sm">
          {productName?.split(' ').slice(0, 2).join(' ')}
        </span>
      </div>
    )
  }

  return (
    <img
      src={`${API}/uploads/${firstImage}`}
      alt={productName}
      className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105 border-b border-white/5"
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
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5
        bg-gradient-to-r from-slate-900 to-slate-800 text-white text-xs font-bold tracking-wide px-6 py-4 rounded-2xl shadow-2xl shadow-slate-900/20
        transition-all duration-500 ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}
    >
      <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
        <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      Successfully added to cart!
    </div>
  )
}

// ── Product card ──────────────────────────────────────────────────────────────
function ProductCard({ item, onAddToCart, index }) {
  const navigate = useNavigate()

  return (
    <div
      className="group rounded-3xl overflow-hidden flex flex-col product-card-lift animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >

      {/* Image Container */}
      <div className="relative overflow-hidden cursor-pointer" onClick={() => navigate(`/health/${item.id}`)}>
        <ProductImage firstImage={item.firstImage} productName={item.product_name} index={index} />
        {/* fallback div hidden by default */}
        <div
          className="h-52 w-full bg-slate-900/60 flex flex-col items-center justify-center gap-1 hidden border-b border-white/5"
          aria-hidden="true"
        >
          <span className="text-xl font-bold text-slate-400">
            {item.product_name?.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
          </span>
          <span className="text-xs text-slate-550">No image</span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick view badge */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <span className="bg-slate-900/90 backdrop-blur-sm text-[10px] font-bold text-slate-200 px-2.5 py-1 rounded-full shadow-md border border-white/10">
            Quick View
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-1.5">
          <RehomeBadge />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/20
                           px-2 py-0.5 text-[10px] font-bold text-emerald-400">
            <PinIcon />
            REGIONAL LISTING
          </span>
        </div>

        {/* Product name */}
        <h3 
          onClick={() => navigate(`/health/${item.id}`)}
          className="text-sm font-bold text-white leading-snug line-clamp-2 cursor-pointer hover:text-orange-400 transition-colors" 
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
          <span className="text-xs text-slate-555 line-through">₹{item.mrp.toLocaleString('en-IN')}</span>
          <span className="text-xl font-black text-orange-500">
            ₹{item.price > 0 ? item.price.toLocaleString('en-IN') : '—'}
          </span>
          {item.deduction > 0 && (
            <span className="text-[10px] font-extrabold bg-emerald-950/40 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/25">
              {item.deduction}% SAVED
            </span>
          )}
        </div>

        {/* Leaf rating */}
        {item.leafRating > 0 && (
          <div className="scale-90 origin-left border-t border-white/5 pt-2.5">
            <LeafRating rating={item.leafRating} />
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto pt-3 flex gap-2.5">
          <button
            onClick={() => navigate(`/health/${item.id}`)}
            className="cursor-pointer flex-1 rounded-xl border border-white/10 bg-slate-900/40 px-2 py-2.5 text-xs font-bold
                       text-slate-200 hover:bg-slate-800 hover:border-white/20 transition-all duration-300 shadow-sm"
          >
            Health Card
          </button>
          <button
            onClick={() => onAddToCart(item.id)}
            className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5
                       text-xs font-bold text-white hover:shadow-lg hover:shadow-orange-500/10 hover:-translate-y-0.5 transition-all duration-300 shadow-sm bg-gradient-to-r from-orange-500 to-amber-500"
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
    <div className="flex flex-col items-center justify-center py-24 gap-5 text-center animate-fade-in-up">
      <div className="h-20 w-20 rounded-full bg-slate-900/50 flex items-center justify-center border border-white/10 shadow-lg shadow-black/20">
        <svg className="h-10 w-10 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      </div>
      <div>
        <p className="text-lg font-extrabold text-white">No items listed on Rehome yet</p>
        <p className="text-xs text-slate-450 mt-1.5 max-w-xs leading-relaxed">Grade and approve returned listings from the operations Admin Dashboard to list them here.</p>
      </div>
      <Link
        to="/admin"
        className="mt-2 rounded-xl px-6 py-3 text-xs font-bold text-white shadow-lg shadow-orange-500/10 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-orange-500 to-amber-500"
      >
        Go to Admin Dashboard →
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
    toastTimer.current = setTimeout(() => setToastVisible(false), 2500)
  }

  const filtered = activeFilter === 'All'
    ? items
    : items.filter(i => i.ai_condition_tier === activeFilter)

  return (
    <div className="min-h-screen">

      {/* ── Hero banner ──────────────────────────────────────────────────── */}
      <div className="w-full px-6 py-14 sm:py-20 animated-gradient-bg border-b border-white/[0.04] relative overflow-hidden">
        {/* Animated floating orbs */}
        <div className="absolute right-10 bottom-10 h-48 w-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none animate-float" />
        <div className="absolute left-1/4 top-0 h-36 w-36 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute right-1/3 top-5 h-24 w-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none animate-float" style={{ animationDelay: '-5s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div className="mx-auto max-w-5xl flex items-center justify-between gap-8 relative z-10 animate-fade-in-up">

          {/* Left */}
          <div className="flex flex-col gap-4 flex-1">
            <span className="inline-flex self-start items-center gap-2 rounded-full bg-orange-500/10 px-3 py-1 text-[10px] font-extrabold text-orange-400 border border-orange-500/20 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
              </span>
              AMAZON RESALE PROGRAM — LIVE
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              Amazon <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift">Rehome</span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed">
              Shop verified, AI-graded returns available locally. Give returned items a second life, save money, and reduce environmental waste.
            </p>
            {/* Stats strip */}
            <div className="flex gap-6 mt-2">
              {[
                { label: 'AI Verified', value: '100%', icon: '🤖' },
                { label: 'Avg Savings', value: '20%+', icon: '💰' },
                { label: 'CO₂ Saved', value: '2.4kg', icon: '🌱' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="text-base">{s.icon}</span>
                  <div>
                    <p className="text-xs font-black text-white">{s.value}</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — eco illustration */}
          <div className="hidden sm:flex flex-shrink-0 h-40 w-56 rounded-3xl border border-white/5
                          items-center justify-center text-center bg-gradient-to-br from-slate-950/40 to-slate-950/10 backdrop-blur-xl shadow-2xl shadow-black/30 relative overflow-hidden">
            {/* Animated ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-32 w-32 rounded-full border border-emerald-500/10" style={{ animation: 'rotate-slow 20s linear infinite' }} />
            </div>
            <div className="flex flex-col items-center gap-2.5 px-4 relative z-10">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
                </svg>
              </div>
              <p className="text-[10px] font-extrabold text-slate-300 tracking-widest">CIRCULAR ECONOMY</p>
              <p className="text-[9px] text-slate-500 leading-snug">Saving carbon footprints locally</p>
            </div>
          </div>

        </div>
      </div>

      {/* ── Filter bar ───────────────────────────────────────────────────── */}
      <div className="bg-[#080c14]/85 backdrop-blur-lg border-b border-white/5 sticky top-[65px] z-20 shadow-lg shadow-black/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex items-center gap-2.5 py-4 overflow-x-auto scrollbar-hide">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`cursor-pointer flex-shrink-0 rounded-full px-5 py-2 text-xs font-bold transition-all duration-300 ${
                  activeFilter === f
                    ? 'text-white shadow-md shadow-orange-500/10 bg-gradient-to-r from-orange-500 to-amber-500 scale-105'
                    : 'bg-slate-900/50 border border-white/5 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
            <span className="ml-auto text-[10px] font-extrabold text-slate-500 flex-shrink-0 pl-4 uppercase tracking-widest">
              {loading ? '...' : `${filtered.length} item${filtered.length !== 1 ? 's' : ''} found`}
            </span>
          </div>
        </div>
      </div>

      {/* ── Product grid ─────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, i) => (
              <ProductCard key={item.id} item={item} onAddToCart={handleAddToCart} index={i} />
            ))}
          </div>
        )}
      </main>

      {/* ── Toast ────────────────────────────────────────────────────────── */}
      <Toast visible={toastVisible} />

    </div>
  )
}
