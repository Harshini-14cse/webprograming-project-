import { cn } from '@/lib/cn'

export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white shadow-[var(--shadow-card)]',
        hover &&
          'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lifted)] hover:border-brand-200',
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
  return (
    <h3 className={cn('text-lg font-semibold text-slate-900', className)}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className = '' }) {
  return <p className={cn('mt-1 text-sm text-slate-500', className)}>{children}</p>
}

export function CardContent({ children, className = '' }) {
  return <div className={cn('p-6', className)}>{children}</div>
}

export default Card
