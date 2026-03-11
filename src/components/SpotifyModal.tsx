import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

interface SpotifyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artistName: string;
  spotifyId: string;
}

export function SpotifyModal({ open, onOpenChange, artistName, spotifyId }: SpotifyModalProps) {
  const embedUrl = `https://open.spotify.com/embed/artist/${spotifyId}?utm_source=generator&theme=0`;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80 data-[state=closed]:animate-out data-[state=open]:animate-in"
          onClick={() => onOpenChange(false)}
        />
        <DialogPrimitive.Content
          className={cn(
            "data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-background p-6 outline-none data-[state=closed]:animate-out data-[state=open]:animate-in"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full">
            <iframe
              data-testid="embed-iframe"
              title={`Spotify player for ${artistName}`}
              style={{ borderRadius: "12px" }}
              src={embedUrl}
              width="100%"
              height="352"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
