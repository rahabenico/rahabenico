export interface GPSPosition {
  lat: number
  lng: number
}

/**
 * Checks if geolocation is supported by the browser
 *
 * @returns true if geolocation is supported, false otherwise
 *
 * @example
 * ```typescript
 * if (isGeolocationSupported()) {
 *   // Geolocation is available
 * } else {
 *   // Geolocation is not supported
 * }
 * ```
 */
export function isGeolocationSupported(): boolean {
  return typeof navigator !== "undefined" && "geolocation" in navigator
}

/**
 * Gets the current GPS position using the browser's geolocation API
 *
 * @returns A promise that resolves to the GPS position or rejects with an error
 *
 * @example
 * ```typescript
 * try {
 *   const position = await getCurrentPosition()
 *   console.log('Latitude:', position.lat, 'Longitude:', position.lng)
 * } catch (error) {
 *   console.error('Error getting position:', error)
 * }
 * ```
 */
export function getCurrentPosition(): Promise<GPSPosition> {
  return new Promise((resolve, reject) => {
    if (!isGeolocationSupported()) {
      reject(new Error("Geolocation is not supported by your browser"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        reject(new Error(`Error getting location: ${error.message}`))
      }
    )
  })
}

/**
 * Fetches the city name for given coordinates using Nominatim (OpenStreetMap)
 *
 * @param lat - Latitude coordinate
 * @param lng - Longitude coordinate
 * @returns A promise that resolves to the city name or null if not found
 *
 * @example
 * ```typescript
 * try {
 *   const city = await getCityFromCoordinates(52.5200, 13.4050)
 *   console.log('City:', city) // "Berlin"
 * } catch (error) {
 *   console.error('Error fetching city:', error)
 * }
 * ```
 */
export async function getCityFromCoordinates(lat: number, lng: number): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return (
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      null
    )
  } catch (error) {
    console.error("Error fetching city:", error)
    return null
  }
}

/**
 * Formats GPS coordinates for display
 *
 * @param position - The GPS position object
 * @param precision - Number of decimal places (default: 6)
 * @returns A formatted string representation of the coordinates
 *
 * @example
 * ```typescript
 * const position = { lat: 52.520008, lng: 13.404954 }
 * console.log(formatGPSCoordinates(position)) // "52.520008, 13.404954"
 * console.log(formatGPSCoordinates(position, 2)) // "52.52, 13.40"
 * ```
 */
export function formatGPSCoordinates(position: GPSPosition, precision: number = 6): string {
  return `${position.lat.toFixed(precision)}, ${position.lng.toFixed(precision)}`
}
