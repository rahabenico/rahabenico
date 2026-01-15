import { ConvexReactClient } from "convex/react"

// Get the Convex URL from environment variable or use a default
// In production, this should be set via environment variables
const convexUrl = import.meta.env.VITE_CONVEX_URL || ""

if (!convexUrl) {
  console.warn(
    "VITE_CONVEX_URL is not set. Please set it in your .env file or environment variables."
  )
}

export const convex = new ConvexReactClient(convexUrl)

