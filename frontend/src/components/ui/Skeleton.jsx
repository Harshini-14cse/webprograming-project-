import { cn } from '@/lib/cn'

export function Skeleton({ className = '' }) {
  return <div className={cn('skeleton', className)} />
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={cn('space-y-2.5', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-3.5', i === lines - 1 ? 'w-2/3' : 'w-full')}
        />
      ))}
    </div>
  )
}

export default Skeleton
