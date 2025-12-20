import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const rpgButtonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-body font-medium tracking-wide transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-border bg-card text-foreground hover:bg-secondary hover:border-primary/30",
        primary:
          "border border-primary/50 bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary",
        accent:
          "border border-accent/50 bg-accent/10 text-accent hover:bg-accent/20 hover:border-accent",
        ghost:
          "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
        destructive:
          "border border-destructive/50 bg-destructive/10 text-destructive hover:bg-destructive/20",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-secondary",
      },
      size: {
        default: "h-10 px-5 py-2 text-sm",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface RpgButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof rpgButtonVariants> {
  asChild?: boolean;
}

const RpgButton = React.forwardRef<HTMLButtonElement, RpgButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(rpgButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
RpgButton.displayName = "RpgButton";

export { RpgButton, rpgButtonVariants };
