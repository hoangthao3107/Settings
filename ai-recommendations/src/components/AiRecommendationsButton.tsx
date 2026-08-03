import * as Popover from '@radix-ui/react-popover'
import { Lightbulb } from 'lucide-react'
import { useEffect, useState } from 'react'
import { RecommendationsListContent } from './RecommendationsListContent'
import { Snackbar } from './Snackbar'
import { cn } from '../lib/utils'
import type { Recommendation } from '../types/recommendation'

interface DismissedEntry {
  item: Recommendation
  index: number
}

interface AiRecommendationsButtonProps {
  recommendations: Recommendation[]
  onAccept: (id: string) => void
  onReject: (id: string) => void
  onSaveEdit: (id: string, text: string) => void
  /** A recommendation that was just detected, to surface a one-time discovery toast. */
  justDetected?: Recommendation | null
  onDismissDetected?: () => void
  /** The most recently dismissed item, to offer an undo toast. */
  lastDismissed?: DismissedEntry | null
  onUndoDismiss?: () => void
  onClearDismissed?: () => void
  onOpenPreferences?: () => void
}

type ToastKind = 'detected' | 'dismissed'

export function AiRecommendationsButton({
  recommendations,
  onAccept,
  onReject,
  onSaveEdit,
  justDetected,
  onDismissDetected,
  lastDismissed,
  onUndoDismiss,
  onClearDismissed,
  onOpenPreferences,
}: AiRecommendationsButtonProps) {
  const [open, setOpen] = useState(false)
  // Snackbars never stack — only one of these is shown at a time.
  const [toastKind, setToastKind] = useState<ToastKind | null>(null)

  useEffect(() => {
    if (justDetected) setToastKind('detected')
  }, [justDetected])

  useEffect(() => {
    if (lastDismissed) setToastKind('dismissed')
  }, [lastDismissed])

  const closeToast = () => {
    if (toastKind === 'detected') onDismissDetected?.()
    if (toastKind === 'dismissed') onClearDismissed?.()
    setToastKind(null)
  }

  return (
    <>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            aria-label="AI suggestions"
            className={cn(
              'relative flex size-[40px] items-center justify-center rounded-[8px] border transition-colors',
              recommendations.length > 0
                ? 'border-[var(--color-border-accent)] bg-[var(--color-bg-accent-subtle)] text-[var(--color-text-interactive)] hover:opacity-90'
                : 'border-[var(--color-border-strong)] bg-[var(--color-bg-primary)] text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-muted)]',
            )}
          >
            <Lightbulb size={18} fill={recommendations.length > 0 ? 'currentColor' : 'none'} />
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
              onAccept={onAccept}
              onReject={onReject}
              onUpdateText={onSaveEdit}
              onOpenPreferences={onOpenPreferences}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {toastKind === 'detected' && (
        <Snackbar
          message="New AI suggestion available"
          actionLabel="View"
          onAction={() => setOpen(true)}
          onDismiss={closeToast}
        />
      )}
      {toastKind === 'dismissed' && (
        <Snackbar
          message="Suggestion dismissed"
          actionLabel="Undo"
          onAction={() => onUndoDismiss?.()}
          onDismiss={closeToast}
        />
      )}
    </>
  )
}
