import { AiRecommendationsButton } from './AiRecommendationsButton'
import type { Recommendation } from '../types/recommendation'

interface PageTitleBarProps {
  workflowName: string
  workflowDescription: string
  recommendations: Recommendation[]
  onAccept: (id: string) => void
  onReject: (id: string) => void
  onSaveEdit: (id: string, text: string) => void
  justDetected?: Recommendation | null
  onDismissDetected?: () => void
  lastDismissed?: { item: Recommendation; index: number } | null
  onUndoDismiss?: () => void
  onClearDismissed?: () => void
}

export function PageTitleBar({
  workflowName,
  workflowDescription,
  recommendations,
  onAccept,
  onReject,
  onSaveEdit,
  justDetected,
  onDismissDetected,
  lastDismissed,
  onUndoDismiss,
  onClearDismissed,
}: PageTitleBarProps) {
  return (
    <div className="flex w-full shrink-0 items-start justify-between border-b border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] px-[32px] py-[24px]">
      <div className="flex max-w-[640px] flex-1 flex-col items-start gap-[8px]">
        <p className="w-full text-[20px] font-semibold leading-[30px] text-[var(--color-text-primary)]">
          {workflowName}
        </p>
        <p className="w-full text-[16px] leading-[24px] text-[var(--color-text-tertiary)]">
          {workflowDescription}
        </p>
      </div>

      <div className="flex shrink-0 items-start">
        <AiRecommendationsButton
          recommendations={recommendations}
          onAccept={onAccept}
          onReject={onReject}
          onSaveEdit={onSaveEdit}
          justDetected={justDetected}
          onDismissDetected={onDismissDetected}
          lastDismissed={lastDismissed}
          onUndoDismiss={onUndoDismiss}
          onClearDismissed={onClearDismissed}
        />
      </div>
    </div>
  )
}
