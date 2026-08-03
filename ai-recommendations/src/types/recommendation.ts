export type RecommendationType = 'instruction' | 'action'

export interface Recommendation {
  id: string
  type: RecommendationType
  text: string
}
