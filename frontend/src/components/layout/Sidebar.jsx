import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, X, Sparkles, Settings, ChevronsLeft } from 'lucide-react'
import { navSections } from '@/config/nav'
import { cn } from '@/lib/cn'

function NavItem({ item, onNavigate, collapsed }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
          collapsed && 'justify-center px-0',
          isActive
            ? 'bg-gradient-to-r from-brand-600/25 to-indigo-500/15 text-white'
            : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="sidebar-active"
              className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-brand-400 to-indigo-500 shadow-[0_0_12px_rgba(139,92,246,0.8)]"
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            />
          )}
          <Icon
            className={cn(
              'h-[18px] w-[18px] shrink-0 transition-colors',
              isActive ? 'text-brand-300' : 'text-slate-500 group-hover:text-slate-200'
            )}
          />
          {!collapsed && <span className="truncate">{item.label}</span>}
        </>
      )}
    </NavLink>
  )
}

export default function Sidebar({ open, onClose, collapsed, onToggleCollapse }) {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex flex-col border-r border-white/10 bg-ink-800/80 backdrop-blur-2xl transition-[width,transform] duration-300 lg:static lg:translate-x-0',
          collapsed ? 'w-[76px]' : 'w-72',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand */}
        <div className={cn('flex items-center gap-2.5 px-5 py-5', collapsed && 'justify-center px-0')}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-indigo-500 text-white shadow-[var(--shadow-glow)]">
            <GraduationCap className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex-1 leading-tight">
              <p className="text-[0.95rem] font-bold text-slate-100">LearnBuddy</p>
              <p className="text-[0.68rem] font-medium tracking-wide text-brand-400">AI STUDY ASSISTANT</p>
            </div>
          )}
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
          {navSections.map((section) => (
            <div key={section.label}>
              {!collapsed && (
                <p className="px-3 pb-1.5 text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500">
                  {section.label}
                </p>
              )}
              {collapsed && <div className="mx-3 mb-2 h-px bg-white/5" />}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavItem key={item.to} item={item} onNavigate={onClose} collapsed={collapsed} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="space-y-2 px-3 pb-4">
          {!collapsed && (
            <div className="rounded-2xl border border-brand-500/20 bg-gradient-to-br from-brand-600/20 to-indigo-500/10 p-4">
              <div className="flex items-center gap-2 text-brand-200">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">Powered by Groq</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                Fast, free AI on Llama 3.3 70B.
              </p>
            </div>
          )}
          <div className={cn('flex items-center gap-2', collapsed && 'flex-col')}>
            <button
              className={cn(
                'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-100',
                collapsed ? 'justify-center' : 'flex-1'
              )}
              title="Settings"
            >
              <Settings className="h-[18px] w-[18px]" />
              {!collapsed && 'Settings'}
            </button>
            <button
              onClick={onToggleCollapse}
              className="hidden h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-100 lg:flex"
              title={collapsed ? 'Expand' : 'Collapse'}
            >
              <ChevronsLeft className={cn('h-[18px] w-[18px] transition-transform', collapsed && 'rotate-180')} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
