import { CircleArrowLeft02Icon, FavouriteCircleIcon, Mail01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";

interface HeaderProps {
  showSupportLink?: boolean;
  showBackButton?: boolean;
}

export function Header({ showSupportLink = true, showBackButton = true }: HeaderProps) {
  return (
    <div className="border-gray-200 border-b">
      <div className="container mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        {showBackButton && (
          <Link
            to="/"
            className="flex items-center gap-2 text-primary text-xs hover:text-primary/80 md:text-sm lg:text-base"
          >
            <HugeiconsIcon icon={CircleArrowLeft02Icon} className="size-4 lg:size-5" />
            Main Page
          </Link>
        )}
        <Link
          to="/contact"
          className="flex items-center gap-2 text-primary text-xs hover:text-primary/80 md:text-sm lg:text-base"
        >
          <HugeiconsIcon icon={Mail01Icon} className="size-4 lg:size-5" />
          Contact us
        </Link>

        {showSupportLink && (
          <Link
            to="/support"
            className="flex items-center gap-2 text-primary text-xs hover:text-primary/80 md:text-sm lg:text-base"
          >
            <HugeiconsIcon icon={FavouriteCircleIcon} className="size-4 md:size-5" />
            Support us
          </Link>
        )}
      </div>
    </div>
  );
}
