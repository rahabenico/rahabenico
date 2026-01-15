import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";

interface IconItemProps {
  icon: IconSvgElement;
  children: React.ReactNode;
  className?: string;
}

export function IconItem({ icon, children, className = "" }: IconItemProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <HugeiconsIcon icon={icon} className="mt-0.5 h-5 w-5 shrink-0 text-black" />
      {children}
    </div>
  );
}
