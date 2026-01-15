import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Link } from 'react-router-dom'
import { LoadingBar } from '@/components/ui/spinner'

function Home() {
  const cards = useQuery(api.cardEntries.getAllCards)
  const artistSuggestions = useQuery(api.cardEntries.getAllArtistSuggestions)

  const isLoading = !cards || !artistSuggestions

  return (
    <>
      <LoadingBar isLoading={isLoading} />
      <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold mb-2">Home</h1>
        <p className="text-lg text-muted-foreground">Welcome to Rahabenico</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-headline font-semibold">
          Available Cards {cards && cards.length > 0 && `(${cards.length})`}
        </h2>

        {!cards ? (
          <p className="text-muted-foreground">Loading cards...</p>
        ) : cards.length === 0 ? (
          <p className="text-muted-foreground">No cards available yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <Link
                key={card._id}
                to={`/card/${card.customId}`}
                className="p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors block"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-lg">{card.customId}</h3>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {card.task}
                </div>
              </Link>
            ))}
          </div>
        )}

        <h2 className="text-xl font-headline font-semibold">
          Artist Suggestions {artistSuggestions && artistSuggestions.length > 0 && `(${artistSuggestions.length})`}
        </h2>

        {!artistSuggestions ? (
          <p className="text-muted-foreground">Loading artist suggestions...</p>
        ) : artistSuggestions.length === 0 ? (
          <p className="text-muted-foreground">No artist suggestions yet. Be the first to suggest one!</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {artistSuggestions.map((artist, index) => (
              <div
                key={artist.name}
                className="p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-lg">{artist.name}</h3>
                  <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {artist.count} {artist.count === 1 ? 'suggestion' : 'suggestions'}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  #{index + 1} most suggested
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  )
}

export default Home

