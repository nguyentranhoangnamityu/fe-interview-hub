import { useState } from 'react'
import { cn } from '@fehub/ui'

import { getTechLogoUrl } from '../constants/techLogos'

type TechStackLogoProps = {
  techStackId: string | undefined
  name: string
  fallback?: string
  className?: string
  size?: number | string
}

export const TechStackLogo = ({
  techStackId,
  name,
  fallback,
  className,
  size = 32,
}: TechStackLogoProps) => {
  const [hasError, setHasError] = useState(false)

  const dimension = typeof size === 'number' ? `${size}px` : size
  const logoUrl = hasError ? null : getTechLogoUrl(techStackId)

  if (logoUrl) {
    return (
      <img
        alt={`${name} logo`}
        className={cn('h-full w-full object-contain', className)}
        src={logoUrl}
        style={{ height: dimension, width: dimension }}
        onError={() => setHasError(true)}
      />
    )
  }

  const content = fallback ?? (name ? name.charAt(0).toUpperCase() : '?')

  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700 dark:bg-slate-700 dark:text-white',
        className,
      )}
      style={{ height: dimension, width: dimension }}
      title={`${name} logo`}
    >
      {content}
    </span>
  )
}

