import { useState, useEffect } from 'react'

const SIZES = ['UK6', 'UK7', 'UK8', 'UK9', 'UK10']

// ── Icons ─────────────────────────────────────────────────────────────────────
function WarningIcon() {
  return (
    <svg className="h-5 w-5 flex-shrink-0 text-amber-600 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="h-5 w-5 flex-shrink-0 text-emerald-600 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg className="h-5 w-5 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  )
}

// ── Star Rating ───────────────────────────────────────────────────────────────
function StarRating({ rating, count }) {
  return (
    <div className="flex items-center gap-3 mt-3">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <svg key={i} className={`h-4 w-4 ${i <= rating ? 'text-amber-400' : 'text-slate-200'}`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
      <span className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer">{count} ratings</span>
    </div>
  )
}

// ── Nudge banner ──────────────────────────────────────────────────────────────
function NudgeBanner({ switched, onSwitch, onProceed }) {
  if (switched) {
    return (
      <div className="flex items-start gap-4 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/30 to-green-950/20 p-6 shadow-lg shadow-black/20 transition-all duration-500 animate-scale-in">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center shadow-md shadow-emerald-500/20">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-extrabold text-white">Optimal Fit Selected ✨</p>
          <p className="text-xs text-emerald-300 mt-1.5 leading-relaxed">
            UK9 has a <span className="font-bold">94% keep rate</span> for buyers with your size history. 
            By choosing the recommended size, you help reduce return shipping emissions! 🍃
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-amber-500/20 p-6 shadow-lg shadow-black/20 bg-gradient-to-r from-amber-950/30 to-orange-950/15 transition-all duration-500 animate-scale-in">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/20">
          <WarningIcon />
        </div>
        <div className="flex-1">
          <p className="text-sm font-extrabold text-white">⚠️ Heads up about your fit</p>
          <p className="text-xs text-amber-300 mt-1.5 leading-relaxed">
            Based on your order history, Nike Air Max runs slightly tight.{' '}
            <span className="font-bold">73% of similar buyers</span> who ordered UK8 ended up returning them for UK9.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <button
              onClick={onSwitch}
              className="cursor-pointer rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-lg hover:shadow-orange-500/20 hover:-translate-y-0.5 text-xs font-bold text-white px-5 py-2.5 shadow-sm transition-all duration-300"
            >
              Switch to UK9
            </button>
            <button
              onClick={onProceed}
              className="cursor-pointer rounded-xl border border-white/10 bg-slate-900/40 hover:bg-slate-800 hover:border-white/20 text-xs font-bold text-slate-200 px-5 py-2.5 shadow-sm transition-all duration-300"
            >
              Keep UK8
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function Prevention() {
  const [selectedSize, setSelectedSize] = useState('UK8')
  const [bannerVisible, setBannerVisible] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const [switched, setSwitched] = useState(false)
  const [activeThumb, setActiveThumb] = useState(0)

  // Slide in nudge banner after 1.5s
  useEffect(() => {
    const t = setTimeout(() => setBannerVisible(true), 1500)
    return () => clearTimeout(t)
  }, [])

  function handleSwitch() {
    setSelectedSize('UK9')
    setSwitched(true)
  }

  function handleProceed() {
    setBannerDismissed(true)
  }

  function handleSizeClick(size) {
    setSelectedSize(size)
    if (size !== 'UK9') {
      setSwitched(false)
    } else {
      setSwitched(true)
    }
  }

  const showBanner = bannerVisible && !bannerDismissed

  return (
    <div className="min-h-screen py-8 mesh-gradient">
      <main className="mx-auto max-w-5xl px-4 sm:px-6 animate-fade-in-up">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">
          {['Amazon', 'Sports', 'Footwear', 'Nike Air Max'].map((crumb, i, arr) => (
            <span key={crumb} className="flex items-center gap-1.5">
              <span className={`hover:text-orange-500 cursor-pointer transition-colors ${i === arr.length - 1 ? 'text-slate-300' : ''}`}>
                {crumb}
              </span>
              {i < arr.length - 1 && (
                <svg className="h-3 w-3 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
            </span>
          ))}
        </div>

        {/* Product layout */}
        <div className="flex flex-col md:flex-row gap-12">

          {/* ── Left: Image Gallery ──────────────────────────────────────── */}
          <div className="flex-shrink-0 w-full md:w-96 animate-fade-in-up">
            <div className="w-full aspect-square rounded-3xl bg-gradient-to-br from-slate-900/40 to-slate-950/20 border border-white/5 shadow-2xl shadow-black/30
                            flex flex-col items-center justify-center gap-3 relative overflow-hidden group">
              {/* Corner badge */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-sm border border-white/5 px-3 py-1.5 rounded-full text-[9px] font-extrabold text-slate-350 shadow-sm z-10">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                OFFICIAL NIKE PRODUCT
              </div>
              
              {/* Product image */}
              <img
                src="/nike-air-max.png"
                alt="Nike Air Max Running Shoes"
                className="w-4/5 h-auto object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-lg"
              />
            </div>

            {/* Thumbnail strip */}
            <div className="mt-4 flex gap-3">
              {[0, 1, 2].map(i => (
                <button
                  key={i}
                  onClick={() => setActiveThumb(i)}
                  className={`h-20 w-20 rounded-xl bg-slate-900/40 border-2 cursor-pointer transition-all duration-300 overflow-hidden flex items-center justify-center
                    ${activeThumb === i ? 'border-orange-500 shadow-md shadow-orange-500/15 scale-105' : 'border-white/5 hover:border-white/20'}`}
                >
                  {i === 0 && (
                    <img src="/nike-air-max.png" alt="View 1" className="h-14 w-auto object-contain animate-float" />
                  )}
                  {i > 0 && (
                    <div className="text-[10px] font-bold text-slate-500 uppercase">View {i + 1}</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: Details ────────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col gap-6 animate-slide-in-right">
            {/* Title & Brand */}
            <div>
              <span className="text-xs font-extrabold text-orange-500 uppercase tracking-widest">Nike Premium</span>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight mt-1">
                Nike Air Max Running Shoes
              </h1>
              <StarRating rating={4} count="2,847" />
            </div>

            <hr className="border-white/5" />

            {/* Price */}
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-1">List Price</p>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl font-black text-white">₹4,999</span>
                <span className="text-sm text-slate-555 line-through font-medium">₹7,999</span>
                <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950/40 border border-emerald-500/25 px-2.5 py-0.5 rounded-md">
                  38% SAVED
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5 font-bold">Inclusive of all local taxes. Free expedited delivery.</p>
            </div>

            {/* Size selector */}
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-3">
                Select Size: <span className="text-white">{selectedSize}</span>
              </p>
              <div className="flex flex-wrap gap-2.5">
                {SIZES.map(size => {
                  const isSelected = selectedSize === size
                  const isRecommended = size === 'UK9'
                  return (
                    <button
                      key={size}
                      onClick={() => handleSizeClick(size)}
                      className={`relative cursor-pointer rounded-xl border-2 px-5 py-2.5 text-xs font-bold transition-all duration-300
                        ${isSelected
                          ? 'border-orange-505 text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-md shadow-orange-500/10 scale-105'
                          : 'border-white/10 text-slate-350 bg-slate-900/40 hover:border-white/25 hover:text-white'
                        }`}
                      aria-pressed={isSelected}
                    >
                      {size}
                      {isRecommended && !isSelected && (
                        <span className="absolute -top-2 -right-1 text-[8px] font-extrabold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded-full border border-emerald-500/20 leading-none">
                          REC
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
              <p className="text-xs font-bold text-blue-400 hover:underline cursor-pointer mt-3 flex items-center gap-1">
                Check sizing guide
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </p>
            </div>

            {/* Nudge banner — slides in */}
            <div
              className={`transition-all duration-500 ease-out overflow-hidden
                ${showBanner || switched
                  ? 'max-h-64 opacity-100 translate-y-0'
                  : 'max-h-0 opacity-0 -translate-y-2'
                }`}
            >
              {(showBanner || switched) && (
                <NudgeBanner
                  switched={switched}
                  onSwitch={handleSwitch}
                  onProceed={handleProceed}
                />
              )}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-md">
              <button
                className="cursor-pointer flex-1 flex items-center justify-center gap-2 rounded-xl py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/10 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-orange-500 to-amber-500"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 7h12.8M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
                </svg>
                Add to Cart
              </button>
              <button
                className="cursor-pointer flex-1 rounded-xl border-2 border-white/10 bg-slate-900/40 py-4 text-sm font-bold text-slate-205 hover:bg-slate-800 hover:border-white/20 transition-all duration-300 shadow-sm"
              >
                Buy Now
              </button>
            </div>

            {/* Delivery info */}
            <div className="flex gap-6 pt-3 border-t border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-blue-950/40 border border-blue-500/20 flex items-center justify-center shadow-md">
                  <svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H18.75M3.375 14.25h3.75m0 0V11.25m0 3h8.25M6.75 11.25h11.25" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Delivery</p>
                  <p className="text-xs font-bold text-slate-300">Thu, 19 June</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center shadow-md">
                  <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Returns</p>
                  <p className="text-xs font-bold text-slate-300">30-day circular</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Info explanation card ───────────────────────────────────── */}
        <div className="mt-14 rounded-3xl bg-gradient-to-r from-blue-950/20 to-indigo-950/10 border border-blue-500/15 p-7 flex gap-5 shadow-lg shadow-black/5 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="flex-shrink-0 h-10 w-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/10">
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-extrabold text-white mb-1.5">What is size fit prediction?</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Amazon Rehome parses machine-learning size histograms from buyer return logs to warn you if a product is known to fit tight or loose. By selecting recommended sizes, you reduce return volumes, helping the planet and optimizing supply chain operations.
            </p>
          </div>
        </div>

      </main>
    </div>
  )
}
