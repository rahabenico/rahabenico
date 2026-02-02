import { MessageCircle, Send, X } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { formatDisplayDate } from "@/lib/utils/formatDate";
import { api } from "../../convex/_generated/api";

export function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useLocalStorage<string>("chatUsername", "");
  const [usernameInput, setUsernameInput] = useState(username);
  const [messageInput, setMessageInput] = useState("");
  const [hasUsername, setHasUsername] = useState(!!username);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = useQuery(api.chat.getMessages);
  const sendMessageMutation = useMutation(api.chat.sendMessage);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSetUsername = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUsername = usernameInput.trim();
    if (trimmedUsername) {
      setUsername(trimmedUsername);
      setUsernameInput(trimmedUsername);
      setHasUsername(true);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = messageInput.trim();
    if (trimmedMessage && username) {
      try {
        await sendMessageMutation({
          username,
          content: trimmedMessage,
          timestamp: Date.now(),
        });
        setMessageInput("");
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  const handleChangeUsername = () => {
    setHasUsername(false);
    setUsernameInput(username);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed right-6 bottom-20 z-40 rounded-full px-6 py-3 shadow-lg"
        aria-label="Open chat"
      >
        <HugeiconsIcon icon={MessageCircle} className="mr-2 h-5 w-5" />
        Chat
      </Button>

      {/* Chat Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="flex flex-col gap-4 p-0">
          <SheetHeader className="border-gray-200 border-b px-6 pt-6 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <SheetTitle>Global Chat</SheetTitle>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Close chat"
              >
                <HugeiconsIcon icon={X} className="h-5 w-5" />
              </button>
            </div>
          </SheetHeader>

          {!hasUsername ? (
            /* Username Setup Form */
            <div className="flex flex-1 flex-col justify-center px-6 py-8">
              <form onSubmit={handleSetUsername} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="username" className="mb-2 block font-medium text-sm">
                    Enter your username to chat
                  </label>
                  <Input
                    id="username"
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Your name"
                    autoFocus
                  />
                </div>
                <Button type="submit" disabled={!usernameInput.trim()}>
                  Start Chatting
                </Button>
              </form>
            </div>
          ) : (
            /* Chat View */
            <>
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto px-6">
                <div className="flex flex-col gap-4 py-4">
                  {!messages || messages.length === 0 ? (
                    <div className="flex items-center justify-center py-8 text-center text-gray-500">
                      <p>No messages yet. Be the first to say something!</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg._id} className="flex flex-col gap-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold text-sm">{msg.username}</span>
                          <span className="text-gray-500 text-xs dark:text-gray-400">
                            {formatDisplayDate(msg.timestamp)}
                          </span>
                        </div>
                        <p className="wrap-break-word text-gray-800 text-sm dark:text-gray-200">{msg.content}</p>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <div className="border-gray-200 border-t px-6 py-4 dark:border-gray-800">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-medium text-gray-600 text-xs dark:text-gray-400">Chatting as: {username}</span>
                  <button type="button" onClick={handleChangeUsername} className="text-primary text-xs hover:underline">
                    Change
                  </button>
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    autoFocus
                  />
                  <Button type="submit" size="icon" disabled={!messageInput.trim()} className="shrink-0">
                    <HugeiconsIcon icon={Send} className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
