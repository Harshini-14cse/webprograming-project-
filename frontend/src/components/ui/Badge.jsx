import { cn } from '@/lib/cn'

const variants = {
  brand: 'bg-brand-50 text-brand-700 ring-brand-600/10',
  slate: 'bg-slate-100 text-slate-600 ring-slate-500/10',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  warning: 'bg-amber-50 text-amber-700 ring-amber-600/10',
  danger: 'bg-red-50 text-red-700 ring-red-600/10',
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
