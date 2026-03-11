import { SpotifyIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";

interface TeaserProps {
  title: string;
  subtitle?: string;
  badge?: string | number;
  href?: string;
  onClick?: () => void;
  className?: string;
  frontImageUrl?: string | null;
  backImageUrl?: string | null;
  spotifyId?: string;
}

export function Teaser({
  title,
  subtitle,
  badge,
  href,
  onClick,
  className = "",
  frontImageUrl,
  backImageUrl,
  spotifyId,
}: TeaserProps) {
  const hasSpotify = spotifyId?.trim();
  const textAlign = hasSpotify ? "text-left" : "text-center";
  const justifyContent = hasSpotify ? "justify-start" : "justify-center";

  const content = (
    <div
      className={`group relative flex h-full flex-col rounded-lg border bg-card bg-gray-100 px-5 pt-3 pb-4 ${textAlign} transition-colors hover:bg-accent/50 ${onClick && !href ? "cursor-pointer" : ""}`}
    >
      {hasSpotify ? (
        <div className="grid grid-cols-[1fr_auto] items-center gap-4">
          <div className="flex flex-col">
            <h3 className="font-medium text-md group-hover:text-primary">{title}</h3>
            {(frontImageUrl || backImageUrl) && (
              <div className={`mt-3 flex ${justifyContent} gap-2`}>
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
            {badge && (
              <div className={`mt-2 flex ${justifyContent}`}>
                <span className="rounded-full bg-gray-200 px-2 py-1 text-muted-foreground text-xs">{badge}</span>
              </div>
            )}
          </div>
          <div className="relative flex items-center">
            <div className="spotify-icon-container">
              <div className="spotify-sparkles">
                <div className="spotify-sparkle"></div>
                <div className="spotify-sparkle"></div>
                <div className="spotify-sparkle"></div>
                <div className="spotify-sparkle"></div>
                <div className="spotify-sparkle"></div>
                <div className="spotify-sparkle"></div>
              </div>
              <HugeiconsIcon
                icon={SpotifyIcon}
                className="relative z-10 size-20 text-[#1DB954] transition-all duration-300"
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <h3 className="font-medium text-md group-hover:text-primary">{title}</h3>
          {(frontImageUrl || backImageUrl) && (
            <div className={`mt-3 flex ${justifyContent} gap-2`}>
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
          {badge && (
            <div className={`mt-2 flex ${justifyContent}`}>
              <span className="rounded-full bg-gray-200 px-2 py-1 text-muted-foreground text-xs">{badge}</span>
            </div>
          )}
        </>
      )}
    </div>
  );

  if (href) {
    return (
      <Link to={href} className={`block h-full ${className}`}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <div className={`h-full ${className}`} onClick={onClick}>
        {content}
      </div>
    );
  }

  return <div className={`h-full ${className}`}>{content}</div>;
}
