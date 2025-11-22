import * as React from 'react'
import { cn } from '@/lib/utils'
import type { TimeVariance } from '@/lib/timeUtils'

interface VarianceBadgeProps {
  variance: TimeVariance | null
  className?: string
}

/**
 * VarianceBadge Component
 * Displays time variance with appropriate color coding
 * - Green (success): Early or on-time
 * - Yellow (warning): Late 15-30 minutes
 * - Red (destructive): Late more than 30 minutes
 */
export function VarianceBadge({ variance, className }: VarianceBadgeProps) {
  if (!variance) return null

  const variantStyles = {
    success: 'bg-green-100 text-green-800 border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    destructive: 'bg-red-100 text-red-800 border-red-300',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        variantStyles[variance.type],
        className
      )}
    >
      {variance.label}
    </span>
  )
}

