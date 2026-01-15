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
    <div className="p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg">{title}</h3>
        {badge && (
          <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
      {subtitle && (
        <div className="text-sm text-muted-foreground mt-1">
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
