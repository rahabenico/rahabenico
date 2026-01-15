import { cn } from "@/lib/utils";

function Card({ className, size = "default", ...props }: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-3 overflow-hidden rounded-xl bg-card p-6 text-card-foreground text-sm",
        className
      )}
      {...props}
    />
  );
}

export { Card };
