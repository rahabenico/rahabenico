import { Link } from 'react-router-dom'

interface TeaserProps {
  title: string
  subtitle?: string
  badge?: string | number
  href?: string
  className?: string
}

export function Teaser({ title, subtitle, badge, href, className = '' }: TeaserProps) {
  const content = (
    <div className="px-5 pt-3 pb-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-md">{title}</h3>
        {badge && (
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
      {subtitle && (
        <div className="text-sm text-muted-foreground">
          {subtitle}
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link to={href} className={`block ${className}`}>
        {content}
      </Link>
    )
  }

  return (
    <div className={className}>
      {content}
    </div>
  )
}
