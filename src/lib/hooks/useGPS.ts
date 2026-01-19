import { useCallback, useState } from "react";
import {
  type GPSPosition,
  getCityFromCoordinates,
  getCurrentPosition,
  isGeolocationSupported,
} from "../utils/geolocation";

export interface GPSData {
  position: GPSPosition | null;
  city: string;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for managing GPS position and city lookup
 *
 * @returns An object containing GPS data and control functions
 *
 * @example
 * ```typescript
 * function LocationInput() {
 *   const { position, city, isLoading, error, getGPS, clearGPS } = useGPS()
 *
 *   return (
 *     <div>
 *       <button onClick={getGPS} disabled={isLoading || !!position}>
 *         {isLoading ? 'Getting location...' : position ? 'Location set' : 'Get GPS'}
 *       </button>
 *       {position && (
 *         <div>
 *           <p>Coordinates: {formatGPSCoordinates(position)}</p>
 *           {city && <p>City: {city}</p>}
 *           <button onClick={clearGPS}>Clear</button>
 *         </div>
 *       )}
 *       {error && <p className="error">{error}</p>}
 *     </div>
 *   )
 * }
 * ```
 */
export function useGPS() {
  const [data, setData] = useState<GPSData>({
    position: null,
    city: "",
    isLoading: false,
    error: null,
  });

  const getGPS = useCallback(async () => {
    if (!isGeolocationSupported()) {
      setData((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
      }));
      return;
    }

    setData((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const position = await getCurrentPosition();

      setData((prev) => ({
        ...prev,
        position,
        isLoading: false,
      }));

      // Fetch city in background
      const city = await getCityFromCoordinates(position.lat, position.lng);
      if (city) {
        setData((prev) => ({
          ...prev,
          city,
        }));
      }
    } catch (error) {
      setData((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to get location",
      }));
    }
  }, []);

  const clearGPS = useCallback(() => {
    setData({
      position: null,
      city: "",
      isLoading: false,
      error: null,
    });
  }, []);

  const setGPSData = useCallback((position: GPSPosition | null, city: string = "") => {
    setData({
      position,
      city,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...data,
    getGPS,
    clearGPS,
    setGPSData,
    isSupported: isGeolocationSupported(),
  };
}
