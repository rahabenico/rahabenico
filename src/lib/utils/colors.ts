// Array of light background colors for variety
const backgroundColors = [
  "bg-blue-50",
  "bg-green-50",
  "bg-purple-50",
  "bg-pink-50",
  "bg-yellow-50",
  "bg-indigo-50",
  "bg-red-50",
  "bg-orange-50",
  "bg-teal-50",
  "bg-cyan-50"
]

// Function to get consistent background color based on entry ID
export function getBackgroundColor(entryId: string): string {
  let hash = 0
  for (let i = 0; i < entryId.length; i++) {
    const char = entryId.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return backgroundColors[Math.abs(hash) % backgroundColors.length]
}
