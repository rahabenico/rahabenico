/**
 * Safely checks if localStorage is available in the current environment
 *
 * @returns true if localStorage is available, false otherwise
 *
 * @example
 * ```typescript
 * if (isLocalStorageAvailable()) {
 *   // Safe to use localStorage
 * } else {
 *   // localStorage is not available
 * }
 * ```
 */
export function isLocalStorageAvailable(): boolean {
  if (typeof window === "undefined") {
    return false
  }

  try {
    const test = "__localStorage_test__"
    window.localStorage.setItem(test, test)
    window.localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

/**
 * Safely gets an item from localStorage
 *
 * @param key - The key to retrieve
 * @param defaultValue - The default value to return if the key doesn't exist or localStorage is unavailable
 * @returns The stored value or the default value
 *
 * @example
 * ```typescript
 * const username = getLocalStorageItem('username', 'guest')
 * console.log(username) // 'john' or 'guest' if not found
 * ```
 */
export function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  if (!isLocalStorageAvailable()) {
    return defaultValue
  }

  try {
    const item = window.localStorage.getItem(key)
    return item !== null ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error)
    return defaultValue
  }
}

/**
 * Safely sets an item in localStorage
 *
 * @param key - The key to store the value under
 * @param value - The value to store (will be JSON serialized)
 * @returns true if the operation succeeded, false otherwise
 *
 * @example
 * ```typescript
 * const success = setLocalStorageItem('user', { name: 'John', age: 30 })
 * if (success) {
 *   console.log('User data saved successfully')
 * }
 * ```
 */
export function setLocalStorageItem<T>(key: string, value: T): boolean {
  if (!isLocalStorageAvailable()) {
    return false
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.warn(`Error writing localStorage key "${key}":`, error)
    return false
  }
}

/**
 * Safely removes an item from localStorage
 *
 * @param key - The key to remove
 * @returns true if the operation succeeded, false otherwise
 *
 * @example
 * ```typescript
 * const success = removeLocalStorageItem('temp_data')
 * if (success) {
 *   console.log('Data removed successfully')
 * }
 * ```
 */
export function removeLocalStorageItem(key: string): boolean {
  if (!isLocalStorageAvailable()) {
    return false
  }

  try {
    window.localStorage.removeItem(key)
    return true
  } catch (error) {
    console.warn(`Error removing localStorage key "${key}":`, error)
    return false
  }
}

/**
 * Safely clears all items from localStorage
 *
 * @returns true if the operation succeeded, false otherwise
 *
 * @example
 * ```typescript
 * const success = clearLocalStorage()
 * if (success) {
 *   console.log('All data cleared')
 * }
 * ```
 */
export function clearLocalStorage(): boolean {
  if (!isLocalStorageAvailable()) {
    return false
  }

  try {
    window.localStorage.clear()
    return true
  } catch (error) {
    console.warn("Error clearing localStorage:", error)
    return false
  }
}
