import { cn } from '@/lib/cn'

const variants = {
  brand: 'bg-brand-500/15 text-brand-300 ring-brand-400/20',
  slate: 'bg-white/5 text-slate-300 ring-white/10',
  success: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/20',
  warning: 'bg-amber-500/15 text-amber-300 ring-amber-400/20',
  danger: 'bg-red-500/15 text-red-300 ring-red-400/20',
}

export function Badge({ children, variant = 'slate', className = '', ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge
