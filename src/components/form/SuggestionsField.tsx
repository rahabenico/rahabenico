import { Cancel01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SuggestionItem {
  id: string;
  value: string;
}

interface SuggestionsFieldProps {
  title: string;
  suggestions: SuggestionItem[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, value: string) => void;
  onToggle: () => void;
  isVisible: boolean;
  isTextarea?: boolean;
}

/**
 * Dynamic suggestions field component for adding/removing multiple items
 *
 * @param title - Field title (e.g., "Artist Suggestions")
 * @param suggestions - Array of suggestion strings
 * @param onAdd - Callback to add a new suggestion
 * @param onRemove - Callback to remove suggestion at index
 * @param onUpdate - Callback to update suggestion at index
 * @param onToggle - Callback to toggle field visibility
 * @param isVisible - Whether the field is currently visible
 * @param isTextarea - Whether to use textarea instead of input
 *
 * @example
 * ```tsx
 * <SuggestionsField
 *   title="Artist Suggestions"
 *   suggestions={artistSuggestions}
 *   onAdd={addArtistSuggestion}
 *   onRemove={removeArtistSuggestion}
 *   onUpdate={updateArtistSuggestion}
 *   onToggle={toggleArtistSuggestions}
 *   isVisible={showArtistSuggestions}
 * />
 * ```
 */
export function SuggestionsField({
  title,
  suggestions,
  onAdd,
  onRemove,
  onUpdate,
  onToggle,
  isVisible,
  isTextarea = false,
}: SuggestionsFieldProps) {
  if (!isVisible) {
    return (
      <button type="button" onClick={onToggle} className="text-primary text-sm hover:underline">
        Add {title.toLowerCase()}
      </button>
    );
  }

  return (
    <Field>
      <FieldLabel>
        <Label>{title}</Label>
      </FieldLabel>
      <FieldContent>
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <div key={suggestion.id} className="flex gap-2">
              {isTextarea ? (
                <Textarea
                  value={suggestion.value}
                  onChange={(e) => onUpdate(index, e.target.value)}
                  placeholder={`${title} ${index + 1}`}
                  className="min-h-16 flex-1"
                  rows={2}
                />
              ) : (
                <Input
                  value={suggestion.value}
                  onChange={(e) => onUpdate(index, e.target.value)}
                  placeholder={`${title} ${index + 1}`}
                  className="flex-1"
                />
              )}
              {suggestions.length > 1 && (
                <Button type="button" variant="outline" size="icon" onClick={() => onRemove(index)}>
                  <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={onAdd} className="w-full">
            <HugeiconsIcon icon={PlusSignIcon} className="mr-2 h-4 w-4" />
            Add {title.toLowerCase()}
          </Button>
        </div>
      </FieldContent>
    </Field>
  );
}
