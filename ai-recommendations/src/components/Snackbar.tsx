import { useEffect } from 'react'

interface SnackbarProps {
  message: string
  actionLabel?: string
  onAction?: () => void
  onDismiss: () => void
  durationMs?: number
}

export function Snackbar({
  message,
  actionLabel,
  onAction,
  onDismiss,
  durationMs = 5000,
}: SnackbarProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, durationMs)
    return () => clearTimeout(timer)
  }, [onDismiss, durationMs])

  return (
    <div className="fixed bottom-[24px] left-1/2 z-[60] flex -translate-x-1/2 items-center gap-[16px] rounded-[8px] bg-[#1b1d1d] px-[16px] py-[12px] shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.16)]">
      <p className="text-[14px] leading-[20px] text-white">{message}</p>
      {actionLabel && (
        <button
          type="button"
          onClick={() => {
            onAction?.()
            onDismiss()
          }}
          className="shrink-0 text-[14px] font-semibold leading-[20px] text-[#c7bfff] hover:underline"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
