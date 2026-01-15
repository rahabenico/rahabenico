import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import type { Id } from "../../convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { HugeiconsIcon } from "@hugeicons/react"
import { CalendarIcon, LocationIcon, PlusSignIcon, Cancel01Icon } from "@hugeicons/core-free-icons"

interface EntryFormProps {
  cardId: Id<"cards">
  onSuccess?: () => void
}

export function EntryForm({ cardId, onSuccess }: EntryFormProps) {
  const createCardEntry = useMutation(api.cardEntries.createCardEntry)

  const [username, setUsername] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [location, setLocation] = useState("")
  const [comment, setComment] = useState("")
  const [showComment, setShowComment] = useState(false)
  const [gpsPosition, setGpsPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [city, setCity] = useState<string>("")
  const [artistSuggestions, setArtistSuggestions] = useState<string[]>([""])
  const [taskSuggestions, setTaskSuggestions] = useState<string[]>([""])
  const [showArtistSuggestions, setShowArtistSuggestions] = useState(false)
  const [showTaskSuggestions, setShowTaskSuggestions] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ username?: string; date?: string }>({})

  const getCity = async (lat: number, lon: number): Promise<string | null> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await res.json();

      return (
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        null
      );
    } catch (error) {
      console.error("Error fetching city:", error);
      return null;
    }
  }

  const handleGetGPS = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser")
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        setGpsPosition({ lat, lng })

        // Fetch city from coordinates
        const cityName = await getCity(lat, lng)
        if (cityName) {
          setCity(cityName)
        }
      },
      (error) => {
        alert(`Error getting location: ${error.message}`)
      }
    )
  }

  const addArtistSuggestion = () => {
    setArtistSuggestions([...artistSuggestions, ""])
  }

  const removeArtistSuggestion = (index: number) => {
    setArtistSuggestions(artistSuggestions.filter((_, i) => i !== index))
  }

  const updateArtistSuggestion = (index: number, value: string) => {
    const updated = [...artistSuggestions]
    updated[index] = value
    setArtistSuggestions(updated)
  }

  const addTaskSuggestion = () => {
    setTaskSuggestions([...taskSuggestions, ""])
  }

  const removeTaskSuggestion = (index: number) => {
    setTaskSuggestions(taskSuggestions.filter((_, i) => i !== index))
  }

  const updateTaskSuggestion = (index: number, value: string) => {
    const updated = [...taskSuggestions]
    updated[index] = value
    setTaskSuggestions(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    const newErrors: { username?: string; date?: string } = {}
    if (!username.trim()) {
      newErrors.username = "Username is required"
    }
    if (!date) {
      newErrors.date = "Date is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      await createCardEntry({
        cardId,
        username: username.trim(),
        date: date!.getTime(),
        gpsPosition: gpsPosition || undefined,
        location: location.trim() || undefined,
        city: city.trim() || undefined,
        comment: comment.trim() || undefined,
        artistSuggestions: showArtistSuggestions
          ? artistSuggestions.filter((s) => s.trim()).length > 0
            ? artistSuggestions.filter((s) => s.trim())
            : undefined
          : undefined,
        taskSuggestions: showTaskSuggestions
          ? taskSuggestions.filter((s) => s.trim()).length > 0
            ? taskSuggestions.filter((s) => s.trim())
            : undefined
          : undefined,
      })

      // Save to localStorage
      localStorage.setItem("entry-entered", "true")

      // Reset form
      setUsername("")
      setDate(undefined)
      setLocation("")
      setCity("")
      setComment("")
      setShowComment(false)
      setGpsPosition(null)
      setArtistSuggestions([""])
      setTaskSuggestions([""])
      setShowArtistSuggestions(false)
      setShowTaskSuggestions(false)

      // Call success callback
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error creating entry:", error)
      alert("Failed to save entry. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FieldGroup>
        {/* Username - Required */}
        <Field>
          <FieldLabel>
            <Label htmlFor="username">Username *</Label>
          </FieldLabel>
          <FieldContent>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              aria-invalid={!!errors.username}
            />
            {errors.username && <FieldError>{errors.username}</FieldError>}
          </FieldContent>
        </Field>

        {/* GPS Position - Optional */}
        <Field>
          <FieldLabel>
            <Label>GPS Position</Label>
          </FieldLabel>
          <FieldContent>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleGetGPS}
                disabled={!!gpsPosition}
              >
                <HugeiconsIcon icon={LocationIcon} className="h-4 w-4 mr-2" />
                Add my GPS position
              </Button>
              {gpsPosition && (
                <div className="text-sm text-muted-foreground">
                  Lat: {gpsPosition.lat.toFixed(6)}, Lng: {gpsPosition.lng.toFixed(6)}
                  {city && <span className="ml-2">• {city}</span>}
                </div>
              )}
            </div>
          </FieldContent>
        </Field>

        {/* Location - Optional */}
        <Field>
          <FieldLabel>
            <Label htmlFor="location">Location</Label>
          </FieldLabel>
          <FieldContent>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location description"
            />
          </FieldContent>
        </Field>

        {/* Date - Required */}
        <Field>
          <FieldLabel>
            <Label>Date *</Label>
          </FieldLabel>
          <FieldContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  aria-invalid={!!errors.date}
                >
                  <HugeiconsIcon icon={CalendarIcon} className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.date && <FieldError>{errors.date}</FieldError>}
          </FieldContent>
        </Field>

        {/* Comment - Optional, shown on click */}
        <Field>
          {!showComment ? (
            <button
              type="button"
              onClick={() => setShowComment(true)}
              className="text-sm text-primary hover:underline"
            >
              Add comment
            </button>
          ) : (
            <>
              <FieldLabel>
                <Label htmlFor="comment">Comment</Label>
              </FieldLabel>
              <FieldContent>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Enter your comment"
                  rows={4}
                />
              </FieldContent>
            </>
          )}
        </Field>

        {/* Artist Suggestions - Optional */}
        <Field>
          {!showArtistSuggestions ? (
            <button
              type="button"
              onClick={() => setShowArtistSuggestions(true)}
              className="text-sm text-primary hover:underline"
            >
              Add artist suggestion
            </button>
          ) : (
            <>
              <FieldLabel>
                <Label>Artist Suggestions</Label>
              </FieldLabel>
              <FieldContent>
                <div className="space-y-2">
                  {artistSuggestions.map((suggestion, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={suggestion}
                        onChange={(e) => updateArtistSuggestion(index, e.target.value)}
                        placeholder={`Artist suggestion ${index + 1}`}
                        className="flex-1"
                      />
                      {artistSuggestions.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeArtistSuggestion(index)}
                        >
                          <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addArtistSuggestion}
                    className="w-full"
                  >
                    <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4 mr-2" />
                    Add artist suggestion
                  </Button>
                </div>
              </FieldContent>
            </>
          )}
        </Field>

        {/* Task Suggestions - Optional */}
        <Field>
          {!showTaskSuggestions ? (
            <button
              type="button"
              onClick={() => setShowTaskSuggestions(true)}
              className="text-sm text-primary hover:underline"
            >
              Add task suggestion
            </button>
          ) : (
            <>
              <FieldLabel>
                <Label>Task Suggestions</Label>
              </FieldLabel>
              <FieldContent>
                <div className="space-y-2">
                  {taskSuggestions.map((suggestion, index) => (
                    <div key={index} className="flex gap-2">
                      <Textarea
                        value={suggestion}
                        onChange={(e) => updateTaskSuggestion(index, e.target.value)}
                        placeholder={`Task suggestion ${index + 1}`}
                        className="flex-1 min-h-16"
                        rows={2}
                      />
                      {taskSuggestions.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeTaskSuggestion(index)}
                        >
                          <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTaskSuggestion}
                    className="w-full"
                  >
                    <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4 mr-2" />
                    Add task suggestion
                  </Button>
                </div>
              </FieldContent>
            </>
          )}
        </Field>
      </FieldGroup>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Entry"}
        </Button>
      </div>
    </form>
  )
}

