import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

export function Spinner({ className = '' }) {
  return <Loader2 className={cn('h-5 w-5 animate-spin text-brand-400', className)} />
}

export function LoadingState({ message = 'Working on it…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-[3px] border-white/10" />
        <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-[3px] border-transparent border-t-brand-500" />
        <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border border-brand-500/20" />
      </div>
      <p className="text-sm font-medium text-slate-400">{message}</p>
    </div>
  )
}

export default Spinner
