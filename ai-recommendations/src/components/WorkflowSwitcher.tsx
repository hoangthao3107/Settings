import { cn } from '../lib/utils'
import type { WorkflowConfig } from '../data/workflows'

interface WorkflowSwitcherProps {
  workflows: WorkflowConfig[]
  selected: string
  onSelect: (name: string) => void
}

export function WorkflowSwitcher({ workflows, selected, onSelect }: WorkflowSwitcherProps) {
  return (
    <div className="flex w-full shrink-0 items-center gap-[8px] border-b border-[var(--color-border-primary)] bg-[var(--color-bg-accent-subtle)] px-[32px] py-[8px]">
      <span className="text-[12px] font-medium text-[var(--color-text-tertiary)]">
        Demo — preview as workflow:
      </span>
      {workflows.map((workflow) => (
        <button
          key={workflow.name}
          type="button"
          onClick={() => onSelect(workflow.name)}
          className={cn(
            'rounded-[6px] px-[10px] py-[4px] text-[12px] font-medium transition-colors',
            workflow.name === selected
              ? 'bg-[var(--color-bg-accent-solid)] text-[var(--color-text-on-interactive)]'
              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)]',
          )}
        >
          {workflow.name}
        </button>
      ))}
    </div>
  )
}
