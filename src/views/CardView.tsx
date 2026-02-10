import { Dialog as DialogPrimitive } from "radix-ui";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { EntryCard } from "@/components/EntryCard";
import { EntryForm } from "@/components/EntryForm";
import { FloatingButton } from "@/components/FloatingButton";
import { Header } from "@/components/header";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LoadingBar } from "@/components/ui/spinner";
import { useCardData } from "@/lib/hooks/useCardData";
import { useCardState } from "@/lib/hooks/useCardState";
import { cn } from "@/lib/utils";

function CardView() {
  const { id } = useParams<{ id: string }>();
  const [isOpen, setIsOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const { card, entries, isLoading } = useCardData(id);
  const { editMode, closeEntryWindow } = useCardState({
    id,
    editKey: card?.editKey,
  });

  const handleSuccess = () => {
    setIsOpen(false);
    closeEntryWindow();
  };

  if (!id) {
    return <div>Card ID is required</div>;
  }

  if (isLoading) {
    return (
      <>
        <LoadingBar isLoading={true} />
        <div>Loading...</div>
      </>
    );
  }

  if (!card) {
    return <div>Card not found</div>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto flex max-w-4xl flex-col gap-6 p-6 md:gap-8 md:p-12">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="mb-2 font-bold font-headline text-3xl">{id}</h1>
          {card.frontImageUrl || card.backImageUrl ? (
            <div className="mt-6 flex w-full items-center gap-4">
              {card.frontImageUrl && (
                <img
                  src={card.frontImageUrl}
                  alt={`Front of card ${id}`}
                  className="h-auto w-1/2 max-w-full flex-1 cursor-pointer rounded-lg transition-opacity hover:opacity-90"
                  onClick={() => setLightboxImage(card.frontImageUrl || null)}
                />
              )}
              {card.backImageUrl && (
                <img
                  src={card.backImageUrl}
                  alt={`Back of card ${id}`}
                  className="h-auto w-1/2 max-w-full flex-1 cursor-pointer rounded-lg transition-opacity hover:opacity-90"
                  onClick={() => setLightboxImage(card.backImageUrl || null)}
                />
              )}
            </div>
          ) : (
            <p className="text-md">"{card.task}"</p>
          )}
        </div>

        <div className="mb-8 space-y-4 text-center">
          {entries.length === 0 ? (
            <p className="rounded-2xl bg-gray-50 p-8 text-muted-foreground">No entries yet. Be the first to add one!</p>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <EntryCard key={entry._id} entry={entry} />
              ))}
            </div>
          )}
        </div>

        {editMode && (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <FloatingButton aria-label="Open form">Add entry</FloatingButton>
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetHeader>
                <SheetTitle>Add Entry</SheetTitle>
                <SheetDescription>Fill out the form below to add an entry to this card.</SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <EntryForm cardId={card._id} onSuccess={handleSuccess} />
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>

      {/* Lightbox */}
      <DialogPrimitive.Root open={lightboxImage !== null} onOpenChange={(open) => !open && setLightboxImage(null)}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay
            className="data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80 data-[state=closed]:animate-out data-[state=open]:animate-in"
            onClick={() => setLightboxImage(null)}
          />
          <DialogPrimitive.Content
            className={cn(
              "data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-50 flex h-full max-h-screen w-full max-w-[100vw] -translate-x-1/2 -translate-y-1/2 items-center justify-center p-2 outline-none data-[state=closed]:animate-out data-[state=open]:animate-in md:max-h-[90vh] md:max-w-[90vw] md:p-4"
            )}
            onClick={() => setLightboxImage(null)}
          >
            {lightboxImage && (
              <img
                src={lightboxImage}
                alt={`Card ${id} - enlarged view`}
                className="h-full max-h-full w-full max-w-full object-contain md:max-w-3xl md:rounded-lg"
                onClick={() => setLightboxImage(null)}
              />
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}

export default CardView;
