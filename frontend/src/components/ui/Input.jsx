import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

const base =
  'w-full rounded-xl border border-white/10 bg-white/5 text-sm text-slate-100 placeholder:text-slate-500 transition-all duration-150 focus:border-brand-400/60 focus:outline-none focus:ring-4 focus:ring-brand-500/15 disabled:cursor-not-allowed disabled:opacity-50'

export const Input = forwardRef(function Input(
  { className = '', icon: Icon, ...props },
  ref
) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      )}
      <input ref={ref} className={cn('h-11', base, Icon ? 'pl-10 pr-4' : 'px-4', className)} {...props} />
    </div>
  )
})

export const Textarea = forwardRef(function Textarea({ className = '', ...props }, ref) {
  return <textarea ref={ref} className={cn('resize-none p-4', base, className)} {...props} />
})

export const Select = forwardRef(function Select({ className = '', children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(
        'h-11 appearance-none px-4 pr-10',
        base,
        "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke=%22%2394a3b8%22 stroke-width=%222%22><path stroke-linecap=%22round%22 stroke-linejoin=%22round%22 d=%22M19 9l-7 7-7-7%22/></svg>')] bg-[length:18px] bg-[right_0.75rem_center] bg-no-repeat",
        '[&>option]:bg-ink-700 [&>option]:text-slate-100',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
})

export function Label({ children, className = '', ...props }) {
  return (
    <label className={cn('mb-1.5 block text-sm font-medium text-slate-300', className)} {...props}>
      {children}
    </label>
  )
}

export default Input
