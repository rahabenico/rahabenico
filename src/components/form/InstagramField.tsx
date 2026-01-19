import { Input } from "@/components/ui/input"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Label } from "@/components/ui/label"

interface InstagramFieldProps {
  value: string
  onChange: (value: string) => void
  isVisible: boolean
  onToggle: () => void
}

/**
 * Instagram handle input field component with show/hide toggle
 *
 * @param value - Instagram handle value
 * @param onChange - Callback when handle changes
 * @param isVisible - Whether the instagram field is currently visible
 * @param onToggle - Callback to toggle field visibility
 *
 * @example
 * ```tsx
 * <InstagramField
 *   value={instagram}
 *   onChange={setInstagram}
 *   isVisible={showInstagram}
 *   onToggle={() => setShowInstagram(!showInstagram)}
 * />
 * ```
 */
export function InstagramField({ value, onChange, isVisible, onToggle }: InstagramFieldProps) {
  if (!isVisible) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className="text-sm text-primary hover:underline"
      >
        Add Instagram handle
      </button>
    )
  }

  return (
    <Field>
      <FieldLabel>
        <Label htmlFor="instagram">Instagram Handle</Label>
      </FieldLabel>
      <FieldContent>
        <Input
          id="instagram"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your Instagram handle (e.g. @username)"
        />
      </FieldContent>
    </Field>
  )
}
