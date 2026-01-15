import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  isLoading: boolean
  className?: string
}

export function LoadingSpinner({ isLoading, className }: LoadingSpinnerProps) {
  if (!isLoading) return null

  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm", className)}>
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
    </div>
  )
}

// Keep the old name for backward compatibility
export const LoadingBar = LoadingSpinner
