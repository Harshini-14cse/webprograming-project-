import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge conditional class names and resolve Tailwind conflicts.
 * Usage: cn('p-2', isActive && 'bg-brand-600', className)
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
