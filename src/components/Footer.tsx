import { Instagram } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function Footer() {
  return (
    <footer className="fixed right-0 bottom-0 left-0 border-gray-200 border-t bg-white py-3 dark:border-gray-800 dark:bg-gray-950">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="flex items-center justify-center">
          <a
            href="https://www.instagram.com/rahabenico?utm_source=qr&igsh=cjlvZXZlcnMzNXBh"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary hover:text-primary/80"
          >
            <HugeiconsIcon icon={Instagram} className="h-5 w-5" />
            Follow us on Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
