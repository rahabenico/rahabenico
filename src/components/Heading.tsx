import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { cn } from "@/lib/utils";

const headingVariants = cva("", {
  variants: {
    level: {
      1: "text-3xl",
      2: "text-2xl",
      3: "text-xl",
      4: "text-lg",
      5: "text-base",
      6: "text-sm",
    },
    variant: {
      default: "",
      main: "mb-2 font-bold font-headline",
      section: "font-headline font-semibold",
    },
  },
  defaultVariants: {
    level: 1,
    variant: "default",
  },
});

export interface HeadingProps extends VariantProps<typeof headingVariants> {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
}

export function Heading({ level, variant, className, children }: HeadingProps) {
  const Component = `h${level}` as keyof React.JSX.IntrinsicElements;

  return <Component className={cn(headingVariants({ level, variant }), className)}>{children}</Component>;
}
