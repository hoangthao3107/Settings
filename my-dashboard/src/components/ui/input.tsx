"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// ── Size variants ─────────────────────────────────────────────────────────────
//  sm  36px  px-3 py-2   text-xs  — compact: table cells, toolbars, dense forms
//  md  44px  px-3 py-3   text-sm  — default (matches Figma spec p-[12px])
//  lg  48px  px-4 py-3.5 text-base — prominent: hero forms, standalone search

const inputVariants = cva(
  [
    // Layout
    "flex w-full rounded-md",
    // Border & background — resting state
    "border border-input bg-background",
    // Typography
    "text-foreground leading-5 font-normal",
    // Smooth state transitions
    "transition-colors duration-100",
    // Placeholder
    "placeholder:text-muted-foreground",
    // Focus: accent border + subtle purple glow (no layout shift — border stays 1px)
    "focus-visible:outline-none",
    "focus-visible:border-accent",
    "focus-visible:shadow-[0_0_0_3px_rgba(106,86,240,0.14)]",
    // Error state — set aria-invalid="true" on the input from your form controller
    "aria-[invalid=true]:border-destructive",
    "aria-[invalid=true]:focus-visible:border-destructive",
    "aria-[invalid=true]:focus-visible:shadow-[0_0_0_4px_#fecdca]",
    // Disabled
    "disabled:cursor-not-allowed",
    "disabled:bg-muted disabled:text-muted-foreground disabled:border-border",
    // File input reset
    "file:border-0 file:bg-transparent file:font-medium file:text-foreground",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "h-9  px-3 py-2   text-xs",
        md: "h-11 px-3 py-3   text-sm",
        lg: "h-12 px-4 py-3.5 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

// ── Input ─────────────────────────────────────────────────────────────────────
// Pure <input> element — use this when you don't need icon slots.
// Pair with <FieldLabel>, <FieldDescription>, <FieldError> from field.tsx for
// the full label + hint + error treatment.

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size, ...props }, ref) => (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ size }), className)}
      ref={ref}
      {...props}
    />
  )
)
Input.displayName = "Input"

// ── InputField ─────────────────────────────────────────────────────────────────
// Wraps <Input> and adds optional leading / trailing icon slots.
// Icons are positioned absolutely so they don't break the input's layout.
//
// Usage:
//   <InputField leadingIcon={<Search />} placeholder="Search…" />
//   <InputField trailingIcon={<X />} size="sm" />

export interface InputFieldProps extends InputProps {
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
}

// Icon positioning by size
const ICON_OFFSET = {
  sm: { leading: "left-2.5", trailing: "right-2.5" },
  md: { leading: "left-3",   trailing: "right-3"   },
  lg: { leading: "left-3.5", trailing: "right-3.5" },
} as const

// Indent the input text so it doesn't slide under the icon
const ICON_PADDING = {
  sm: { leading: "pl-8",  trailing: "pr-8"  },
  md: { leading: "pl-9",  trailing: "pr-9"  },
  lg: { leading: "pl-10", trailing: "pr-10" },
} as const

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ leadingIcon, trailingIcon, size = "md", className, ...props }, ref) => {
    const sz = (size ?? "md") as keyof typeof ICON_OFFSET
    const { leading: leadOffset, trailing: trailOffset } = ICON_OFFSET[sz]
    const { leading: leadPad,   trailing: trailPad   } = ICON_PADDING[sz]

    const iconBase =
      "absolute top-1/2 -translate-y-1/2 flex items-center pointer-events-none " +
      "text-muted-foreground [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:pointer-events-none"

    return (
      <div data-slot="input-field" className="relative flex items-center w-full">
        {leadingIcon && (
          <span data-slot="leading-icon" className={cn(iconBase, leadOffset)}>
            {leadingIcon}
          </span>
        )}

        <Input
          ref={ref}
          size={sz}
          className={cn(
            leadingIcon  && leadPad,
            trailingIcon && trailPad,
            className
          )}
          {...props}
        />

        {trailingIcon && (
          <span data-slot="trailing-icon" className={cn(iconBase, trailOffset)}>
            {trailingIcon}
          </span>
        )}
      </div>
    )
  }
)
InputField.displayName = "InputField"

export { Input, InputField, inputVariants }
