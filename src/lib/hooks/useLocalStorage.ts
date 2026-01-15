import { useState, useEffect, useCallback } from 'react'
import {
  getLocalStorageItem,
  setLocalStorageItem,
  removeLocalStorageItem,
  isLocalStorageAvailable
} from '../utils/localStorage'

/**
 * Hook for managing localStorage values with React state synchronization
 *
 * @param key - The localStorage key
 * @param defaultValue - The default value to use if the key doesn't exist
 * @returns A tuple containing the current value and a setter function
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const [username, setUsername] = useLocalStorage('username', '')
 *
 *   return (
 *     <input
 *       value={username}
 *       onChange={(e) => setUsername(e.target.value)}
 *       placeholder="Enter username"
 *     />
 *   )
 * }
 * ```
 */
export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    return getLocalStorageItem(key, defaultValue)
  })

  const setStoredValue = useCallback((newValue: T) => {
    setValue(newValue)
    setLocalStorageItem(key, newValue)
  }, [key])

  // Listen for changes from other tabs/windows
  useEffect(() => {
    if (!isLocalStorageAvailable()) {
      return
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setValue(JSON.parse(e.newValue))
        } catch {
          // If parsing fails, keep current value
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [value, setStoredValue]
}

/**
 * Hook for managing boolean flags in localStorage
 *
 * @param key - The localStorage key
 * @param defaultValue - The default boolean value (default: false)
 * @returns A tuple containing the current boolean value and a setter function
 *
 * @example
 * ```typescript
 * function EntryForm() {
 *   const [hasEntered, setHasEntered] = useLocalStorageFlag('entry-entered')
 *
 *   const handleSubmit = () => {
 *     // Submit logic
 *     setHasEntered(true)
 *   }
 *
 *   return (
 *     <button disabled={hasEntered} onClick={handleSubmit}>
 *       {hasEntered ? 'Already entered' : 'Add entry'}
 *     </button>
 *   )
 * }
 * ```
 */
export function useLocalStorageFlag(key: string, defaultValue: boolean = false): [boolean, (value: boolean) => void] {
  return useLocalStorage(key, defaultValue)
}

/**
 * Hook for managing localStorage with removal capability
 *
 * @param key - The localStorage key
 * @param defaultValue - The default value to use if the key doesn't exist
 * @returns An object with value, setter, and remove functions
 *
 * @example
 * ```typescript
 * function TempStorage() {
 *   const { value, setValue, removeValue } = useLocalStorageWithRemove('temp', '')
 *
 *   return (
 *     <div>
 *       <input value={value} onChange={(e) => setValue(e.target.value)} />
 *       <button onClick={removeValue}>Clear</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useLocalStorageWithRemove<T>(key: string, defaultValue: T) {
  const [value, setValue] = useLocalStorage(key, defaultValue)

  const removeValue = useCallback(() => {
    setValue(defaultValue)
    removeLocalStorageItem(key)
  }, [key, defaultValue, setValue])

  return {
    value,
    setValue,
    removeValue
  }
}
