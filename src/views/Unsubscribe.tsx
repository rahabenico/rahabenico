import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { LoadingBar } from "@/components/ui/spinner";
import { useCardData } from "@/lib/hooks/useCardData";
import { api } from "../../convex/_generated/api";

function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email");
  const cardCustomId = searchParams.get("cardId");

  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unsubscribeFromCard = useMutation(api.subscribers.unsubscribeFromCard);
  const { card, isLoading: cardLoading } = useCardData(cardCustomId || undefined);

  useEffect(() => {
    if (!email || !cardCustomId) {
      setError("Missing email or card ID parameters");
    }
  }, [email, cardCustomId]);

  const handleUnsubscribe = async () => {
    if (!email || !card) {
      setError("Missing required information");
      return;
    }

    setIsUnsubscribing(true);
    setError(null);

    try {
      await unsubscribeFromCard({
        cardId: card._id,
        email: email,
      });
      setIsUnsubscribed(true);
    } catch (err) {
      console.error("Error unsubscribing:", err);
      setError(err instanceof Error ? err.message : "Failed to unsubscribe. Please try again.");
      setIsUnsubscribing(false);
    }
  };

  if (cardLoading) {
    return (
      <>
        <LoadingBar isLoading={true} />
        <div>Loading...</div>
      </>
    );
  }

  if (!email || !cardCustomId) {
    return (
      <>
        <Header />
        <div className="container mx-auto flex max-w-4xl flex-col gap-6 p-6 md:gap-8 md:p-12">
          <div className="rounded-2xl bg-red-50 p-8 text-center">
            <h1 className="mb-4 font-bold font-headline text-2xl text-red-900">Invalid Unsubscribe Link</h1>
            <p className="text-red-700">The unsubscribe link is missing required parameters.</p>
          </div>
        </div>
      </>
    );
  }

  if (!card) {
    return (
      <>
        <Header />
        <div className="container mx-auto flex max-w-4xl flex-col gap-6 p-6 md:gap-8 md:p-12">
          <div className="rounded-2xl bg-red-50 p-8 text-center">
            <h1 className="mb-4 font-bold font-headline text-2xl text-red-900">Card Not Found</h1>
            <p className="text-red-700">The card associated with this unsubscribe link could not be found.</p>
          </div>
        </div>
      </>
    );
  }

  if (isUnsubscribed) {
    return (
      <>
        <Header />
        <div className="container mx-auto flex max-w-4xl flex-col gap-6 p-6 md:gap-8 md:p-12">
          <div className="rounded-2xl bg-green-50 p-8 text-center">
            <h1 className="mb-4 font-bold font-headline text-2xl text-green-900">Successfully Unsubscribed</h1>
            <p className="mb-6 text-green-700">
              You have been successfully unsubscribed from notifications for card "{cardCustomId}".
            </p>
            <p className="mb-4 text-green-600 text-sm">
              You will no longer receive email notifications when new entries are added to this card.
            </p>
            <Button onClick={() => navigate(`/card/${cardCustomId}`)} variant="outline">
              View Card
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto flex max-w-4xl flex-col gap-6 p-6 md:gap-8 md:p-12">
        <div className="rounded-2xl bg-gray-50 p-8 text-center">
          <h1 className="mb-4 font-bold font-headline text-2xl">Unsubscribe from Notifications</h1>
          <p className="mb-2 text-gray-700">
            You are about to unsubscribe <strong>{email}</strong> from notifications for card "{cardCustomId}".
          </p>
          <p className="mb-6 text-sm text-gray-600">
            You will no longer receive email notifications when new entries are added to this card.
          </p>

          {error && <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">{error}</div>}

          <div className="flex justify-center gap-4">
            <Button onClick={handleUnsubscribe} disabled={isUnsubscribing} variant="destructive">
              {isUnsubscribing ? "Unsubscribing..." : "Unsubscribe"}
            </Button>
            <Button onClick={() => navigate(`/card/${cardCustomId}`)} variant="outline" disabled={isUnsubscribing}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Unsubscribe;
