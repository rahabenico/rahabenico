import { Link } from "react-router-dom";

interface TeaserProps {
  title: string;
  subtitle?: string;
  badge?: string | number;
  href?: string;
  className?: string;
}

export function Teaser({ title, subtitle, badge, href, className = "" }: TeaserProps) {
  const content = (
    <div className="group h-full rounded-lg border bg-card px-5 pt-3 pb-4 text-left transition-colors hover:bg-accent/50">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-md group-hover:text-primary">{title}</h3>
        {badge && <span className="rounded-full bg-muted px-2 py-1 text-muted-foreground text-xs">{badge}</span>}
      </div>
      {subtitle && <div className="text-muted-foreground text-sm">{subtitle}</div>}
    </div>
  );

  if (href) {
    return (
      <Link to={href} className={`block ${className}`}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
