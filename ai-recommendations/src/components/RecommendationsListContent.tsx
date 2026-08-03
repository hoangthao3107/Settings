import { RecommendationCard } from './RecommendationCard'
import type { Recommendation } from '../types/recommendation'

interface RecommendationsListContentProps {
  recommendations: Recommendation[]
  onAccept: (id: string) => void
  onReject: (id: string) => void
  onUpdateText: (id: string, text: string) => void
  onOpenPreferences?: () => void
}

function PreferencesLink({ onOpenPreferences }: { onOpenPreferences?: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpenPreferences}
      className="font-medium text-[var(--color-text-interactive)] hover:underline"
    >
      Preferences
    </button>
  )
}

export function RecommendationsListContent({
  recommendations,
  onAccept,
  onReject,
  onUpdateText,
  onOpenPreferences,
}: RecommendationsListContentProps) {
  return (
    <>
      <p className="mb-[12px] text-[13px] leading-[18px] text-[var(--color-text-tertiary)]">
        {recommendations.length > 0
          ? `${recommendations.length} suggestion${recommendations.length > 1 ? 's' : ''} based on your past edits`
          : 'No suggestions right now'}
      </p>

      {recommendations.length > 0 ? (
        <div className="flex flex-col gap-[8px]">
          {recommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              onAccept={onAccept}
              onReject={onReject}
              onSaveEdit={onUpdateText}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-[8px] bg-[var(--color-bg-secondary)] px-[12px] py-[16px] text-center text-[13px] leading-[18px] text-[var(--color-text-tertiary)]">
          We'll surface a suggestion here the next time you edit an AI result. Already accepted a
          few? Check <PreferencesLink onOpenPreferences={onOpenPreferences} />.
        </p>
      )}

      <p className="mt-[12px] text-[12px] leading-[18px] text-[var(--color-text-quaternary)]">
        Accepted suggestions move to <PreferencesLink onOpenPreferences={onOpenPreferences} /> in
        Settings.
      </p>
    </>
  )
}
