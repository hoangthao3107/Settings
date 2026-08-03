import { useEffect, useState } from 'react'
import type { Recommendation } from '../types/recommendation'

interface UseRecommendationsOptions {
  seed: Recommendation[]
  /** Optional: "detected" and appended shortly after mount, to demo the discovery toast. */
  detectedLater?: Recommendation
}

interface DismissedEntry {
  item: Recommendation
  index: number
}

export function useRecommendations({ seed, detectedLater }: UseRecommendationsOptions) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(seed)
  const [justDetected, setJustDetected] = useState<Recommendation | null>(null)
  const [lastDismissed, setLastDismissed] = useState<DismissedEntry | null>(null)

  useEffect(() => {
    if (!detectedLater) return
    const timer = setTimeout(() => {
      setRecommendations((current) => [...current, detectedLater])
      setJustDetected(detectedLater)
    }, 2500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const accept = (id: string) => {
    setRecommendations((current) => current.filter((r) => r.id !== id))
  }

  const reject = (id: string) => {
    const index = recommendations.findIndex((r) => r.id === id)
    if (index === -1) return
    setLastDismissed({ item: recommendations[index], index })
    setRecommendations((current) => current.filter((r) => r.id !== id))
  }

  const undoDismiss = () => {
    if (!lastDismissed) return
    setRecommendations((current) => {
      const next = [...current]
      next.splice(lastDismissed.index, 0, lastDismissed.item)
      return next
    })
    setLastDismissed(null)
  }

  const updateText = (id: string, text: string) => {
    setRecommendations((current) => current.map((r) => (r.id === id ? { ...r, text } : r)))
  }

  const clearJustDetected = () => setJustDetected(null)
  const clearLastDismissed = () => setLastDismissed(null)

  return {
    recommendations,
    accept,
    reject,
    updateText,
    justDetected,
    clearJustDetected,
    lastDismissed,
    undoDismiss,
    clearLastDismissed,
  }
}
