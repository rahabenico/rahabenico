// Array of light background colors for variety
const backgroundColors = [
  "bg-blue-100",
  "bg-green-100",
  "bg-purple-100",
  "bg-pink-100",
  "bg-yellow-100",
  "bg-indigo-100",
  "bg-red-100",
  "bg-orange-100",
  "bg-teal-100",
  "bg-cyan-100",
];

// Function to get consistent background color based on entry ID
export function getBackgroundColor(entryId: string): string {
  let hash = 0;
  for (let i = 0; i < entryId.length; i++) {
    const char = entryId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return backgroundColors[Math.abs(hash) % backgroundColors.length];
}
