import * as RadixTooltip from '@radix-ui/react-tooltip'

export function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <RadixTooltip.Root delayDuration={300}>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side="top"
          sideOffset={6}
          className="z-[60] rounded-[6px] bg-[#1b1d1d] px-[8px] py-[4px] text-[12px] font-medium text-white"
        >
          {label}
          <RadixTooltip.Arrow className="fill-[#1b1d1d]" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  )
}
