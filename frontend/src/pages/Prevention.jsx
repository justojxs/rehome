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

// ── Nudge banner ──────────────────────────────────────────────────────────────
function NudgeBanner({ switched, onSwitch, onProceed }) {
  if (switched) {
    return (
      <div className="flex items-start gap-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm transition-all duration-300">
        <CheckIcon />
        <div>
          <p className="text-sm font-extrabold text-emerald-950">Optimal Fit Selected</p>
          <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
            UK9 has a <span className="font-bold">94% keep rate</span> for buyers with your size history. 
            By choosing the recommended size, you help reduce return shipping emissions! 🍃
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-amber-200 p-5 shadow-sm bg-amber-50/60 transition-all duration-300">
      <div className="flex items-start gap-3.5">
        <WarningIcon />
        <div className="flex-1">
          <p className="text-sm font-extrabold text-amber-950">Heads up about your fit</p>
          <p className="text-xs text-amber-800 mt-1 leading-relaxed">
            Based on your order history, Nike Air Max runs slightly tight.{' '}
            <span className="font-bold">73% of similar buyers</span> who ordered UK8 ended up returning them for UK9.
          </p>
          <div className="mt-3.5 flex flex-wrap gap-2.5">
            <button
              onClick={onSwitch}
              className="cursor-pointer rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-95 text-xs font-bold text-white px-4 py-2 shadow-sm transition-all"
            >
              Switch to UK9
            </button>
            <button
              onClick={onProceed}
              className="cursor-pointer rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-600 px-4 py-2 shadow-sm transition-all"
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
    <div className="min-h-screen bg-white py-8">
      <main className="mx-auto max-w-5xl px-4 sm:px-6 animate-fade-in-up">
        {/* Breadcrumb */}
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
          Amazon &rsaquo; Sports &rsaquo; Footwear &rsaquo; Nike Air Max
        </p>

        {/* Product layout */}
        <div className="flex flex-col md:flex-row gap-12">

          {/* ── Left: Image Gallery ──────────────────────────────────────── */}
          <div className="flex-shrink-0 w-full md:w-80">
            <div className="w-full aspect-square rounded-3xl bg-slate-50 border border-slate-100 shadow-inner
                            flex flex-col items-center justify-center gap-3 relative overflow-hidden group">
              <div className="absolute top-4 left-4 inline-flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-full text-[9px] font-extrabold text-slate-500">
                OFFICIAL NIKE PRODUCT
              </div>
              <svg className="h-28 w-28 text-slate-300 group-hover:scale-105 transition-transform duration-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22 16v-1l-8.5-5L11 7l-1.8.9L7 6 3 8v2l-1 1v1l1 1 1-1h1l1 1h12l1-1h1l1 1 1-1v-1l-1-1zm-10.5-5.5l1.5 1-4 2-1-1 3.5-2z"/>
              </svg>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">Nike Air Max</span>
            </div>

            {/* Thumbnail strip */}
            <div className="mt-4 flex gap-3">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className={`h-16 w-16 rounded-xl bg-slate-50 border-2 cursor-pointer transition-all duration-300
                    ${i === 1 ? 'border-orange-400' : 'border-slate-100 hover:border-slate-300'}`}
                />
              ))}
            </div>
          </div>

          {/* ── Right: Details ────────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Title & Brand */}
            <div>
              <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Nike Premium</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight tracking-tight mt-1">
                Nike Air Max Running Shoes
              </h1>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex text-amber-500 text-sm tracking-tighter">{'★'.repeat(4)}{'☆'}</div>
                <span className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer">2,847 ratings</span>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Price */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">List Price</p>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl font-black text-slate-900">₹4,999</span>
                <span className="text-sm text-slate-400 line-through font-medium">₹7,999</span>
                <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">38% SAVED</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-bold">Inclusive of all local taxes. Free expedited delivery.</p>
            </div>

            {/* Size selector */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Select Size: <span className="text-slate-900 font-extrabold">{selectedSize}</span>
              </p>
              <div className="flex flex-wrap gap-2.5">
                {SIZES.map(size => {
                  const isSelected = selectedSize === size
                  return (
                    <button
                      key={size}
                      onClick={() => handleSizeClick(size)}
                      className={`cursor-pointer rounded-xl border-2 px-4 py-2 text-xs font-bold transition-all duration-200
                        ${isSelected
                          ? 'border-orange-500 text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:border-slate-400 bg-white'
                        }`}
                      aria-pressed={isSelected}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
              <p className="text-xs font-bold text-blue-600 hover:underline cursor-pointer mt-2.5">
                Check sizing guide &rsaquo;
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
                className="cursor-pointer flex-1 rounded-xl py-3.5 text-xs font-bold text-white shadow-md hover:opacity-95 transition bg-gradient-to-r from-orange-500 to-amber-500"
              >
                Add to Cart
              </button>
              <button
                className="cursor-pointer flex-1 rounded-xl border border-slate-200 bg-white py-3.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition shadow-sm"
              >
                Buy Now
              </button>
            </div>

            {/* Delivery info */}
            <div className="text-[10px] font-bold text-slate-400 space-y-1.5 uppercase tracking-wide pt-2 border-t border-slate-100">
              <p>
                <span className="text-slate-500">Fastest Delivery:</span>{' '}
                <span className="text-slate-700">Thursday, 19 June</span>
              </p>
              <p>
                <span className="text-slate-500">Return Policy:</span>{' '}
                <span className="text-slate-700">30-day Amazon circular returns eligible</span>
              </p>
            </div>

          </div>
        </div>

        {/* ── Info explanation card ───────────────────────────────────── */}
        <div className="mt-12 rounded-3xl bg-slate-50 border border-slate-100 p-6 flex gap-4">
          <InfoIcon />
          <div>
            <p className="text-sm font-extrabold text-slate-850 mb-1">What is size fit prediction?</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Amazon Rehome parses machine-learning size histograms from buyer return logs to warn you if a product is known to fit tight or loose. By selecting recommended sizes, you reduce return volumes, helping the planet and optimizing supply chain operations.
            </p>
          </div>
        </div>

      </main>
    </div>
  )
}
