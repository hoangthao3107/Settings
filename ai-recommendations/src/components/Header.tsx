import { Bell, BookMarked, BookText, ChevronRight } from 'lucide-react'
import avatar from '../assets/brand/avatar.png'

export function Header({ workflowName }: { workflowName: string }) {
  return (
    <div className="flex h-[64px] w-full shrink-0 items-center justify-between border-b border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] px-[24px] py-[12px]">
      <div className="flex items-center gap-[4px]">
        <span className="p-[4px] text-[16px] font-medium text-[var(--color-text-quaternary)]">
          Commercial Insurance
        </span>
        <ChevronRight size={20} className="text-[var(--color-text-quaternary)]" />
        <span className="p-[4px] text-[16px] font-semibold text-[var(--color-text-secondary)]">
          {workflowName}
        </span>
      </div>

      <div className="flex items-start gap-[16px]">
        <div className="flex items-center">
          <button
            type="button"
            aria-label="Bookmarks"
            className="flex size-[40px] items-center justify-center rounded-[8px] text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-muted)]"
          >
            <BookMarked size={20} />
          </button>
          <button
            type="button"
            aria-label="Documentation"
            className="flex size-[40px] items-center justify-center rounded-[8px] text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-muted)]"
          >
            <BookText size={20} />
          </button>
          <div className="relative flex size-[40px] items-center justify-center">
            <button
              type="button"
              aria-label="Notifications"
              className="flex size-[40px] items-center justify-center rounded-[8px] text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-muted)]"
            >
              <Bell size={20} />
            </button>
            <span className="absolute right-[4px] top-[4px] size-[8px] rounded-full border-2 border-[var(--color-bg-primary)] bg-[var(--color-error-solid)]" />
          </div>
        </div>
        <img src={avatar} alt="User avatar" className="size-[40px] rounded-full object-cover" />
      </div>
    </div>
  )
}
