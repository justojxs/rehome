const TIER_STYLES = {
  'Like New': {
    bg: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.3)',
    text: '#34d399',
  },
  'Good': {
    bg: 'rgba(13, 148, 136, 0.15)',
    border: 'rgba(13, 148, 136, 0.3)',
    text: '#2dd4bf',
  },
  'Acceptable': {
    bg: 'rgba(245, 158, 11, 0.15)',
    border: 'rgba(245, 158, 11, 0.3)',
    text: '#fbbf24',
  },
  'Liquidate': {
    bg: 'rgba(239, 68, 68, 0.15)',
    border: 'rgba(239, 68, 68, 0.3)',
    text: '#f87171',
  },
  'Human Review Required': {
    bg: 'rgba(139, 92, 246, 0.15)',
    border: 'rgba(139, 92, 246, 0.3)',
    text: '#a78bfa',
  },
  'Pending': {
    bg: 'rgba(107, 114, 128, 0.15)',
    border: 'rgba(107, 114, 128, 0.3)',
    text: '#9ca3af',
  },
}

const VERIFIED_TIERS = new Set(['Like New', 'Good'])

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className="h-3 w-3 flex-shrink-0"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export default function ConditionBadge({ tier }) {
  const normalised = tier ?? 'Pending'
  const style = TIER_STYLES[normalised] ?? TIER_STYLES['Pending']
  const showCheck = VERIFIED_TIERS.has(normalised)

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold leading-none border"
      style={{ backgroundColor: style.bg, borderColor: style.border, color: style.text }}
      aria-label={`Condition: ${normalised}`}
    >
      {showCheck && <CheckIcon />}
      {normalised}
    </span>
  )
}
