import { CircleArrowLeft02Icon, FavouriteCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";

interface HeaderProps {
  showSupportLink?: boolean;
}

export function Header({ showSupportLink = true }: HeaderProps) {
  return (
    <div className="border-gray-200 border-b">
      <div className="container mx-auto flex max-w-4xl items-center justify-between px-6 py-3 md:px-12">
        <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary/80">
          <HugeiconsIcon icon={CircleArrowLeft02Icon} className="h-5 w-5" />
          Main Page
        </Link>
        {showSupportLink && (
          <Link to="/support" className="flex items-center gap-2 text-primary hover:text-primary/80">
            <HugeiconsIcon icon={FavouriteCircleIcon} className="h-5 w-5" />
            Support us
          </Link>
        )}
      </div>
    </div>
  );
}
