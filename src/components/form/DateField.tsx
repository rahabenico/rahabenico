import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { HugeiconsIcon } from "@hugeicons/react"
import { CalendarIcon } from "@hugeicons/core-free-icons"
import { formatCalendarDate } from "@/lib/utils/formatDate"

interface DateFieldProps {
  date: Date | undefined
  onChange: (date: Date | undefined) => void
  error?: string
  required?: boolean
}

/**
 * Date picker field component
 *
 * @param date - Currently selected date
 * @param onChange - Callback when date changes
 * @param error - Validation error message
 * @param required - Whether the field is required
 *
 * @example
 * ```tsx
 * <DateField
 *   date={selectedDate}
 *   onChange={setSelectedDate}
 *   error={dateError}
 *   required
 * />
 * ```
 */
export function DateField({ date, onChange, error, required }: DateFieldProps) {
  return (
    <Field>
      <FieldLabel>
        <Label>Date {required && '*'}</Label>
      </FieldLabel>
      <FieldContent>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start text-left font-normal"
              aria-invalid={!!error}
            >
              <HugeiconsIcon icon={CalendarIcon} className="mr-2 h-4 w-4" />
              {date ? formatCalendarDate(date) : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {error && <div className="text-sm text-destructive mt-1">{error}</div>}
      </FieldContent>
    </Field>
  )
}
