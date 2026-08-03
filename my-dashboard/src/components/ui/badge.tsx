import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// ── Figma source: node 303:10985 — Outmarket Badge component set ──────────────
//
// Colors  → orange | purple | blue | green | red | yellow | grey
// Variant → solid (no border) | outline (1px border)
// Sizes   → large 24px | small 20px
// Dot     → optional 6px circle prefix, inherits text color (currentColor)
//
// Typography: 12px / 500 / 16px line-height (text-xs font-medium leading-4)
// Radius: 4px (rounded-[4px])
// Padding: px-2, py-1 (large) / py-0.5 (small), gap-1

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-[4px] px-2 font-medium text-xs leading-4 whitespace-nowrap",
  {
    variants: {
      // ── color ── drives bg, text and border colour via compoundVariants ──────
      color: {
        orange: "",
        purple: "",
        blue:   "",
        green:  "",
        red:    "",
        yellow: "",
        grey:   "",
      },
      // ── variant ─────────────────────────────────────────────────────────────
      // solid:   filled background, no border
      // outline: lighter background + 1px semantic border
      variant: {
        solid:   "",
        outline: "border",
      },
      // ── size ────────────────────────────────────────────────────────────────
      // large = 24px total height (py-1  = 4px × 2 + 16px line)
      // small = 20px total height (py-0.5 = 2px × 2 + 16px line)
      size: {
        large: "py-1",
        small: "py-0.5",
      },
    },

    // ── compound variants — one per color × variant combo ────────────────────
    compoundVariants: [
      // Orange
      { color: "orange", variant: "solid",   className: "bg-[#ffecce] text-[#6b1814]" },
      { color: "orange", variant: "outline",  className: "bg-[#fff4eb] border-[#ffecce] text-[#b93815]" },
      // Purple
      { color: "purple", variant: "solid",   className: "bg-[#e9d7fe] text-[#53389e]" },
      { color: "purple", variant: "outline",  className: "bg-[#f6f7fe] border-[#eae7fe] text-[#6a56f0]" },
      // Blue
      { color: "blue",   variant: "solid",   className: "bg-[#d1e2ff] text-[#0d3273]" },
      { color: "blue",   variant: "outline",  className: "bg-[#eff8ff] border-[#d1e9ff] text-[#175cd3]" },
      // Green
      { color: "green",  variant: "solid",   className: "bg-[#d1fadf] text-[#054f31]" },
      { color: "green",  variant: "outline",  className: "bg-[#ecfdf3] border-[#d1fadf] text-[#027948]" },
      // Red
      { color: "red",    variant: "solid",   className: "bg-[#fcdcd9] text-[#771009]" },
      { color: "red",    variant: "outline",  className: "bg-[#fef3f2] border-[#fecdca] text-[#f04438]" },
      // Yellow
      { color: "yellow", variant: "solid",   className: "bg-[#fef9c3] text-[#854d0f]" },
      { color: "yellow", variant: "outline",  className: "bg-[#fffeeb] border-[#fedf89] text-[#b56708]" },
      // Grey
      { color: "grey",   variant: "solid",   className: "bg-[#f2f4f7] text-[#525965]" },
      { color: "grey",   variant: "outline",  className: "bg-[#f2f4f7] border-[#e7ebee] text-[#525965]" },
    ],

    defaultVariants: {
      color:   "grey",
      variant: "solid",
      size:    "large",
    },
  }
)

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof badgeVariants> {
  /** Renders a 6px filled circle before the label, inheriting the badge text colour */
  dot?: boolean
}

function Badge({
  className,
  color,
  variant,
  size,
  dot = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      data-slot="badge"
      data-color={color ?? undefined}
      data-variant={variant}
      className={cn(badgeVariants({ color, variant, size }), className)}
      {...props}
    >
      {dot && (
        <span
          aria-hidden
          className="size-1.5 rounded-full bg-current shrink-0"
        />
      )}
      {children}
    </span>
  )
}

export { Badge, badgeVariants }
