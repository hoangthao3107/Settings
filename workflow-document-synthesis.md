# Workflow document handling — synthesis

Notes from reviewing the internals of Compare Plans, Cost Analysis, Bill Reconciliation, and Contribution Analysis, plus the input requirements for all seven workflows. Written to inform how documents and state should be treated once workflows live inside an account.

## 1. The headline finding

**The account is not primarily a document store. It is a state store.**

We have been arguing for the account-centric direction on the grounds of "upload once, reuse everywhere." That is true but it is the smaller half of the value. Every workflow we opened turned out to hold significant state that exists in no document and is currently discarded when the run ends:

| Workflow | State that isn't in any document |
|---|---|
| Compare Plans | The generated artifact and its chat thread |
| Cost Analysis | Contribution strategy, rate overrides, census overrides, named scenarios, baseline pairings |
| Contribution Analysis | Contribution %, pay period, ACA affordability rate, minimum employee salary, scenarios |
| Bill Reconciliation | Bill-to-census plan mapping, per-row resolution decisions |
| Census Formatter | Which carrier template (genuinely per-run, not persistent) |

Today all of this is re-entered on every run. In an account model it should persist, pre-fill, and be editable — which is a substantially stronger pitch than eliminating re-uploads, and it only becomes visible when you look inside the workflows rather than at their input screens.

## 2. Documents are not one category — they behave in at least four ways

Treating "documents" as a single concept is what produced the "new quote doesn't surface" bug. The real behaviours:

- **Current-state singletons** — census, plan design, rate sheets, contribution schedules. A new upload supersedes the old. Auto-select the latest.
- **Accumulating collections** — quotes, invoices. Each new one adds to a set rather than replacing. Needs per-item status (`new` / `reviewed`) so a satisfied category doesn't hide new arrivals.
- **Recurring periodicals** — monthly invoices. Technically a collection, but "which one" is almost always "this month's," so auto-select latest with an explicit period label.
- **Externally-supplied, per-run** — carrier census templates, BOR letter templates. Not account data at all; belongs to the submission, not the client. Should never be auto-selected and arguably shouldn't sit in the account's document list as client data.

Census Formatter contains one input from category 1 (the census) and one from category 4 (the carrier template) in the same screen, which is why a blanket "auto-select from the account" rule can't work.

## 3. Three interaction models, not one

The workflows do not share a shape, and the account UI shouldn't pretend they do.

**Artifact generators (Compare Plans).** Many documents in, one AI-written document out, with citations back to source and a chat thread for iteration. Wants breadth — more context produces a better artifact. Auto-selecting the full relevant document set (with the ability to exclude) is correct here; asking the broker to curate a minimal set is wrong. Output is a living document that must be reopenable, not a transient result.

**Scenario modellers (Cost Analysis, Contribution Analysis).** Structured tables with a plan picker, scenario tabs, and heavy per-plan configuration layered on top of extracted data ("leave blanks to use extracted data from documents"). Documents auto-select cleanly; the configuration is the thing that needs to persist per account.

**Resolution queues (Bill Reconciliation).** Row-by-row matching of two datasets with per-row disposition. Inherently recurring — runs monthly against the same client. Both the mapping and the dispositions must carry forward or the broker redoes identical work every month.

## 4. Specific findings worth acting on

**Bill Reconciliation's plan mapping should be permanent.** The Merge → Map step (matching "Bill Group: Medical, 202 enrollees" to "Census Group: Medical, 446 enrollees") is manual work redone every month for a stable property of how the carrier bills this client. Establish once per account, re-prompt only when the carrier's format changes.

**Bill Reconciliation should read Enrollment, not raw census.** Vision showed 268 on the bill vs 446 in census with 190 "Census Only" — almost certainly the census listing all employees while the bill lists only enrolled ones. The account already distinguishes roster (Census) from who's actually on a plan (Enrollment). Feeding Enrollment would remove a large share of false-positive mismatches before the broker sees them.

**Row resolutions must persist.** "Matched 181 (incl. 1 resolved)" — those dispositions are broker judgment. Without persistence, next month re-flags the same already-dispositioned people.

**Minimum Employee Annual Salary should be derived, not typed.** Contribution Analysis asks the broker to hand-enter the lowest-paid employee's salary for ACA affordability. The census has salary data. Manual entry here is a correctness risk with a wrong-answer failure mode, not a flexibility feature.

**Pay Period is an employer property, not a plan property.** Currently a per-plan dropdown in a modal; it's stable across every plan, workflow, and plan year for a given client. Belongs on the account.

**ACA Affordability Rate shouldn't be a user input.** 9.02% is a federal figure that changes annually and is identical for every client. Should be a system value keyed to plan year, with an override for edge cases.

**Compare Plans' group-splitting is a symptom the account model cures.** Fed 8 unrelated documents, it invented Group A / B / C and noted "these documents cover three unrelated employer groups; cross-group comparison is not meaningful." That's defensive recovery from unscoped input. Inside an account every document belongs to one employer by construction, so the failure mode disappears — a stronger argument for account scoping than the re-upload one.

**Cost Analysis degrades silently.** A run rendered a complete-looking comparison table of $0.00 with "1 employee · 0 dependents" rather than reporting that census matching had failed. In an account with a validated census this should be catchable before the table renders.

## 5. Open questions for the dev

- **Cost Analysis vs Contribution Analysis** share nearly all UI (sidebar, scenario tabs, plan picker, Plan Settings modal, contribution table). Are these genuinely two tools, or one tool with two output views? If the distinction can't be stated sharply, this is a consolidation opportunity of the same kind as Model Renewal & Compare.
- **Is contribution strategy ever plan-specific?** It's currently set per plan, but every observed value was uniform (80% across all tiers, all plans). If uniform is the norm, per-plan entry is repeated work and the default should be account-level with per-plan override.
- **Conflicting singletons:** if two plan rate sheets for the same plan year are uploaded, does the newer silently supersede, or does the broker confirm? Unresolved.
- **Carrier/BOR templates:** should these live in the account's document list at all, or in a separate library scoped to the brokerage rather than the client?

## 6. Copy/UI bugs noticed in passing

- "Cannot mix dentalPlan plans with visionPlan plans in one comparison" — raw code identifiers in user-facing copy, and the message renders as a floating tooltip detached from the element it describes.
- Compare Plans' sidebar note explaining that an SBC was folded into another plan's row is genuinely useful reasoning, but it's buried in a collapsed panel — worth surfacing.
