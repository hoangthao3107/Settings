import { Upload } from 'lucide-react'

export function FileUploadCard() {
  return (
    <div className="w-full rounded-[16px] border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] p-[24px]">
      <div className="flex w-full flex-col items-center gap-[16px] rounded-[8px] border border-dashed border-[var(--color-border-strong)] p-[24px]">
        <div className="flex size-[40px] items-center justify-center rounded-[20px] bg-[var(--color-bg-muted)]">
          <Upload size={20} className="text-[var(--color-text-tertiary)]" />
        </div>
        <div className="flex w-full max-w-[560px] flex-col items-center gap-[8px]">
          <p className="text-[18px] font-semibold leading-[28px] text-[var(--color-text-secondary)]">
            Upload Quotes
          </p>
          <p className="text-center text-[14px] leading-[20px] text-[var(--color-text-tertiary)]">
            Upload insurance quotes or supporting documents
          </p>
          <p className="text-center text-[12px] leading-[16px] text-[var(--color-text-tertiary)]">
            Note: Files uploaded here are automatically saved to your Vault under My Assets &gt;
            Workflows folders for easy access later.
          </p>
        </div>
        <div className="flex w-full items-center gap-[8px]">
          <div className="h-px flex-1 bg-[var(--color-border-primary)]" />
          <p className="text-[12px] leading-[16px] text-[var(--color-text-quaternary)]">OR</p>
          <div className="h-px flex-1 bg-[var(--color-border-primary)]" />
        </div>
        <button
          type="button"
          className="flex h-[40px] items-center justify-center rounded-[8px] border border-[var(--color-border-strong)] bg-[var(--color-bg-primary)] px-[16px] text-[14px] font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-muted)]"
        >
          Select from Vault
        </button>
      </div>
    </div>
  )
}
