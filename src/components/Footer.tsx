import { File01Icon, Instagram } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";
import { Chat } from "./Chat";

export function Footer() {
  return (
    <footer className="fixed right-0 bottom-0 left-0 border-gray-200 border-t bg-white py-3 dark:border-gray-800 dark:bg-gray-950">
      <div className="container mx-auto flex max-w-4xl items-center justify-between px-4">
        <div className="flex items-center justify-center gap-6">
          <a
            href="https://www.instagram.com/rahabenico?utm_source=qr&igsh=cjlvZXZlcnMzNXBh"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary text-xs hover:text-primary/80 md:text-sm lg:text-base"
          >
            <HugeiconsIcon icon={Instagram} className="size-4 lg:size-5" />
            Follow us on Instagram
          </a>
          <Link
            to="/impressum"
            className="flex items-center gap-2 text-md text-primary text-xs hover:text-primary/80 md:text-sm lg:text-base"
          >
            <HugeiconsIcon icon={File01Icon} className="size-4 lg:size-5" />
            Imprint
          </Link>
        </div>
        <Chat />
      </div>
    </footer>
  );
}
