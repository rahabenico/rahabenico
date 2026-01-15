import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'

/**
 * Hook for fetching card data and its associated entries
 *
 * @param customId - The custom ID of the card to fetch
 * @returns An object containing the card data, entries, and loading states
 *
 * @example
 * ```typescript
 * function CardView({ customId }: { customId: string }) {
 *   const { card, entries, isLoading } = useCardData(customId)
 *
 *   if (isLoading) return <div>Loading...</div>
 *   if (!card) return <div>Card not found</div>
 *
 *   return (
 *     <div>
 *       <h1>{card.task}</h1>
 *       {entries?.map(entry => <div key={entry._id}>{entry.username}</div>)}
 *     </div>
 *   )
 * }
 * ```
 */
export function useCardData(customId: string | undefined) {
  const card = useQuery(
    api.cardEntries.getCardByCustomId,
    customId ? { customId } : "skip"
  )

  const entries = useQuery(
    api.cardEntries.getCardEntriesByCardId,
    card ? { cardId: card._id } : "skip"
  )

  const isLoading = card === undefined || (card && entries === undefined)

  return {
    card,
    entries: entries || [],
    isLoading,
    hasCard: card !== null && card !== undefined,
    hasEntries: entries !== null && entries !== undefined && entries.length > 0,
  }
}
