import { Check, Pencil, X } from 'lucide-react'
import { useState } from 'react'
import { Tooltip } from './Tooltip'
import type { Recommendation } from '../types/recommendation'

interface RecommendationCardProps {
  recommendation: Recommendation
  onAccept: (id: string) => void
  onReject: (id: string) => void
  onSaveEdit: (id: string, text: string) => void
}

export function RecommendationCard({
  recommendation,
  onAccept,
  onReject,
  onSaveEdit,
}: RecommendationCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(recommendation.text)

  const startEditing = () => {
    setDraft(recommendation.text)
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setDraft(recommendation.text)
    setIsEditing(false)
  }

  const saveEditing = () => {
    const trimmed = draft.trim()
    if (trimmed.length === 0) return
    onSaveEdit(recommendation.id, trimmed)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="flex w-full flex-col items-end gap-[12px] rounded-[8px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] px-[12px] py-[16px]">
        <textarea
          autoFocus
          rows={2}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault()
              saveEditing()
            }
            if (e.key === 'Escape') cancelEditing()
          }}
          className="w-full resize-none rounded-[8px] border border-[var(--color-border-accent)] bg-[var(--color-bg-primary)] p-[12px] text-[14px] leading-[20px] text-[var(--color-text-primary)] shadow-[0px_0px_0px_3px_var(--shadow-focus-ring-brand)] outline-none"
        />
        <div className="flex items-center gap-[8px]">
          <button
            type="button"
            onClick={cancelEditing}
            className="flex h-[32px] items-center rounded-[8px] border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] px-[12px] text-[14px] font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-muted)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={saveEditing}
            disabled={draft.trim().length === 0}
            className="flex h-[32px] items-center rounded-[8px] bg-[var(--color-bg-accent-solid)] px-[12px] text-[14px] font-medium text-[var(--color-text-on-interactive)] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full items-center gap-[12px] rounded-[8px] border border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] px-[12px] py-[16px]">
      <p className="flex-1 text-[14px] leading-[20px] text-[var(--color-text-secondary)]">
        {recommendation.text}
      </p>

      <div className="flex shrink-0 items-center gap-[4px]">
        <Tooltip label="Edit">
          <button
            type="button"
            aria-label="Edit"
            onClick={startEditing}
            className="flex size-[32px] items-center justify-center rounded-[6px] border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-muted)]"
          >
            <Pencil size={16} />
          </button>
        </Tooltip>
        <Tooltip label="Dismiss">
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => onReject(recommendation.id)}
            className="flex size-[32px] items-center justify-center rounded-[6px] border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-tertiary)] hover:bg-[var(--color-error-subtle)] hover:text-[var(--color-error-solid)]"
          >
            <X size={16} />
          </button>
        </Tooltip>
        <button
          type="button"
          onClick={() => onAccept(recommendation.id)}
          className="flex h-[32px] items-center gap-[4px] rounded-[8px] border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] px-[12px] text-[14px] font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-muted)]"
        >
          <Check size={16} className="text-[var(--color-success-solid)]" />
          Accept
        </button>
      </div>
    </div>
  )
}
