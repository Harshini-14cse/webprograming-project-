import { useEffect, useState } from 'react'
import { Menu, Search, Bell, Sparkles } from 'lucide-react'
import api from '@/api'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function Header({ onMenuClick }) {
  const [online, setOnline] = useState(null)

  useEffect(() => {
    let active = true
    const ping = () =>
      api
        .get('/pdf-status')
        .then(() => active && setOnline(true))
        .catch(() => active && setOnline(false))
    ping()
    const id = setInterval(ping, 15000)
    return () => {
      active = false
      clearInterval(id)
    }
  }, [])

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-white/10 bg-ink-900/60 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-slate-100">{greeting()} 👋</p>
          <p className="text-xs text-slate-500">Let's make today productive</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search */}
        <button className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-white/10 md:flex">
          <Search className="h-4 w-4" />
          <span>Search…</span>
          <kbd className="ml-2 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[0.65rem] text-slate-500">
            ⌘K
          </kbd>
        </button>

        {/* AI status */}
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 sm:flex">
          <span className="relative flex h-2 w-2">
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                online === false ? 'bg-slate-500' : 'animate-ping bg-emerald-400'
              }`}
            />
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${
                online === false ? 'bg-slate-500' : 'bg-emerald-400'
              }`}
            />
          </span>
          <span className="text-xs font-medium text-slate-300">
            {online === false ? 'Offline' : 'AI online'}
          </span>
        </div>

        {/* Plan */}
        <div className="hidden items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1.5 text-xs font-medium text-brand-200 md:flex">
          <Sparkles className="h-3.5 w-3.5" />
          Free Plan
        </div>

        {/* Notifications */}
        <button className="relative rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-brand-400" />
        </button>

        {/* Avatar */}
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-indigo-500 text-sm font-semibold text-white shadow-[var(--shadow-glow)] transition-transform hover:scale-105">
          LB
        </button>
      </div>
    </header>
  )
}
