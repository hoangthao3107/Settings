import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

// ── Figma source: Outmarket • Brand Guideline — Icon Button component set ─────
//
// Sizes     md = 40×40px | sm = 32×32px
// Border    true (1px #e7ebee border) | false (bare, no visible container)
// States    enabled → hovered → active (pressed) → disabled
// Icon size 20px @ md | 16px @ sm
// Tooltip   built-in dark tooltip on hover (optional but recommended for a11y)
//
// Token mapping (Color Primitives)
//   Default icon:         #525965  (Gray/700)
//   Hover bg:             #f2f4f7  (Gray/200)
//   Active bg:            #eae7fe  (Accent/200)
//   Active icon:          #6a56f0  (Accent/500)
//   Border default:       #e7ebee  (Gray/300)
//   Border disabled:      #f2f4f7  (Gray/100) — lighter when inactive
//   Disabled icon:        #d0d5dd  (Gray/400)
//   Focus ring:           0 0 0 4px rgba(106,86,240,0.14)
//   Tooltip bg:           #343839  (Gray/800)
// ─────────────────────────────────────────────────────────────────────────────

const iconButtonVariants = cva(
  [
    // Layout — square, centered
    "inline-flex items-center justify-center shrink-0",
    // Radius — --radius-md = 8px
    "rounded-[8px]",
    // Transition
    "transition-colors duration-100",
    // Focus ring — matches Button focus pattern
    "focus-visible:outline-none",
    "focus-visible:bg-[#eae7fe] focus-visible:shadow-[0_0_0_4px_rgba(106,86,240,0.14)] focus-visible:text-[#6a56f0]",
    // Disabled
    "disabled:pointer-events-none",
    // Pointer events off for SVG so clicks always hit the button
    "[&>svg]:pointer-events-none",
    // Tint icon via CSS custom property inheritance: set --fill-0 / --stroke-0 on the
    // button element itself so they cascade into SVG paths naturally.
    // fill-based:   fill="var(--fill-0, #343839)"    → picks up --fill-0
    // stroke-based: stroke="var(--stroke-0, #343839)" → picks up --stroke-0
    "[--fill-0:currentColor] [--stroke-0:currentColor]",
  ].join(" "),
  {
    variants: {
      // ── Border ─────────────────────────────────────────────────────────────
      border: {
        // Colors/Icon/Default/Default = Gray/800 #343839
        true: [
          "border border-[#e7ebee] text-[#343839]",
          "hover:bg-[#f2f4f7]",
          // Active: purple tint bg + icon, border becomes transparent
          "active:bg-[#eae7fe] active:text-[#6a56f0] active:border-transparent",
          // Colors/Icon/Default/Disabled = Gray/400 #d0d5dd
          "disabled:bg-transparent disabled:border-[#f2f4f7] disabled:text-[#d0d5dd]",
        ].join(" "),
        false: [
          "bg-transparent text-[#343839]",
          "hover:bg-[#f2f4f7]",
          "active:bg-[#eae7fe] active:text-[#6a56f0]",
          // Colors/Icon/Default/Disabled = Gray/400 #d0d5dd
          "disabled:bg-transparent disabled:text-[#d0d5dd]",
        ].join(" "),
      },

      // ── Size ───────────────────────────────────────────────────────────────
      size: {
        // md = 40×40px, icon 16px (SVGs are edge-to-edge 20×20 viewBox; 16px gives correct visual weight)
        md: [
          "size-10",
          "[&>svg]:size-4 [&>svg]:shrink-0",
          "[&>img]:size-4 [&>img]:shrink-0",
        ].join(" "),
        // Figma sm = 32×32px, icon 16px
        sm: [
          "size-8",
          "[&>svg]:size-4 [&>svg]:shrink-0",
          "[&>img]:size-4 [&>img]:shrink-0",
        ].join(" "),
      },
    },
    defaultVariants: {
      border: false,
      size: "md",
    },
  }
)

export type IconButtonSize = "md" | "sm"

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Size: md = 40×40px (default) | sm = 32×32px */
  size?: IconButtonSize
  /** Show a 1px border around the button (use on white/light surfaces) */
  border?: boolean
  /**
   * Tooltip label shown on hover.
   * Also doubles as aria-label when no explicit aria-label is provided —
   * always pass this for icon-only buttons to satisfy accessibility.
   */
  tooltip?: string
  /** Render as a child element (e.g. <a>) using Radix Slot */
  asChild?: boolean
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { className, size = "md", border = false, tooltip, asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"

    const button = (
      <Comp
        className={cn(iconButtonVariants({ border, size, className }))}
        ref={ref}
        // Use tooltip as aria-label fallback so icon-only buttons stay accessible
        aria-label={props["aria-label"] ?? tooltip}
        {...props}
      />
    )

    if (!tooltip) return button

    return (
      <TooltipPrimitive.Provider delayDuration={300}>
        <TooltipPrimitive.Root>
          <TooltipPrimitive.Trigger asChild>{button}</TooltipPrimitive.Trigger>
          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
              sideOffset={6}
              className={[
                "z-50 px-2 py-1 rounded-[4px]",
                "bg-[#343839] text-white text-[12px] font-medium leading-4",
                "drop-shadow-[0px_2px_4px_rgba(0,0,0,0.1)]",
                "animate-in fade-in-0 zoom-in-95",
                "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
              ].join(" ")}
            >
              {tooltip}
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
      </TooltipPrimitive.Provider>
    )
  }
)
IconButton.displayName = "IconButton"

export { IconButton, iconButtonVariants }
