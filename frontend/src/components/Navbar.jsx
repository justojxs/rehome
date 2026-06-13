import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/',           label: 'Submit Return', end: true  },
  { to: '/rehome',     label: 'Rehome',        end: false, live: true },
  { to: '/admin',      label: 'Admin',         end: false },
  { to: '/prevention', label: 'Prevention',    end: false },
]

function CartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 7h12.8M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
  )
}

function PersonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

function HamburgerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full dark-glass-panel border-b border-slate-800 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.3)] bg-[#0f172a]/95">
      {/* Main bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Left — logo (links to /rehome) */}
          <Link
            to="/rehome"
            className="flex items-center gap-3.5 flex-shrink-0 group"
            aria-label="Amazon Rehome home"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded bg-gradient-to-tr from-amber-500 to-orange-400 text-sm font-black text-slate-950 leading-none shadow-[0_0_12px_rgba(245,158,11,0.3)] transition-all duration-300 group-hover:scale-105">
              a
            </div>
            <span className="text-white font-extrabold text-lg tracking-tight transition-colors duration-300 group-hover:text-orange-400 flex items-center gap-2">
              Amazon <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">Rehome</span>
            </span>
          </Link>

          {/* Centre — desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ to, label, end, live }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) => 
                  `relative flex items-center gap-1.5 text-sm font-semibold py-2 transition-all duration-300 ${
                    isActive ? 'text-orange-400 font-bold' : 'text-slate-300 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{label}</span>
                    {live && (
                      <span className="relative flex h-2 w-2" title="Live" aria-label="Live marketplace">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-[-16px] left-1/2 -translate-x-1/2 h-1 w-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 shadow-[0_0_8px_#ff9900]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right — icons + hamburger */}
          <div className="flex items-center gap-5 text-slate-300">
            <button aria-label="Cart" className="hover:text-orange-400 transition-colors duration-300 cursor-pointer group">
              <CartIcon />
            </button>
            <button aria-label="Account" className="hover:text-orange-400 transition-colors duration-300 cursor-pointer group">
              <PersonIcon />
            </button>
            <button
              className="md:hidden hover:text-orange-400 transition-colors cursor-pointer"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen(prev => !prev)}
            >
              {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0f172a]/95 backdrop-blur-lg animate-fade-in-up">
          <div className="space-y-1 px-2 py-3">
            {NAV_LINKS.map(({ to, label, end, live }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-md px-3 py-2.5 text-base font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-slate-800 text-orange-400 border-l-4 border-orange-400'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white border-l-4 border-transparent'
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                <span>{label}</span>
                {live && (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
