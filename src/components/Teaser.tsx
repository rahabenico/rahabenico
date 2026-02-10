import { Link } from "react-router-dom";

interface TeaserProps {
  title: string;
  subtitle?: string;
  badge?: string | number;
  href?: string;
  className?: string;
  frontImageUrl?: string | null;
  backImageUrl?: string | null;
}

export function Teaser({ title, subtitle, badge, href, className = "", frontImageUrl, backImageUrl }: TeaserProps) {
  const content = (
    <div className="group flex h-full flex-col rounded-lg border bg-card px-5 pt-3 pb-4 text-center transition-colors hover:bg-accent/50">
      <div className="flex items-center justify-center gap-2">
        <h3 className="font-medium text-md group-hover:text-primary">{title}</h3>
        {badge && <span className="rounded-full bg-muted px-2 py-1 text-muted-foreground text-xs">{badge}</span>}
      </div>
      {(frontImageUrl || backImageUrl) && (
        <div className="mt-3 flex justify-center gap-2">
          {frontImageUrl && (
            <img
              src={frontImageUrl}
              alt={`Front preview of ${title}`}
              className="h-12 w-auto rounded border object-contain"
            />
          )}
          {backImageUrl && (
            <img
              src={backImageUrl}
              alt={`Back preview of ${title}`}
              className="h-12 w-auto rounded border object-contain"
            />
          )}
        </div>
      )}
      {subtitle && <div className="mt-3 text-muted-foreground text-sm">{subtitle}</div>}
    </div>
  );

  if (href) {
    return (
      <Link to={href} className={`block h-full ${className}`}>
        {content}
      </Link>
    );
  }

  return <div className={`h-full ${className}`}>{content}</div>;
}
