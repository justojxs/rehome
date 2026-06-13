import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const RETURN_REASONS = ['Wrong Item', 'Defective', 'No Longer Needed', 'Changed Mind', 'Other']
const CONDITIONS = ['Like New', 'Good', 'Fair', 'Poor']

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 ' +
  'focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all duration-300'

const labelClass = 'block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5'

export default function SubmitReturn() {
  const [form, setForm] = useState({
    product_name: '',
    return_reason: '',
    customer_condition: '',
    notes: '',
  })
  const [images, setImages] = useState([])      // File objects
  const [previews, setPreviews] = useState([])  // object URLs
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)  // { order_id }
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  function handleField(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleImages(e) {
    const files = Array.from(e.target.files)
    setImages(files)
    setPreviews(files.map(f => URL.createObjectURL(f)))
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
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <main className="mx-auto max-w-xl animate-fade-in-up">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-bold tracking-wide mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
            HackOn Submission Portal
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Submit a Return
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            Initiate a return. Our intelligent AI will instantly grade your product's resale viability.
          </p>
        </div>

        {/* Success Banner */}
        {success && (
          <div className="mb-8 rounded-2xl bg-emerald-50 border border-emerald-200 p-5 shadow-sm transition-all duration-300">
            <div className="flex gap-3">
              <svg className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-bold text-emerald-950">Return Submitted Successfully</h3>
                <p className="text-xs text-emerald-800 mt-1">
                  Order ID: <span className="font-mono font-bold bg-emerald-100 px-1.5 py-0.5 rounded">{success.order_id}</span>. 
                  Our computer vision models are ready to assess and price this listing.
                </p>
                <Link
                  to="/rehome"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm transition-all duration-300"
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
          <div className="mb-8 rounded-2xl bg-rose-50 border border-rose-200 p-4 shadow-sm">
            <div className="flex gap-3">
              <svg className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <div>
                <h3 className="text-sm font-bold text-rose-950">Submission Failed</h3>
                <p className="text-xs text-rose-800 mt-0.5">Please check the fields and try again.</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">

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
                  className={`${inputClass} bg-slate-50 cursor-pointer`}
                >
                  <option value="" disabled>Select reason...</option>
                  {RETURN_REASONS.map(r => (
                    <option key={r} value={r}>{r}</option>
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
                  className={`${inputClass} bg-slate-50 cursor-pointer`}
                >
                  <option value="" disabled>Select condition...</option>
                  {CONDITIONS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className={labelClass}>
                Additional Notes <span className="text-slate-400 font-normal">(optional)</span>
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
                Product Images <span className="text-slate-400 font-normal">(optional, JPG / PNG)</span>
              </label>
              
              <div className="relative border-2 border-dashed border-slate-200 hover:border-orange-400 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 group">
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
                <svg className="mx-auto h-8 w-8 text-slate-400 group-hover:text-orange-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15M2.25 9.574a2.25 2.25 0 012.25-2.25h15M3.375 7.5h17.25c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125H3.375c-.621 0-1.125-.504-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75v-9m-4.5 4.5h9" />
                </svg>
                <p className="mt-2 text-xs font-bold text-slate-700">Click to upload photos</p>
                <p className="text-[10px] text-slate-400 mt-1">Drag and drop images here, or browse files</p>
              </div>

              {/* Thumbnail previews */}
              {previews.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {previews.map((src, i) => (
                    <div key={i} className="relative group/thumb h-16 w-16 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                      <img
                        src={src}
                        alt={`preview ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 cursor-pointer premium-gradient-btn rounded-xl py-3.5 text-sm font-bold text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Uploading and Grading...
                </>
              ) : (
                'Submit Return'
              )}
            </button>

          </form>
        </div>
      </main>
    </div>
  )
}
