import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// ── Figma source: Outmarket • Brand Guideline — Button component set ──────────
//
// Variants  Primary | Secondary | Tertiary color | Tertiary gray
// Sizes     md = 40px h | sm = 32px h
// States    default → hover → focus → disabled
//
// Leading icon: optional on all variants (16×16px img or svg as first child)
// Trailing icons: NOT in spec — never add a trailing icon
//
// Token mapping
//   Primary bg:              #6a56f0  (--bg-accent-solid)
//   Primary bg hover:        #7c6af2
//   Primary bg disabled:     #bbbbf7  (--colors/text/disabled/interactive)
//   Primary text:            #ffffff  (--colors/text/on-interactive)
//   Secondary bg:            #ffffff  (--colors/background/bg-primary)
//   Secondary border:        #e7ebee  (--colors/border/border-primary)
//   Secondary text:          #343839  (--colors/text/secondary)
//   Secondary text disabled: #97a0b4  (--colors/text/disabled/primary)
//   Tertiary color text:     #6a56f0  (--colors/text/interactive)
//   Tertiary color disabled: #bbbbf7  (--colors/text/disabled/interactive)
//   Tertiary gray text:      #525965  (--colors/text/tertiary)
//   Tertiary gray disabled:  #97a0b4  (--colors/text/disabled/primary)
//   Focus ring:              0 0 0 4px rgba(106,86,240,0.14)
//   Border radius:           8px      (--radius-md)
// ─────────────────────────────────────────────────────────────────────────────

const buttonVariants = cva(
  [
    // Layout
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    // Radius — --radius-md = 8px
    "rounded-[8px]",
    // Typography — text-sm/medium: 14px / 500 / 20px lh
    "text-[14px] font-medium leading-5",
    // Transition
    "transition-colors duration-100",
    // Remove browser outline; each variant handles focus-visible
    "focus-visible:outline-none",
    // Disabled: no pointer events
    "disabled:pointer-events-none",
    // Icon children — always 16×16, no shrink, no pointer events on SVG
    "[&>img]:size-4 [&>img]:shrink-0",
    "[&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:pointer-events-none",
    // Tint icon to match label: Outmarket SVGs use var(--fill-0) or var(--stroke-0).
    // Setting these custom properties on the button element (not on &>svg) lets them
    // inherit into SVG paths via CSS custom property inheritance.
    // fill-based icons:   fill="var(--fill-0, #343839)"   → picks up --fill-0
    // stroke-based icons: stroke="var(--stroke-0, #343839)" → picks up --stroke-0
    "[--fill-0:currentColor] [--stroke-0:currentColor]",
  ].join(" "),
  {
    variants: {
      variant: {
        // ── Primary ─────────────────────────────────────────────────────────
        primary: [
          "bg-[#6a56f0] text-white",
          "hover:bg-[#987aff]",
          "active:bg-[#4e2eb8]",
          "focus-visible:bg-[#987aff] focus-visible:shadow-[0_0_0_4px_rgba(106,86,240,0.14)]",
          "disabled:bg-[#bbbbf7] disabled:text-white",
        ].join(" "),

        // ── Secondary ───────────────────────────────────────────────────────
        secondary: [
          "bg-white border border-[#e7ebee] text-[#343839]",
          "hover:bg-[#f9fafb]",
          "active:bg-[#f2f4f7]",
          "focus-visible:bg-[#f9fafb] focus-visible:shadow-[0_0_0_4px_rgba(106,86,240,0.14)]",
          "disabled:bg-white disabled:text-[#97a0b4] disabled:border-[#e7ebee]",
        ].join(" "),

        // ── Tertiary color ──────────────────────────────────────────────────
        "tertiary-color": [
          "bg-transparent text-[#6a56f0]",
          "hover:bg-[#f6f7fe]",
          "active:bg-[#eae7fe]",
          "focus-visible:bg-[#f6f7fe] focus-visible:shadow-[0_0_0_4px_rgba(106,86,240,0.14)]",
          "disabled:bg-transparent disabled:text-[#bbbbf7]",
        ].join(" "),

        // ── Tertiary gray ───────────────────────────────────────────────────
        "tertiary-gray": [
          "bg-transparent text-[#525965]",
          "hover:bg-[#f2f4f7]",
          "active:bg-[#e7ebee]",
          "focus-visible:bg-[#f2f4f7] focus-visible:shadow-[0_0_0_4px_rgba(106,86,240,0.14)]",
          "disabled:bg-transparent disabled:text-[#97a0b4]",
        ].join(" "),

        // ── Danger primary ──────────────────────────────────────────────────
        "danger-primary": [
          "bg-[#f04438] text-white",
          "hover:bg-[#d92d20]",
          "active:bg-[#771009]",
          "focus-visible:bg-[#d92d20] focus-visible:shadow-[0_0_0_4px_rgba(240,68,56,0.14)]",
          "disabled:bg-[#fecdca] disabled:text-white",
        ].join(" "),

        // ── Danger secondary ────────────────────────────────────────────────
        "danger-secondary": [
          "bg-white border border-[#fecdca] text-[#d92d20]",
          "hover:bg-[#fef3f2]",
          "active:bg-[#fecdca]",
          "focus-visible:bg-[#fef3f2] focus-visible:shadow-[0_0_0_4px_rgba(240,68,56,0.14)]",
          "disabled:bg-white disabled:border-[#fecdca] disabled:text-[#fecdca]",
        ].join(" "),

        // ── Danger tertiary ─────────────────────────────────────────────────
        "danger-tertiary": [
          "bg-transparent text-[#d92d20]",
          "hover:bg-[#fef3f2]",
          "active:bg-[#fecdca]",
          "focus-visible:bg-[#fef3f2] focus-visible:shadow-[0_0_0_4px_rgba(240,68,56,0.14)]",
          "disabled:bg-transparent disabled:text-[#fecdca]",
        ].join(" "),
      },

      size: {
        // Figma Medium = 40px h, 16px h-padding
        md: "h-10 px-4",
        // Figma Small  = 32px h, 12px h-padding
        sm: "h-8 px-3",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export type ButtonVariant = "primary" | "secondary" | "tertiary-color" | "tertiary-gray" | "danger-primary" | "danger-secondary" | "danger-tertiary"
export type ButtonSize = "md" | "sm"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as a child element (e.g. <a>) using Radix Slot */
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
