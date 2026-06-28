import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { cn } from '@/lib/cn'

const config = {
  error: {
    icon: AlertCircle,
    cls: 'bg-red-50 text-red-700 border-red-200',
    iconCls: 'text-red-500',
  },
  success: {
    icon: CheckCircle2,
    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconCls: 'text-emerald-500',
  },
  info: {
    icon: Info,
    cls: 'bg-brand-50 text-brand-700 border-brand-200',
    iconCls: 'text-brand-500',
  },
}

export function Alert({ children, variant = 'info', className = '' }) {
  const { icon: Icon, cls, iconCls } = config[variant]
  return (
    <div
      className={cn(
        'flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm',
        cls,
        className
      )}
    >
      <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', iconCls)} />
      <div className="leading-relaxed">{children}</div>
    </div>
  )
}

export default Alert
