import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { LoadingBar } from '@/components/ui/spinner'
import { Teaser } from '@/components/Teaser'

function Home() {
  const cards = useQuery(api.cardEntries.getAllCards)
  const artistSuggestions = useQuery(api.cardEntries.getAllArtistSuggestions)

  const isLoading = !cards || !artistSuggestions

  return (
    <>
      <LoadingBar isLoading={isLoading} />
      <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-bold mb-2">Welcome to Rahabenico</h1>
      </div>

      <div className="space-y-8">
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
              <Teaser
                key={card._id}
                href={`/card/${card.customId}`}
                title={card.customId}
                subtitle={card.task}
              />
            ))}
          </div>
        )}
        </div>
        <div className="space-y-4">

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
              <Teaser
                key={artist.name}
                title={artist.name}
                badge={`${artist.count} ${artist.count === 1 ? 'suggestion' : 'suggestions'}`}
                subtitle={`#${index + 1} most suggested`}
              />
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
    </>
  )
}

export default Home

