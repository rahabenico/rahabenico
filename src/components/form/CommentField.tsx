import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CommentFieldProps {
  value: string;
  onChange: (value: string) => void;
  isVisible: boolean;
  onToggle: () => void;
}

/**
 * Comment input field component with show/hide toggle
 *
 * @param value - Comment text value
 * @param onChange - Callback when comment changes
 * @param isVisible - Whether the comment field is currently visible
 * @param onToggle - Callback to toggle field visibility
 *
 * @example
 * ```tsx
 * <CommentField
 *   value={comment}
 *   onChange={setComment}
 *   isVisible={showComment}
 *   onToggle={() => setShowComment(!showComment)}
 * />
 * ```
 */
export function CommentField({ value, onChange, isVisible, onToggle }: CommentFieldProps) {
  if (!isVisible) {
    return (
      <button type="button" onClick={onToggle} className="text-primary text-sm hover:underline">
        Add comment
      </button>
    );
  }

  return (
    <Field>
      <FieldLabel>
        <Label htmlFor="comment">Comment</Label>
      </FieldLabel>
      <FieldContent>
        <Textarea
          id="comment"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your comment"
          rows={4}
        />
      </FieldContent>
    </Field>
  );
}
