import { LocationIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { formatGPSCoordinates } from "@/lib/utils/geolocation";

interface GPSFieldProps {
  position: { lat: number; lng: number } | null;
  city: string;
  onGetGPS: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

/**
 * GPS position input field component
 *
 * @param position - Current GPS position (lat/lng)
 * @param city - City name associated with the position
 * @param onGetGPS - Callback to get current GPS position
 * @param isLoading - Whether GPS is currently being fetched
 * @param disabled - Whether the field is disabled
 *
 * @example
 * ```tsx
 * <GPSField
 *   position={gpsPosition}
 *   city={city}
 *   onGetGPS={handleGetGPS}
 *   isLoading={isGPSLoading}
 * />
 * ```
 */
export function GPSField({ position, city, onGetGPS, isLoading, disabled }: GPSFieldProps) {
  return (
    <Field>
      <FieldLabel>
        <Label>GPS Position</Label>
      </FieldLabel>
      <FieldContent>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={onGetGPS} disabled={disabled || !!position || isLoading}>
            <HugeiconsIcon icon={LocationIcon} className="mr-2 h-4 w-4" />
            {isLoading ? "Getting location..." : position ? "Location set" : "Add my GPS position"}
          </Button>
          {position && (
            <div className="text-muted-foreground text-sm">
              {formatGPSCoordinates(position)}
              {city && <span className="ml-2">• {city}</span>}
            </div>
          )}
        </div>
      </FieldContent>
    </Field>
  );
}
