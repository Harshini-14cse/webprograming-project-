import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

export function Accordion({ items = [], defaultOpen = 0 }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i
        const Icon = item.icon
        return (
          <div
            key={i}
            className={cn(
              'overflow-hidden rounded-2xl border transition-colors',
              isOpen ? 'border-brand-500/40 bg-white/[0.05]' : 'border-white/10 bg-white/[0.025]'
            )}
          >
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="flex w-full items-center gap-3 px-5 py-4 text-left"
            >
              {Icon && (
                <span
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors',
                    isOpen ? 'bg-gradient-to-br from-brand-600 to-indigo-500 text-white' : 'bg-white/5 text-slate-400'
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
              )}
              <span className="flex-1 font-medium text-slate-200">{item.title}</span>
              <ChevronDown
                className={cn(
                  'h-5 w-5 shrink-0 text-slate-500 transition-transform duration-200',
                  isOpen && 'rotate-180 text-brand-400'
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                  <div className="border-t border-white/5 px-5 py-4 text-slate-400">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

export default Accordion
