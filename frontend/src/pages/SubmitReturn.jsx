import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const RETURN_REASONS = ['Wrong Item', 'Defective', 'No Longer Needed', 'Changed Mind', 'Other']
const CONDITIONS = ['Like New', 'Good', 'Fair', 'Poor']

const inputClass =
  'w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/40 dark:bg-slate-900/40 px-4 py-3.5 text-sm text-slate-800 dark:text-slate-100 ' +
  'placeholder:text-slate-400 dark:placeholder:text-slate-500 ' +
  'focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 ' +
  'hover:border-slate-300 dark:hover:border-white/15 transition-all duration-300 shadow-sm backdrop-blur-sm'

const labelClass = 'block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2'

// ── Step indicator ────────────────────────────────────────────────────────────
function StepIndicator({ step }) {
  const steps = [
    { label: 'Product Info', icon: '📦' },
    { label: 'Condition', icon: '🔍' },
    { label: 'Upload', icon: '📸' },
  ]
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((s, i) => {
        const active = i <= step
        return (
          <div key={i} className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-500 ${
              active
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-slate-200/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-white/5'
            }`}>
              <span className="text-sm">{s.icon}</span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-8 h-0.5 rounded-full transition-all duration-500 ${
                i < step ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-800'
              }`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Floating decorative orbs ──────────────────────────────────────────────────
function FloatingOrbs() {
  return (
    <>
      <div className="floating-orb bg-orange-400/5 dark:bg-orange-400/20 w-72 h-72 -top-20 -right-20 animate-float" />
      <div className="floating-orb bg-emerald-400/5 dark:bg-emerald-400/15 w-56 h-56 -bottom-20 -left-16 animate-float" style={{ animationDelay: '-2s' }} />
      <div className="floating-orb bg-blue-400/5 dark:bg-blue-400/10 w-40 h-40 top-1/2 right-10 animate-float" style={{ animationDelay: '-4s' }} />
    </>
  )
}

export default function SubmitReturn() {
  const [form, setForm] = useState({
    product_name: '',
    return_reason: '',
    customer_condition: '',
    notes: '',
  })
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  // Determine current step for indicator
  const currentStep = form.product_name && form.return_reason && form.customer_condition ? 2 : form.product_name ? 1 : 0

  function handleField(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleImages(e) {
    const files = Array.from(e.target.files)
    setImages(files)
    setPreviews(files.map(f => URL.createObjectURL(f)))
  }

  function handleDrag(e) {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }

  function handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    if (files.length) {
      setImages(files)
      setPreviews(files.map(f => URL.createObjectURL(f)))
    }
  }

  function removeImage(index) {
    setImages(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  function resetForm() {
    setForm({ product_name: '', return_reason: '', customer_condition: '', notes: '' })
    setImages([])
    setPreviews([])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setSuccess(null)
    setError(null)

    const data = new FormData()
    data.append('product_name', form.product_name)
    data.append('return_reason', form.return_reason)
    data.append('customer_condition', form.customer_condition)
    data.append('notes', form.notes)
    images.forEach(img => data.append('images', img))

    try {
      const res = await fetch(`${API}/api/returns`, {
        method: 'POST',
        body: data,
      })
      if (!res.ok) throw new Error('Server error')
      const json = await res.json()
      setSuccess(json)
      resetForm()
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden mesh-gradient">
      <FloatingOrbs />

      <main className="mx-auto max-w-xl relative z-10">
        {/* Page Header */}
        <div className="text-center mb-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold tracking-wide mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
            </span>
            Amazon Rehome — AI Grading Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Submit a Return
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 max-w-md mx-auto leading-relaxed">
            Initiate a return. Our intelligent AI will instantly grade your product's resale viability and assign a sustainability score.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <StepIndicator step={currentStep} />
        </div>

        {/* Success Banner */}
        {success && (
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-green-500/5 dark:from-emerald-950/30 dark:to-green-950/20 border border-emerald-550/20 dark:border-emerald-500/25 p-6 shadow-lg shadow-black/[0.02] dark:shadow-black/20 animate-scale-in">
            <div className="flex gap-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center shadow-md shadow-emerald-500/20">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Return Submitted Successfully! 🎉</h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-300 mt-1.5 leading-relaxed">
                  Order ID: <span className="font-mono font-bold bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-200">{success.order_id}</span>. 
                  Our computer vision models are ready to assess and price this listing.
                </p>
                <Link
                  to="/rehome"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 px-5 py-2.5 text-xs font-bold text-white hover:opacity-90 shadow-md shadow-emerald-500/20 transition-all duration-300"
                >
                  View Rehome Marketplace
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-rose-500/10 to-red-500/5 dark:from-rose-950/30 dark:to-red-950/20 border border-rose-550/20 dark:border-rose-500/25 p-5 shadow-lg shadow-black/[0.02] dark:shadow-black/20 animate-scale-in">
            <div className="flex gap-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-rose-100 dark:bg-rose-950 flex items-center justify-center border border-rose-200 dark:border-rose-500/30">
                <svg className="h-4 w-4 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Submission Failed</h3>
                <p className="text-xs text-rose-600 dark:text-rose-300 mt-0.5">Please check the fields and try again.</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <form onSubmit={handleSubmit} className="space-y-7">

            {/* Product Name */}
            <div>
              <label htmlFor="product_name" className={labelClass}>
                Product Name <span className="text-orange-500">*</span>
              </label>
              <input
                id="product_name"
                name="product_name"
                type="text"
                required
                placeholder="e.g. Sony WH-1000XM4 Headphones"
                value={form.product_name}
                onChange={handleField}
                className={inputClass}
              />
            </div>

            {/* Two-column Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Return Reason */}
              <div>
                <label htmlFor="return_reason" className={labelClass}>
                  Return Reason <span className="text-orange-500">*</span>
                </label>
                <select
                  id="return_reason"
                  name="return_reason"
                  required
                  value={form.return_reason}
                  onChange={handleField}
                  className={`${inputClass} cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222.5%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-8`}
                >
                  <option value="" disabled className="bg-white dark:bg-slate-900 text-slate-450 dark:text-slate-400">Select reason...</option>
                  {RETURN_REASONS.map(r => (
                    <option key={r} value={r} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">{r}</option>
                  ))}
                </select>
              </div>

              {/* Product Condition */}
              <div>
                <label htmlFor="customer_condition" className={labelClass}>
                  Product Condition <span className="text-orange-500">*</span>
                </label>
                <select
                  id="customer_condition"
                  name="customer_condition"
                  required
                  value={form.customer_condition}
                  onChange={handleField}
                  className={`${inputClass} cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222.5%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat pr-8`}
                >
                  <option value="" disabled className="bg-white dark:bg-slate-900 text-slate-455 dark:text-slate-400">Select condition...</option>
                  {CONDITIONS.map(c => (
                    <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className={labelClass}>
                Additional Notes <span className="text-slate-500 font-normal normal-case tracking-normal">(optional)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Describe any damage, missing accessories, or packaging state..."
                value={form.notes}
                onChange={handleField}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Image Upload Area */}
            <div>
              <label htmlFor="images" className={labelClass}>
                Product Images <span className="text-slate-500 font-normal normal-case tracking-normal">(optional, JPG / PNG)</span>
              </label>
              
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 group ${
                  dragActive
                    ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 scale-[1.02]'
                    : 'border-slate-200 dark:border-white/10 hover:border-orange-500/80 hover:bg-slate-50/50 dark:hover:bg-white/[0.02]'
                }`}
              >
                <input
                  id="images"
                  name="images"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  multiple
                  ref={fileInputRef}
                  onChange={handleImages}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className={`h-12 w-12 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  dragActive ? 'bg-orange-100 dark:bg-orange-950/50 scale-110' : 'bg-slate-100 dark:bg-white/[0.04] group-hover:bg-orange-100 dark:group-hover:bg-orange-950/20'
                }`}>
                  <svg className={`h-6 w-6 transition-colors duration-300 ${dragActive ? 'text-orange-500 dark:text-orange-400' : 'text-slate-450 dark:text-slate-450 group-hover:text-orange-500 dark:group-hover:text-orange-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                  </svg>
                </div>
                <p className="mt-3 text-xs font-bold text-slate-600 dark:text-slate-355">
                  {dragActive ? 'Drop your images here' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">JPG, PNG up to 10MB each</p>
              </div>

              {/* Thumbnail previews */}
              {previews.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {previews.map((src, i) => (
                    <div key={i} className="relative group/thumb h-20 w-20 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-slate-900/40 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <img
                        src={src}
                        alt={`preview ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2.5 cursor-pointer premium-gradient-btn rounded-xl py-4 text-sm font-bold text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  AI is analyzing your product...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                  </svg>
                  Submit Return
                </>
              )}
            </button>

          </form>
        </div>

        {/* Trust badge */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-emerald-550 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            Secure Upload
          </div>
          <span className="text-slate-300 dark:text-slate-800">•</span>
          <div className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-blue-550 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            AI-Powered Grading
          </div>
          <span className="text-slate-300 dark:text-slate-800">•</span>
          <div className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-orange-550 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Instant Results
          </div>
        </div>
      </main>
    </div>
  )
}
