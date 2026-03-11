import { File01Icon, PaintBoardIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "convex/react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import RahabenicoLogo from "@/assets/rahabenico.svg";
import { Heading } from "@/components/Heading";
import { Header } from "@/components/header";
import { SpotifyModal } from "@/components/SpotifyModal";
import { Teaser } from "@/components/Teaser";
import { LoadingBar } from "@/components/ui/spinner";
import { api } from "../../convex/_generated/api";

function Home() {
  const [showAllCards, setShowAllCards] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<{ name: string; spotifyId: string } | null>(null);
  const cards = useQuery(api.cardEntries.getAllCards);
  const artistSuggestions = useQuery(api.cardEntries.getAllArtistSuggestions);

  // Sort cards by entryCount (high to low), but always put "Kiwi-schnippelt-Rettich" last
  const sortedCards = useMemo(() => {
    if (!cards) return null;
    const dummyCardId = "Kiwi-schnippelt-Rettich";
    const regularCards = cards.filter((card) => card.customId !== dummyCardId);
    const dummyCard = cards.find((card) => card.customId === dummyCardId);

    // Sort regular cards by entryCount (high to low)
    const sortedRegularCards = [...regularCards].sort((a, b) => (b.entryCount || 0) - (a.entryCount || 0));

    // Always put dummy card at the end
    return dummyCard ? [...sortedRegularCards, dummyCard] : sortedRegularCards;
  }, [cards]);

  const isLoading = !cards || !artistSuggestions;

  return (
    <>
      <LoadingBar isLoading={isLoading} />
      <Header showSupportLink={true} showBackButton={false} />
      <div className="container mx-auto max-w-4xl space-y-12 px-4 pt-8 pb-18 md:pt-12 md:pb-24">
        <div className="flex flex-col items-center gap-6">
          <div className="flex justify-center">
            <img src={RahabenicoLogo} alt="Rahabenico Logo" className="size-14" />
          </div>
          <div className="flex flex-col space-y-4 text-center">
            <div>
              <Heading level={1} variant="main">
                Welcome to <span className="text-primary">rahabenico</span>
              </Heading>
              <Heading level={2}>
                <span className="text-[#7E20D1]">Ra</span>ve <span className="text-[#7E20D1]">ha</span>rd.{" "}
                <span className="text-[#7E20D1]">Be</span> <span className="text-[#7E20D1]">ni</span>ce.{" "}
                <span className="text-[#7E20D1]">Co</span>nnect.
              </Heading>
            </div>
            <div className="flex max-w-xl flex-col gap-3 text-pretty">
              <p>We want to enhance the social atmosphere of Raves.</p>
              <p>In a playful and appreciative way we connect nice people.</p>
              <p className="mt-4 inline-block animate-dance text-primary">Keep on dancing!</p>
            </div>
          </div>
        </div>
        <div className="space-y-4 text-center">
          <Heading level={2} variant="section">
            {cards ? cards.length : 0} cards in circulation
          </Heading>

          <div className="flex justify-center">
            <Link
              to="/gallery"
              className="flex items-center gap-2 text-md text-primary text-xs hover:text-primary/80 md:text-sm lg:text-base"
            >
              <HugeiconsIcon icon={PaintBoardIcon} className="size-4 lg:size-5" />
              Artwork gallery
            </Link>
          </div>

          {!sortedCards ? (
            <p className="text-muted-foreground">Loading cards...</p>
          ) : sortedCards.length === 0 ? (
            <p className="text-muted-foreground">No cards available yet.</p>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {(showAllCards ? sortedCards : sortedCards.slice(0, 3)).map((card) => (
                  <Teaser
                    key={card._id}
                    href={`/card/${card.customId}`}
                    title={card.customId}
                    subtitle={card.task}
                    frontImageUrl={card.frontImageUrl}
                    backImageUrl={card.backImageUrl}
                    badge={`${card.entryCount || 0} ${(card.entryCount || 0) === 1 ? "entry" : "entries"}`}
                  />
                ))}
              </div>
              {sortedCards.length > 5 && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAllCards(!showAllCards)}
                    className="text-primary underline-offset-4 hover:text-primary/80"
                  >
                    {showAllCards ? "Show fewer cards" : "Show more cards"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        <div className="space-y-4 text-center">
          <Heading level={2} variant="section">
            Artist Suggestions
            {/* {artistSuggestions && artistSuggestions.length > 0 && `(${artistSuggestions.length})`} */}
          </Heading>

          {!artistSuggestions ? (
            <p className="text-muted-foreground">Loading artist suggestions...</p>
          ) : artistSuggestions.length === 0 ? (
            <p className="text-muted-foreground">No artist suggestions yet. Be the first to suggest one!</p>
          ) : (
            <>
              <div className="flex flex-col gap-2">
                {artistSuggestions.map((artist, index) => {
                  // Debug: log artist data to console
                  if (artist.name.toLowerCase().includes("schrotthagen")) {
                    console.log("Artist data:", artist);
                  }
                  return (
                    <Teaser
                      key={artist.name}
                      title={artist.name}
                      badge={`${artist.count} ${artist.count === 1 ? "suggestion" : "suggestions"}`}
                      subtitle={`#${index + 1} most suggested`}
                      spotifyId={artist.spotifyId}
                      onClick={() => {
                        if (artist.spotifyId) {
                          setSelectedArtist({ name: artist.name, spotifyId: artist.spotifyId });
                        }
                      }}
                    />
                  );
                })}
              </div>
              {selectedArtist && (
                <SpotifyModal
                  open={!!selectedArtist}
                  onOpenChange={(open) => {
                    if (!open) {
                      setSelectedArtist(null);
                    }
                  }}
                  artistName={selectedArtist.name}
                  spotifyId={selectedArtist.spotifyId}
                />
              )}
            </>
          )}
        </div>
        <div className="flex justify-center">
          <Link
            to="/impressum"
            className="flex items-center gap-2 text-md text-primary text-xs hover:text-primary/80 md:text-sm lg:text-base"
          >
            <HugeiconsIcon icon={File01Icon} className="size-4 lg:size-5" />
            Impressum
          </Link>
        </div>
      </div>
    </>
  );
}

export default Home;
