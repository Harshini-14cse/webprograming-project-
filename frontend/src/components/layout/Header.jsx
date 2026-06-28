import { useEffect, useState } from 'react'
import { Menu, Sparkles } from 'lucide-react'
import api from '@/api'

export default function Header({ onMenuClick }) {
  const [online, setOnline] = useState(null)

  useEffect(() => {
    let active = true
    api
      .get('/pdf-status')
      .then(() => active && setOnline(true))
      .catch(() => active && setOnline(false))
    return () => {
      active = false
    }
  }, [])

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-slate-200 glass px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-slate-800">Welcome back 👋</p>
          <p className="text-xs text-slate-500">Let's make today productive</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Status indicator */}
        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 sm:flex">
          <span className="relative flex h-2 w-2">
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                online ? 'animate-ping bg-emerald-400' : 'bg-slate-300'
              }`}
            />
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${
                online === false ? 'bg-slate-400' : 'bg-emerald-500'
              }`}
            />
          </span>
          <span className="text-xs font-medium text-slate-600">
            {online === false ? 'Backend offline' : 'AI online'}
          </span>
        </div>

        {/* Upgrade pill (decorative) */}
        <div className="hidden items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 md:flex">
          <Sparkles className="h-3.5 w-3.5" />
          Free Plan
        </div>

        {/* Avatar */}
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition-transform hover:scale-105">
          LB
        </button>
      </div>
    </header>
  )
}
