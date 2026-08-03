import { DisclaimerBar } from './DisclaimerBar'
import { FileUploadCard } from './FileUploadCard'
import { PageTitleBar } from './PageTitleBar'
import { WorkflowInputCard } from './WorkflowInputCard'
import { useRecommendations } from '../hooks/useRecommendations'
import type { WorkflowConfig } from '../data/workflows'

export function WorkflowInputPage({ workflow }: { workflow: WorkflowConfig }) {
  const {
    recommendations,
    accept,
    reject,
    updateText,
    justDetected,
    clearJustDetected,
    lastDismissed,
    undoDismiss,
    clearLastDismissed,
  } = useRecommendations({ seed: workflow.seedRecommendations, detectedLater: workflow.detectedLater })

  return (
    <div className="flex h-full flex-1 flex-col items-start">
      <PageTitleBar
        workflowName={workflow.name}
        workflowDescription={workflow.description}
        recommendations={recommendations}
        onAccept={accept}
        onReject={reject}
        onSaveEdit={updateText}
        justDetected={justDetected}
        onDismissDetected={clearJustDetected}
        lastDismissed={lastDismissed}
        onUndoDismiss={undoDismiss}
        onClearDismissed={clearLastDismissed}
      />

      <div className="flex w-full flex-1 flex-col items-center gap-[16px] overflow-y-auto bg-[var(--color-bg-muted)] p-[32px]">
        <div className="flex w-full max-w-[840px] flex-col items-start gap-[16px]">
          <FileUploadCard />
          <WorkflowInputCard
            recommendations={recommendations}
            onAccept={accept}
            onReject={reject}
            onSaveEdit={updateText}
          />
          <button
            type="button"
            className="flex h-[40px] items-center justify-center rounded-[8px] bg-[var(--color-bg-accent-solid)] px-[16px] text-[14px] font-medium text-[var(--color-text-on-interactive)] hover:opacity-90"
          >
            Compare
          </button>
        </div>
      </div>

      <DisclaimerBar />
    </div>
  )
}
