import { useQuery } from "convex/react";
import { useState } from "react";
import { Heading } from "@/components/Heading";
import { Teaser } from "@/components/Teaser";
import { LoadingBar } from "@/components/ui/spinner";
import { api } from "../../convex/_generated/api";

function Home() {
  const [showAllCards, setShowAllCards] = useState(false);
  const cards = useQuery(api.cardEntries.getAllCards);
  const artistSuggestions = useQuery(api.cardEntries.getAllArtistSuggestions);

  const isLoading = !cards || !artistSuggestions;

  return (
    <>
      <LoadingBar isLoading={isLoading} />
      <div className="container mx-auto max-w-4xl space-y-12 px-4 py-12">
        <div className="space-y-4">
          <Heading level={1} variant="main">
            Welcome to <span className="text-[#7E20D1]">rahabenico</span>
          </Heading>
          <Heading level={2}>
            <span className="text-[#7E20D1]">Ra</span>ve <span className="text-[#7E20D1]">ha</span>rd.{" "}
            <span className="text-[#7E20D1]">Be</span> <span className="text-[#7E20D1]">ni</span>ce.{" "}
            <span className="text-[#7E20D1]">Co</span>nnect.
          </Heading>
          <p>
            This is a platform for connecting with others at raves. It's a place to share your experiences, find new
            friends, and explore new music.
          </p>
        </div>
        <div className="space-y-4">
          <Heading level={2} variant="section">
            {cards ? cards.length : 0} cards in circulation
          </Heading>

          {!cards ? (
            <p className="text-muted-foreground">Loading cards...</p>
          ) : cards.length === 0 ? (
            <p className="text-muted-foreground">No cards available yet.</p>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {(showAllCards ? cards : cards.slice(-5)).map((card) => (
                  <Teaser
                    key={card._id}
                    href={`/card/${card.customId}`}
                    title={card.customId}
                    subtitle={card.task}
                    className="lg:aspect-10/4"
                  />
                ))}
              </div>
              {cards.length > 5 && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAllCards(!showAllCards)}
                    className="text-primary underline underline-offset-4 hover:text-primary/80"
                  >
                    {showAllCards ? "Show fewer cards" : "Show more cards"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        <div className="space-y-4">
          <Heading level={2} variant="section">
            Top Artist Suggestions
            {/* {artistSuggestions && artistSuggestions.length > 0 && `(${artistSuggestions.length})`} */}
          </Heading>

          {!artistSuggestions ? (
            <p className="text-muted-foreground">Loading artist suggestions...</p>
          ) : artistSuggestions.length === 0 ? (
            <p className="text-muted-foreground">No artist suggestions yet. Be the first to suggest one!</p>
          ) : (
            <div className="flex flex-col gap-2">
              {artistSuggestions.map((artist, index) => (
                <Teaser
                  key={artist.name}
                  title={artist.name}
                  badge={`${artist.count} ${artist.count === 1 ? "suggestion" : "suggestions"}`}
                  subtitle={`#${index + 1} most suggested`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
