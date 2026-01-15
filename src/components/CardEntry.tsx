import { format } from "date-fns"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import { LocationIcon, UserIcon, CalendarIcon, FileIcon, LayoutIcon } from "@hugeicons/core-free-icons"
import { Badge } from "@/components/ui/badge"

interface CardEntryProps {
  entry: {
    _id: string
    username: string
    date: number
    location?: string
    gpsPosition?: { lat: number; lng: number }
    city?: string
    comment?: string
    artistSuggestions?: string[]
    taskSuggestions?: string[]
  }
}

export function CardEntry({ entry }: CardEntryProps) {
  const entryDate = new Date(entry.date)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={UserIcon} className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{entry.username}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <HugeiconsIcon icon={CalendarIcon} className="h-4 w-4" />
            <time dateTime={entryDate.toISOString()}>
              {format(entryDate, "PPP 'at' p")}
            </time>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {entry.location && (
          <div className="flex items-start gap-2 text-sm">
            <HugeiconsIcon icon={LocationIcon} className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <span className="text-muted-foreground">{entry.location}</span>
          </div>
        )}
        
        {entry.gpsPosition && (
          <div className="flex items-start gap-2 text-sm">
            <HugeiconsIcon icon={LocationIcon} className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <span className="text-muted-foreground font-mono text-xs">
              GPS: {entry.gpsPosition.lat.toFixed(6)}, {entry.gpsPosition.lng.toFixed(6)}
              {entry.city && <span className="ml-2 font-sans">• {entry.city}</span>}
            </span>
          </div>
        )}

        {entry.comment && (
          <div className="pt-2 border-t">
            <p className="text-sm whitespace-pre-wrap">{entry.comment}</p>
          </div>
        )}

        {entry.artistSuggestions && entry.artistSuggestions.length > 0 && (
          <div className="pt-2 border-t">
            <div className="flex items-start gap-2 mb-2">
              <HugeiconsIcon icon={FileIcon} className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground mb-1">Artist Suggestions</p>
                <div className="flex flex-wrap gap-1.5">
                  {entry.artistSuggestions.map((artist, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {artist}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {entry.taskSuggestions && entry.taskSuggestions.length > 0 && (
          <div className="pt-2 border-t">
            <div className="flex items-start gap-2">
              <HugeiconsIcon icon={LayoutIcon} className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground mb-1">Task Suggestions</p>
                <div className="space-y-1">
                  {entry.taskSuggestions.map((task, index) => (
                    <p key={index} className="text-sm text-muted-foreground">
                      • {task}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

