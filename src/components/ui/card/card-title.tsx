import type * as React from "react";

import { cn } from "@/lib/utils";

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("font-medium text-base leading-snug group-data-[size=sm]/card:text-sm", className)}
      {...props}
    />
  );
}

export { CardTitle };
