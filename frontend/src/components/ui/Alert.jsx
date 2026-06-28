import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { cn } from '@/lib/cn'

const config = {
  error: { icon: AlertCircle, cls: 'bg-red-500/10 text-red-300 border-red-500/20', iconCls: 'text-red-400' },
  success: { icon: CheckCircle2, cls: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20', iconCls: 'text-emerald-400' },
  info: { icon: Info, cls: 'bg-brand-500/10 text-brand-200 border-brand-500/20', iconCls: 'text-brand-300' },
}

export function Alert({ children, variant = 'info', className = '' }) {
  const { icon: Icon, cls, iconCls } = config[variant]
  return (
    <div className={cn('flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm', cls, className)}>
      <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', iconCls)} />
      <div className="leading-relaxed">{children}</div>
    </div>
  )
}

export default Alert
