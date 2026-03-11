import React from "react";
import { CommentField } from "@/components/form/CommentField";
import { GPSField } from "@/components/form/GPSField";
import { InstagramField } from "@/components/form/InstagramField";
import { SuggestionsField } from "@/components/form/SuggestionsField";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingBar } from "@/components/ui/spinner";
import { useEntryFormState } from "@/lib/hooks/useEntryFormState";
import { useGPS } from "@/lib/hooks/useGPS";
import { getFieldError } from "@/lib/utils/validation";
import type { Id } from "../../convex/_generated/dataModel";

interface EntryFormProps {
  cardId: Id<"cards">;
  onSuccess?: () => void;
}

export function EntryForm({ cardId, onSuccess }: EntryFormProps) {
  const {
    formState,
    handleInputChange,
    handleFieldChange,
    handleSubmit,
    toggleComment,
    toggleInstagram,
    toggleArtistSuggestions,
    toggleTaskSuggestions,
    toggleNotification,
    addArtistSuggestion,
    removeArtistSuggestion,
    updateArtistSuggestion,
    addTaskSuggestion,
    removeTaskSuggestion,
    updateTaskSuggestion,
    setGPSData,
  } = useEntryFormState(cardId, onSuccess);

  const { position, city, isLoading: gpsLoading, error: gpsError, getGPS } = useGPS();

  // Sync GPS data from hook to form state
  React.useEffect(() => {
    setGPSData(position, city);
  }, [position, city, setGPSData]);

  // Show GPS error if any
  React.useEffect(() => {
    if (gpsError) {
      alert(gpsError);
    }
  }, [gpsError]);

  // Prevent all form submissions except via button click
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <>
      <LoadingBar isLoading={formState.isSubmitting} />
      <form onSubmit={handleFormSubmit}>
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
                aria-invalid={!!getFieldError(formState.validation.errors, "username")}
              />
              {getFieldError(formState.validation.errors, "username") && (
                <FieldError>{getFieldError(formState.validation.errors, "username")}</FieldError>
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
          {/* 
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
          </Field> */}

          {/* Comment - Optional */}
          <CommentField
            value={formState.comment}
            onChange={(value) => handleFieldChange("comment", value)}
            isVisible={formState.showComment}
            onToggle={toggleComment}
          />

          {/* Instagram - Optional */}
          <InstagramField
            value={formState.instagram}
            onChange={(value) => handleFieldChange("instagram", value)}
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

          {/* Interested in Buying - Optional */}
          <Field orientation="horizontal">
            <FieldContent>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="interestedInBuying"
                  checked={formState.interestedInBuying}
                  onCheckedChange={(checked) => handleFieldChange("interestedInBuying", checked)}
                />
                <Label htmlFor="interestedInBuying" className="cursor-pointer font-normal text-sm">
                  Would you be interested in buying your own set of cards in the future?
                </Label>
              </div>
            </FieldContent>
          </Field>

          {/* Notification Subscription - Optional */}
          <Field orientation="horizontal">
            <FieldContent>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="wantNotification"
                  checked={formState.wantNotification}
                  onCheckedChange={toggleNotification}
                />
                <Label htmlFor="wantNotification" className="cursor-pointer font-normal text-sm">
                  You want to be notified if there is a new entry to this card?
                </Label>
              </div>
            </FieldContent>
          </Field>

          {/* Notification Email - Shown when checkbox is checked */}
          {formState.wantNotification && (
            <Field>
              <FieldLabel>
                <Label htmlFor="notificationEmail">Email Address *</Label>
              </FieldLabel>
              <FieldContent className="flex items-center gap-1">
                <Input
                  id="notificationEmail"
                  name="notificationEmail"
                  type="email"
                  value={formState.notificationEmail}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  aria-invalid={!!getFieldError(formState.validation.errors, "notificationEmail")}
                />
                {getFieldError(formState.validation.errors, "notificationEmail") && (
                  <FieldError>{getFieldError(formState.validation.errors, "notificationEmail")}</FieldError>
                )}
              </FieldContent>
            </Field>
          )}
        </FieldGroup>

        <div className="sticky right-0 bottom-0 left-0 z-10 border-border border-t bg-background p-4">
          <Button type="button" onClick={handleSubmit} disabled={formState.isSubmitting} className="w-full">
            {formState.isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </>
  );
}
