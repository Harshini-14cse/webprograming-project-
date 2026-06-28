import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

export function Spinner({ className = '' }) {
  return <Loader2 className={cn('h-5 w-5 animate-spin text-brand-600', className)} />
}

export function LoadingState({ message = 'Working on it…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-[3px] border-brand-100" />
        <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-[3px] border-transparent border-t-brand-600" />
      </div>
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  )
}

export default Spinner
