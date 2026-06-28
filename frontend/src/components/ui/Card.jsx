import { cn } from '@/lib/cn'

export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-white/[0.035] shadow-[var(--shadow-card)] backdrop-blur-xl',
        hover &&
          'transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/40 hover:bg-white/[0.06] hover:shadow-[var(--shadow-glow)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={cn('flex items-start justify-between gap-4 px-6 pt-6', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={cn('text-lg font-semibold text-slate-100', className)}>{children}</h3>
}

export function CardDescription({ children, className = '' }) {
  return <p className={cn('mt-1 text-sm text-slate-400', className)}>{children}</p>
}

export function CardContent({ children, className = '' }) {
  return <div className={cn('p-6', className)}>{children}</div>
}

export default Card
