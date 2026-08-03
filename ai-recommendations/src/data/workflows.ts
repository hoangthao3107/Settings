import type { Recommendation } from '../types/recommendation'

export interface WorkflowConfig {
  name: string
  description: string
  seedRecommendations: Recommendation[]
  /** Optional: a recommendation "detected" shortly after mount, to demo the discovery toast. */
  detectedLater?: Recommendation
}

export const WORKFLOWS: WorkflowConfig[] = [
  {
    name: 'Compare Quotes',
    description:
      'Compare quotes across multiple providers to identify the best options for your clients, streamlining the quoting process for optimal client solutions.',
    seedRecommendations: [
      {
        id: 'cq-1',
        type: 'instruction',
        text: 'Always use red colour for column headings in tables',
      },
    ],
    detectedLater: {
      id: 'cq-2',
      type: 'action',
      text: 'Add an executive summary section to the top of the proposal',
    },
  },
  {
    name: 'Coverage Gap Analyzer',
    description:
      'Identify gaps between a client’s current coverage and their actual exposure, so you can recommend the right policy changes.',
    seedRecommendations: [
      {
        id: 'cga-1',
        type: 'instruction',
        text: 'Always flag exclusions in liability coverage sections',
      },
      {
        id: 'cga-2',
        type: 'action',
        text: 'Highlight coverage gaps exceeding $50,000 in the summary',
      },
    ],
  },
  {
    name: 'Smart Proposal Builder',
    description:
      'Generate a client-ready proposal from your analysis, formatted to match your firm’s standard presentation style.',
    seedRecommendations: [],
  },
]
