import { History, Plus, Workflow } from 'lucide-react'

const HISTORY_ITEMS = [
  'Insurance Quote Analysis - CFC vs CHUBB Tech Company Coverage',
  'Policies Review - Client Portfolio Audit',
  'Smart Proposal Builder - Proposal for Henry Corporation',
  'Document Chat - Policy Amendments Q&A',
]

export function HistorySidebar() {
  return (
    <div className="flex h-full w-[280px] shrink-0 flex-col items-start overflow-hidden border-r border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] px-[16px] pb-[40px]">
      <div className="flex w-full flex-1 flex-col items-start pb-[24px]">
        <div className="flex w-full flex-col items-start py-[12px]">
          <div className="flex w-full items-center justify-between py-[4px] pl-[12px] pr-[4px]">
            <div className="flex items-center gap-[8px]">
              <History size={20} className="text-[var(--color-text-tertiary)]" />
              <span className="text-[14px] font-semibold leading-[20px] text-[var(--color-text-secondary)]">
                History
              </span>
            </div>
            <button
              type="button"
              aria-label="New session"
              className="flex size-[40px] items-center justify-center rounded-[8px] text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-muted)]"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="flex w-full items-center justify-center px-[12px] pb-[4px] pt-[8px]">
            <span className="w-full text-[12px] font-medium leading-[18px] text-[var(--color-text-tertiary)]">
              Previous 30 Days
            </span>
          </div>

          {HISTORY_ITEMS.map((item) => (
            <div
              key={item}
              className="flex w-full items-center gap-[12px] rounded-[8px] px-[12px] py-[8px] hover:bg-[var(--color-bg-secondary)]"
            >
              <div className="flex size-[36px] shrink-0 items-center justify-center rounded-[5px] bg-[var(--color-bg-accent-subtle)]">
                <Workflow size={18} className="text-[var(--color-text-interactive)]" />
              </div>
              <p className="flex-1 truncate text-[14px] leading-[20px] text-[var(--color-text-primary)]">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
