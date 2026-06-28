import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

export const Input = forwardRef(function Input(
  { className = '', icon: Icon, ...props },
  ref
) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      )}
      <input
        ref={ref}
        className={cn(
          'h-11 w-full rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400',
          'transition-all duration-150',
          'focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10',
          'disabled:cursor-not-allowed disabled:bg-slate-50',
          Icon ? 'pl-10 pr-4' : 'px-4',
          className
        )}
        {...props}
      />
    </div>
  )
})

export const Textarea = forwardRef(function Textarea(
  { className = '', ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-900 placeholder:text-slate-400',
        'transition-all duration-150 resize-none',
        'focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10',
        'disabled:cursor-not-allowed disabled:bg-slate-50',
        className
      )}
      {...props}
    />
  )
})

export const Select = forwardRef(function Select(
  { className = '', children, ...props },
  ref
) {
  return (
    <select
      ref={ref}
      className={cn(
        'h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900',
        "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke=%22%2394a3b8%22 stroke-width=%222%22><path stroke-linecap=%22round%22 stroke-linejoin=%22round%22 d=%22M19 9l-7 7-7-7%22/></svg>')] bg-[length:18px] bg-[right_0.75rem_center] bg-no-repeat pr-10",
        'transition-all duration-150',
        'focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10',
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
    <label
      className={cn('mb-1.5 block text-sm font-medium text-slate-700', className)}
      {...props}
    >
      {children}
    </label>
  )
}

export default Input
