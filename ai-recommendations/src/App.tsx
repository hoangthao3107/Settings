import { useState } from 'react'
import { Header } from './components/Header'
import { HistorySidebar } from './components/HistorySidebar'
import { Navigation } from './components/Navigation'
import { WorkflowInputPage } from './components/WorkflowInputPage'
import { WorkflowSwitcher } from './components/WorkflowSwitcher'
import { WORKFLOWS } from './data/workflows'

function App() {
  const [workflowName, setWorkflowName] = useState(WORKFLOWS[0].name)
  const workflow = WORKFLOWS.find((w) => w.name === workflowName) ?? WORKFLOWS[0]

  return (
    <div className="flex h-svh w-full items-start bg-[var(--color-bg-primary)]">
      <Navigation />

      <div className="flex h-full flex-1 flex-col items-start">
        <Header workflowName={workflow.name} />
        <WorkflowSwitcher
          workflows={WORKFLOWS}
          selected={workflow.name}
          onSelect={setWorkflowName}
        />

        <div className="flex h-0 w-full flex-1 items-start">
          <HistorySidebar />
          <WorkflowInputPage key={workflow.name} workflow={workflow} />
        </div>
      </div>
    </div>
  )
}

export default App
