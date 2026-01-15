import { formatDisplayDate } from "@/lib/utils/formatDate"
import { getBackgroundColor } from "@/lib/utils/colors"
import { Card } from "@/components/ui/card/card"
import { CardContent } from "@/components/ui/card/card-content"
import { CardHeader } from "@/components/ui/card/card-header"
import { HugeiconsIcon } from "@hugeicons/react"
import { LocationIcon, CalendarIcon, FileIcon } from "@hugeicons/core-free-icons"
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

export function EntryCard({ entry }: CardEntryProps) {
  const entryDate = new Date(entry.date)
  const backgroundColor = getBackgroundColor(entry._id)

  return (
    <Card className={`${backgroundColor}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg text-black">{entry.username}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-black font-semibold">
            <HugeiconsIcon icon={CalendarIcon} className="h-4 w-4" />
            <time dateTime={entryDate.toISOString()}>
              {formatDisplayDate(entryDate)}
            </time>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {entry.location && (
          <div className="flex items-start gap-3 text-sm">
            <HugeiconsIcon icon={LocationIcon} className="h-5 w-5 text-black mt-0.5 shrink-0" />
            <span className="font-medium text-black">{entry.location}</span>
          </div>
        )}

        {entry.gpsPosition && (
          <div className="flex items-start gap-3 text-sm">
            <HugeiconsIcon icon={LocationIcon} className="h-5 w-5 text-black mt-0.5 shrink-0" />
            <span className="font-medium text-black font-mono text-sm">
              GPS: {entry.gpsPosition.lat.toFixed(6)}, {entry.gpsPosition.lng.toFixed(6)}
              {entry.city && <span className="ml-2 font-sans font-semibold">• {entry.city}</span>}
            </span>
          </div>
        )}

        {entry.comment && (
          <div className="pt-3 border-t border-black/20">
            <p className="text-base font-medium text-black whitespace-pre-wrap leading-relaxed">{entry.comment}</p>
          </div>
        )}

        {entry.artistSuggestions && entry.artistSuggestions.length > 0 && (
          <div className="pt-3 border-t border-black/20">
            <div className="flex items-start gap-3 mb-3">
              <HugeiconsIcon icon={FileIcon} className="h-5 w-5 text-black mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-bold text-black mb-2">Artist Suggestions</p>
                <div className="flex flex-wrap gap-2">
                  {entry.artistSuggestions.map((artist, index) => (
                    <Badge key={index} variant="secondary" className="text-sm font-semibold bg-white border border-black/20 text-black">
                      {artist}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* {entry.taskSuggestions && entry.taskSuggestions.length > 0 && (
          <div className="pt-3 border-t border-black/20">
            <div className="flex items-start gap-3">
              <HugeiconsIcon icon={LayoutIcon} className="h-5 w-5 text-black mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-bold text-black mb-2">Task Suggestions</p>
                <div className="space-y-1">
                  {entry.taskSuggestions.map((task, index) => (
                    <p key={index} className="text-base font-medium text-black">
                      • {task}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )} */}
      </CardContent>
    </Card>
  )
}

