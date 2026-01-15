import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <div
      className={cn(
        "rounded-full border-black px-2.5 py-1.5 font-bold text-xs",
        {
          "bg-black/8": variant === "default",
          "border-gray-300 bg-white text-gray-700": variant === "secondary",
        },
        className
      )}
    >
      {children}
    </div>
  );
}
