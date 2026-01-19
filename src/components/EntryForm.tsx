import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { LoadingBar } from "@/components/ui/spinner"
import type { Id } from "../../convex/_generated/dataModel"
import { useEntryFormState } from "@/lib/hooks/useEntryFormState"
import { useGPS } from "@/lib/hooks/useGPS"
import { GPSField } from "@/components/form/GPSField"
import { DateField } from "@/components/form/DateField"
import { CommentField } from "@/components/form/CommentField"
import { InstagramField } from "@/components/form/InstagramField"
import { SuggestionsField } from "@/components/form/SuggestionsField"
import { getFieldError } from "@/lib/utils/validation"

interface EntryFormProps {
  cardId: Id<"cards">
  onSuccess?: () => void
}

export function EntryForm({ cardId, onSuccess }: EntryFormProps) {
  const {
    formState,
    handleInputChange,
    handleFieldChange,
    handleDateChange,
    handleSubmit,
    toggleComment,
    toggleInstagram,
    toggleArtistSuggestions,
    toggleTaskSuggestions,
    addArtistSuggestion,
    removeArtistSuggestion,
    updateArtistSuggestion,
    addTaskSuggestion,
    removeTaskSuggestion,
    updateTaskSuggestion,
    setGPSData,
  } = useEntryFormState(cardId, onSuccess)

  const { position, city, isLoading: gpsLoading, error: gpsError, getGPS } = useGPS()

  // Sync GPS data from hook to form state
  React.useEffect(() => {
    setGPSData(position, city)
  }, [position, city, setGPSData])

  // Show GPS error if any
  React.useEffect(() => {
    if (gpsError) {
      alert(gpsError)
    }
  }, [gpsError])

  return (
    <>
      <LoadingBar isLoading={formState.isSubmitting} />
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
              name="username"
              value={formState.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              aria-invalid={!!getFieldError(formState.validation.errors, 'username')}
            />
            {getFieldError(formState.validation.errors, 'username') && (
              <FieldError>{getFieldError(formState.validation.errors, 'username')}</FieldError>
            )}
          </FieldContent>
        </Field>

        {/* GPS Position */}
        <GPSField
          position={formState.gpsPosition}
          city={formState.city}
          onGetGPS={getGPS}
          isLoading={gpsLoading}
          disabled={formState.isSubmitting}
        />

        {/* Location - Optional */}
        <Field>
          <FieldLabel>
            <Label htmlFor="location">Location</Label>
          </FieldLabel>
          <FieldContent>
            <Input
              id="location"
              name="location"
              value={formState.location}
              onChange={handleInputChange}
              placeholder="Enter location description"
            />
          </FieldContent>
        </Field>

        {/* Date - Required */}
        <DateField
          date={formState.date}
          onChange={handleDateChange}
          error={getFieldError(formState.validation.errors, 'date')}
          required
        />

        {/* Comment - Optional */}
        <CommentField
          value={formState.comment}
          onChange={(value) => handleFieldChange('comment', value)}
          isVisible={formState.showComment}
          onToggle={toggleComment}
        />

        {/* Instagram - Optional */}
        <InstagramField
          value={formState.instagram}
          onChange={(value) => handleFieldChange('instagram', value)}
          isVisible={formState.showInstagram}
          onToggle={toggleInstagram}
        />

        {/* Artist Suggestions - Optional */}
        <SuggestionsField
          title="Artist Suggestions"
          suggestions={formState.artistSuggestions}
          onAdd={addArtistSuggestion}
          onRemove={removeArtistSuggestion}
          onUpdate={updateArtistSuggestion}
          onToggle={toggleArtistSuggestions}
          isVisible={formState.showArtistSuggestions}
        />

        {/* Task Suggestions - Optional */}
        <SuggestionsField
          title="Task Suggestions"
          suggestions={formState.taskSuggestions}
          onAdd={addTaskSuggestion}
          onRemove={removeTaskSuggestion}
          onUpdate={updateTaskSuggestion}
          onToggle={toggleTaskSuggestions}
          isVisible={formState.showTaskSuggestions}
          isTextarea
        />
      </FieldGroup>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? "Saving..." : "Save Entry"}
        </Button>
      </div>
    </form>
    </>
  )
}

