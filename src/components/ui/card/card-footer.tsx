import * as React from "react"

import { cn } from "@/lib/utils"

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("bg-muted/50 rounded-b-xl border-t p-4 group-data-[size=sm]/card:p-3 flex items-center", className)}
      {...props}
    />
  )
}

export { CardFooter }
