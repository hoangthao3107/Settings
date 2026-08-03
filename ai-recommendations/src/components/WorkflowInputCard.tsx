import * as Popover from '@radix-ui/react-popover'
import { Lightbulb } from 'lucide-react'
import { useState } from 'react'
import { RecommendationsListContent } from './RecommendationsListContent'
import type { Recommendation } from '../types/recommendation'

interface WorkflowInputCardProps {
  recommendations?: Recommendation[]
  onAccept?: (id: string) => void
  onReject?: (id: string) => void
  onSaveEdit?: (id: string, text: string) => void
}

export function WorkflowInputCard({
  recommendations = [],
  onAccept,
  onReject,
  onSaveEdit,
}: WorkflowInputCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex w-full flex-col items-start overflow-hidden rounded-[12px] border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)]">
      <div className="w-full border-b border-[var(--color-border-primary)] px-[24px] py-[16px]">
        <span className="text-[16px] font-semibold leading-[24px] text-[var(--color-text-primary)]">
          Input
        </span>
      </div>
      <div className="flex w-full flex-col items-start gap-[8px] p-[24px]">
        <div className="flex w-full items-center justify-between">
          <label className="text-[14px] font-medium leading-[20px] text-[var(--color-text-secondary)]">
            Additional Instructions (Optional)
          </label>

          {recommendations.length > 0 && (
            <Popover.Root open={open} onOpenChange={setOpen}>
              <Popover.Trigger asChild>
                <button
                  type="button"
                  aria-label="AI suggestions for this field"
                  className="flex items-center gap-[6px] rounded-full border border-[var(--color-border-accent)] bg-[var(--color-bg-accent-subtle)] px-[10px] py-[4px] text-[12px] font-medium text-[var(--color-text-interactive)] transition-colors hover:opacity-90"
                >
                  <Lightbulb size={14} fill="currentColor" />
                  {recommendations.length} suggestion{recommendations.length > 1 ? 's' : ''}
                </button>
              </Popover.Trigger>

              <Popover.Portal>
                <Popover.Content
                  align="end"
                  sideOffset={8}
                  className="z-50 w-[360px] rounded-[12px] border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] p-[16px] shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)]"
                >
                  <h2 className="mb-[2px] text-[16px] font-semibold leading-[24px] text-[var(--color-text-primary)]">
                    AI Suggestions
                  </h2>
                  <RecommendationsListContent
                    recommendations={recommendations}
                    onAccept={onAccept ?? (() => {})}
                    onReject={onReject ?? (() => {})}
                    onUpdateText={onSaveEdit ?? (() => {})}
                  />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          )}
        </div>

        <input
          type="text"
          placeholder="e.g., Summarize the key findings in a table and draft a client-ready email."
          className="w-full rounded-[8px] border border-[var(--color-border-strong)] p-[12px] text-[14px] text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-quaternary)] focus:border-[var(--color-border-accent)]"
        />
        <p className="text-[14px] leading-[20px] text-[var(--color-text-tertiary)]">
          Provide any specific instructions to guide the AI, such as what to focus on or how to
          format the results.
        </p>
      </div>
    </div>
  )
}
