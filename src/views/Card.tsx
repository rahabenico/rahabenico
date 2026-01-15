import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { EntryForm } from "@/components/EntryForm";
import { CardEntry } from "@/components/CardEntry";

function Card() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const editable = searchParams.get('editable') === 'true'
  const [isOpen, setIsOpen] = useState(false)
  // Initialize from localStorage
  const [hasEnteredEntry, setHasEnteredEntry] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("entry-entered") === "true"
    }
    return false
  })

  const card = useQuery(api.cardEntries.getCardByCustomId, id ? { customId: id } : "skip")
  const entries = useQuery(
    api.cardEntries.getCardEntriesByCardId,
    card ? { cardId: card._id } : "skip"
  )

  const handleSuccess = () => {
    setIsOpen(false)
    setHasEnteredEntry(true)
    // Clear localStorage so they can add more entries
    if (typeof window !== "undefined") {
      localStorage.removeItem("entry-entered")
    }
  }

  if (!id) {
    return <div>Card ID is required</div>
  }

  if (card === undefined) {
    return <div>Loading...</div>
  }

  if (card === null) {
    return <div>Card not found</div>
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Card: {id}</h1>
        <p className="text-lg text-muted-foreground">{card.task}</p>
        {editable && <p className="text-sm text-muted-foreground mt-2">Editable mode</p>}
      </div>

      {entries !== undefined && (
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold">
            Entries {entries && entries.length > 0 && `(${entries.length})`}
          </h2>
          {entries === undefined ? (
            <div>Loading entries...</div>
          ) : entries.length === 0 ? (
            <p className="text-muted-foreground">No entries yet. Be the first to add one!</p>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <CardEntry key={entry._id} entry={entry} />
              ))}
            </div>
          )}
        </div>
      )}

      {!hasEnteredEntry && editable && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                size="lg"
                aria-label="Open form"
              >
                Add entry
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetHeader>
                <SheetTitle>Add Entry</SheetTitle>
                <SheetDescription>
                  Fill out the form below to add an entry to this card.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <EntryForm 
                  cardId={card._id} 
                  onSuccess={handleSuccess}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </div>
  )
}

export default Card

