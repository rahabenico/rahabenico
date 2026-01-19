import { useState } from "react";
import { useParams } from "react-router-dom";
import { EntryCard } from "@/components/EntryCard";
import { EntryForm } from "@/components/EntryForm";
import { FloatingButton } from "@/components/FloatingButton";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LoadingBar } from "@/components/ui/spinner";
import { useCardData } from "@/lib/hooks/useCardData";
import { useCardState } from "@/lib/hooks/useCardState";

function CardView() {
  const { id } = useParams<{ id: string }>();
  const [isOpen, setIsOpen] = useState(false);

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
    <div className="container mx-auto flex max-w-4xl flex-col gap-6 p-6 md:gap-8 md:p-12">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="mb-2 font-bold font-headline text-3xl">{id}</h1>
        <p className="text-md">"{card.task}"</p>
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
  );
}

export default CardView;
