import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

const variants = {
  primary:
    'bg-gradient-to-r from-brand-600 to-indigo-500 text-white shadow-[0_8px_24px_-8px_rgba(124,58,237,0.6)] hover:shadow-[0_10px_30px_-6px_rgba(124,58,237,0.8)] hover:brightness-110 focus-visible:ring-brand-500',
  secondary:
    'bg-white/10 text-slate-100 hover:bg-white/15 focus-visible:ring-white/30',
  outline:
    'border border-white/15 bg-white/5 text-slate-200 hover:bg-white/10 hover:border-white/25 focus-visible:ring-white/30',
  ghost:
    'text-slate-400 hover:bg-white/5 hover:text-white focus-visible:ring-white/20',
  danger:
    'bg-red-500/90 text-white shadow-[0_8px_24px_-8px_rgba(239,68,68,0.6)] hover:bg-red-500 focus-visible:ring-red-500',
  success:
    'bg-emerald-500/90 text-white shadow-[0_8px_24px_-8px_rgba(16,185,129,0.6)] hover:bg-emerald-500 focus-visible:ring-emerald-500',
}

const sizes = {
  sm: 'h-9 px-3.5 text-sm gap-1.5 rounded-lg',
  md: 'h-10 px-5 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-xl',
  icon: 'h-10 w-10 rounded-xl',
}

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    className = '',
    type = 'button',
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900',
        'disabled:pointer-events-none disabled:opacity-50',
        'active:scale-[0.97]',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
})

export default Button
