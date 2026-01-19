import { CalendarIcon, Instagram, LocationIcon, MusicNoteIcon } from "@hugeicons/core-free-icons";
import { IconItem } from "@/components/IconItem";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card/card";
import { CardContent } from "@/components/ui/card/card-content";
import { CardHeader } from "@/components/ui/card/card-header";
import { getBackgroundColor } from "@/lib/utils/colors";
import { formatDisplayDate } from "@/lib/utils/formatDate";

interface CardEntryProps {
  entry: {
    _id: string;
    username: string;
    date: number;
    location?: string;
    gpsPosition?: { lat: number; lng: number };
    city?: string;
    comment?: string;
    instagram?: string;
    artistSuggestions?: string[];
    taskSuggestions?: string[];
  };
}

export function EntryCard({ entry }: CardEntryProps) {
  const entryDate = new Date(entry.date);
  const backgroundColor = getBackgroundColor(entry._id);

  return (
    <Card className={`${backgroundColor}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <span className="font-bold text-black text-lg">{entry.username}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 md:flex md:gap-2">
        <div className="flex-1 space-y-4">
          {entryDate && (
            <IconItem icon={CalendarIcon} className="text-sm">
              <time dateTime={entryDate.toISOString()}>{formatDisplayDate(entryDate)}</time>
            </IconItem>
          )}

          {(entry.gpsPosition || entry.location) && (
            <IconItem icon={LocationIcon} className="text-sm">
              <div>
                {entry.city && <span>{entry.city}</span>}
                {entry.city && ", "}
                {entry.location && <span>{entry.location}</span>}
              </div>
            </IconItem>
          )}

          {entry.instagram && (
            <IconItem icon={Instagram} className="text-sm">
              <a
                href={`https://www.instagram.com/${entry.instagram.replace("@", "")}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black underline"
              >
                @{entry.instagram.replace("@", "")}
              </a>
            </IconItem>
          )}

          {entry.artistSuggestions && entry.artistSuggestions.length > 0 && (
            <IconItem icon={MusicNoteIcon}>
              {entry.artistSuggestions.map((artist) => (
                <Badge key={artist}>{artist}</Badge>
              ))}
            </IconItem>
          )}
        </div>

        {entry.comment && (
          <div className="flex-1 rounded-lg bg-black/8 px-5 py-3 text-left">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">"{entry.comment}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
