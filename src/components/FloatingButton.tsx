import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface FloatingButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "lg" | "default" | "xs" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";
  "aria-label"?: string;
}

export function FloatingButton({
  children,
  onClick,
  className = "",
  size = "lg",
  "aria-label": ariaLabel,
}: FloatingButtonProps) {
  return (
    <Button
      size={size}
      onClick={onClick}
      className={`fixed bottom-16 left-1/2 z-50 -translate-x-1/2 rounded-full px-8 py-6 text-md shadow-lg ${className}`}
      aria-label={ariaLabel}
    >
      {children}
    </Button>
  );
}
