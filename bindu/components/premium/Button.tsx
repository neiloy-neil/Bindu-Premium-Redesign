import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-bindu-orange disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 rounded-sm",
  {
    variants: {
      variant: {
        default:
          "bg-bindu-navy text-bindu-white shadow hover:bg-bindu-navy/90 active:scale-[0.98]",
        destructive:
          "bg-bindu-red text-bindu-white shadow-sm hover:bg-bindu-red/90 active:scale-[0.98]",
        outline:
          "border border-bindu-border-grey bg-transparent hover:border-bindu-navy hover:bg-bindu-light-grey text-bindu-text-dark active:scale-[0.98]",
        secondary:
          "bg-bindu-light-grey text-bindu-text-dark shadow-sm hover:bg-bindu-border-grey active:scale-[0.98]",
        ghost: "hover:bg-bindu-light-grey text-bindu-text-dark",
        link: "text-bindu-navy underline-offset-4 hover:underline",
        primary: "bg-bindu-orange text-bindu-white hover:bg-[#E55F00] active:scale-[0.98] shadow-sm",
      },
      size: {
        default: "h-11 px-6 py-2 uppercase tracking-wide",
        sm: "h-9 px-4 text-xs uppercase tracking-wide",
        lg: "h-14 px-8 text-base uppercase tracking-widest",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
