import { Info } from 'lucide-react'

export function DisclaimerBar() {
  return (
    <div className="flex w-full items-center justify-center gap-[8px] bg-[var(--color-bg-muted)] px-[24px] py-[12px]">
      <Info size={16} className="text-[var(--color-text-secondary)]" />
      <p className="text-[14px] leading-[20px] text-[var(--color-text-secondary)]">
        <span className="font-semibold">Disclaimer: </span>
        AI results may contain errors — please review and verify all outputs before using.
      </p>
      <button
        type="button"
        className="text-[14px] font-medium leading-[20px] text-[var(--color-text-interactive)] hover:underline"
      >
        Learn more
      </button>
    </div>
  )
}
