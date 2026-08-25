# Benefits Account — build guide

Reference for implementing the account-centric Benefits view. Covers the concept, the renewal stage model, and each screen in detail.

Prototype: `accounts-workspace.html`

**Scope:** this covers the accounts list and the account detail view only. The individual workflow screens (Compare Plans, Cost Analysis, Bill Reconciliation, and so on) ship as built — nothing in this document asks for changes inside them. What's described here is how the account supplies them with documents and settings, and how their state surfaces back on the account.

---

## 1. The idea

Today every Benefits workflow is stateless. The user picks a task, uploads files, gets a result, and everything is discarded. The same client's census gets re-uploaded for every task, and any judgement the broker applied along the way is lost.

This feature makes the **client account** the persistent thing. Documents, extracted data, and broker decisions live on the account. Tools read from it instead of asking every time.

**The account is a state store, not just a document store.** This is the part worth internalising, because it's where most of the value is. Looking inside the existing workflows, each one holds significant state that exists in no document:

| Workflow | State currently discarded after each run |
|---|---|
| Compare Plans | The generated artifact and its chat thread |
| Cost Analysis | Contribution strategy, rate overrides, named scenarios, baseline pairings |
| Contribution Analysis | Contribution %, pay period, ACA inputs, scenarios |
| Bill Reconciliation | Bill-to-census plan mapping, per-row resolution decisions |

Bill Reconciliation is the clearest case: it runs monthly, and today the broker redoes the same plan mapping and re-resolves the same handful of people every single month.

### Core principles

**Documents save to the account, never to the task.** A census uploaded from inside Bill Reconciliation is immediately available to Cost Analysis. Never ask twice.

**Ask narrowly, store broadly.** A tool can prompt for exactly what it's missing. Where the file lands is a separate question from where it was requested.

**Never block — guide instead.** No dead disabled buttons because a document is missing. Clicking a tool that needs a file leads to uploading that file.

**Judge the data before producing a result.** If the census didn't match, say so up front rather than rendering a confident table full of zeros.

**Derive rather than ask.** If the system can work something out — lowest salary from the census, stage from activity — it should, and show its reasoning, rather than making the broker type it.

---

## 2. Domain background

Brief orientation for anyone unfamiliar with the space.

- **Employer / group / client** — the company buying benefits. One account per client per plan year.
- **Carrier** — the insurance company (Anthem, Aetna, Guardian, VSP).
- **Broker** — our user. Independent advisor hired by the employer to manage benefits.
- **Lines of coverage** — Medical, Dental, Vision. Separately quoted, billed, and renewed, often with different carriers.
- **Coverage tiers** — EE (employee only), EE+SP (+ spouse), EE+CH (+ children), FAM (family). Rates differ per tier.
- **Contribution** — how the premium splits between employer and employee. Set by the employer, varies by line of coverage. Either a percentage of premium or a flat dollar amount (defined contribution).
- **Plan year / effective date / renewal** — the 12-month coverage period, when it starts, and when it must be re-decided.

An employer offers employees a **lineup** of plans per line — typically a rich PPO, a mid HMO, and a cheap high-deductible plan. Each employee picks one plan and one tier, locked for the plan year unless they have a qualifying life event.

---

## 3. Renewal stages

Benefits work runs on an annual loop. A broker runs 30–50 of these simultaneously, all at different points. Their daily question isn't "what's due soon" — a date alone doesn't say whether you're in trouble. It's **"am I on track?"** An account 22 days out with a proposal ready is fine; 22 days out having not received the renewal notice is a problem.

Days-to-renewal plus stage together answer that. Neither does alone.

| Stage | Means | Derived from |
|---|---|---|
| Gathering documents | Account exists but lacks what it needs | Documents incomplete |
| Awaiting renewal | Everything on file, waiting on the carrier's rates | Documents complete, no renewal notice |
| Out to market | Group sent to other carriers for competing quotes | RFP sent |
| Reviewing quotes | Quotes are in, nobody has analysed them | Quote documents received |
| Proposal ready | Analysis done, client deliverable built | Proposal created |
| Awaiting decision | Client has the proposal, hasn't chosen | Proposal sent |
| Renewed | Client decided, plan year set | Broker marks it |

**The names encode who's waiting.** "Awaiting renewal," "Out to market," and "Awaiting decision" mean the ball is in someone else's court. "Gathering documents," "Reviewing quotes," and "Proposal ready" mean it's in the broker's. That distinction is the most useful filter in their day.

**Stages are derived, not typed.** Six of seven are inferable from events the system already sees. Only `Renewed` needs the broker, because only they know the client agreed.

Avoid a manual-status model. It works in tools like Linear because there's no signal — only the engineer knows they started coding. Here there is signal. Manual status across 50 accounts goes stale within a month, and stale status is worse than none because people trust it.

A manual override should exist, but as the exception, and visibly marked as manually set.

**Known issue in the prototype:** two vocabularies coexist. Account cards use six of these stages; the orphaned `setRenewalStage()` uses an older three-stage set (`Gathering Data` / `Analyzing` / `Proposal Ready`) and targets elements no longer in the markup. Unify on the seven above, add `Renewed`, and define the list in one place rather than repeating strings.

---

## 4. Accounts list

The broker's daily triage surface. A directory that doesn't say what needs attention forces them to open every account to find out.

**Each card carries:**

- Client name and industry
- **Current stage** — see above
- **Days until renewal**, not the date. "Renewal in 22 days" beats "Renewal due Sep 1, 2026" — it removes the arithmetic when scanning 50 rows
- Employee count and annual value — proxies for how much the account matters when two are equally urgent

**Sorting** is by urgency: days-to-renewal primary, stage secondary. Colour treatment on the countdown should escalate as the date approaches.

**Deliberately not on the card:** plan year (implied by renewal date), funding type, state, group size. Those matter inside the account, not while scanning.

**Worth considering later:** a digest view that lists *actions* across all accounts rather than accounts themselves — "3 quotes waiting on Cascade," "August invoice missing for Ridgeline." This answers "what needs me today" more directly than any per-account view can, because it removes the step where the broker works out for themselves what each account needs.

---

## 5. Account detail — tabs

Seven tabs: Overview, Plans, Census, Enrollment, Contacts, Documents, Activities.

Every tab needs an empty state. A new account should look purposeful, not broken.

### 5.1 Overview

The landing view. Two sections.

**Available workflows** — the canonical launcher for all tools, carrying their state. Each tool shows one of:

| State | Meaning | Example copy |
|---|---|---|
| Ready | Has what it needs, nothing changed since last run | `Ready` |
| New input | Can run, but documents arrived that the last run didn't include | `3 new carrier quotes` |
| Missing something | Names exactly what, and clicking leads to adding it | `August invoice not yet uploaded` |

Only tools needing attention carry a visual signal. A fully-ready account should look calm.

The "new input" state is the most important and the easiest to get wrong. It's not a binary "do we have quotes" check — that's satisfied forever once the first quote lands. Each document needs its own status (`new` / `reviewed`), and each tool run must record which document versions it consumed, so the system can compare what's on the account now against what the last run saw.

New carrier quotes should light up **all three analysis tools** — Compare Plans, Cost Analysis, Contribution Analysis — since all three read plan rate data.

**Tool grouping.** Organise by the broker's two rhythms rather than by verb:

- **Renewal cycle** (annual, sequential): RFP → Compare Plans → Cost Analysis → Contribution Analysis → Create Proposal → BOR Letters
- **Ongoing service** (recurring): Bill Reconciliation, Census Formatter, Census Comparison

The sequence teaches the process without needing labels to explain it. Create Proposal sitting at the end of the renewal sequence is the guidance.

**Currently missing from the tools list:** Create Proposal and RFP. Without them the renewal journey has no ending and no beginning — you can analyse indefinitely but can't go to market or produce the client deliverable.

**Total current cost** — aggregated by line of coverage: enrolled count, employer/mo, employee/mo, total/mo, employer/yr, plus an all-lines total. Worth adding the contribution % per line here as a read-only column, since it's the question people bring to Overview.

**Empty state** — when the account has no documents, don't show seven tools each naming a different missing file; underneath they reduce to two gaps. Show one upload prompt ("Add documents to get started — everything you add stays on this account and is reused by every tool") with the tool list below, quiet and each showing what it needs (`Invoice · census`). Both paths work: upload files directly, or click a tool and it asks only for what it needs. Neither blocks.

### 5.2 Plans

The account's plan record — what this client has in force. **Reference, not analysis.** No deltas, no percentage changes, no cross-carrier mixing, no "best option" marking. Comparing options to decide is Compare Plans' job.

**Account settings bar** at the top — the only editable area on the tab:

| Field | Source | Notes |
|---|---|---|
| Contribution (default) | Employer | Starting value; customised per line below |
| Pay period | Employer | Monthly / semi-monthly / bi-weekly. Stable across all plans and years |
| Lowest annual salary | Derived from census | Used for ACA affordability. Shouldn't be hand-typed — the census has it |
| ACA affordability rate | System, keyed to plan year | IRS figure, changes annually. 9.02% for 2025, **9.96% for 2026** |

Each value should show its provenance — derived, entered, or system.

**Per line of coverage** — Medical, Dental, Vision, each with its carrier and enrolled count.

**Contribution sits per line, above that line's plans.** Employers routinely contribute differently by line — generous on medical, thinner on dental and vision — so an account-wide value can't express reality. Two models must both work:

- **Percentage** — "employer pays 80% of employee, 50% of dependent." Effective split is uniform across plans.
- **Flat dollar (defined contribution)** — "employer pays $500 per employee." Effective percentage then varies by plan and tier: $500 against a $524 EE rate is 95%, against a $1,468 family rate is 34%. In this mode the **employee cost** should be the prominent figure per plan, because that gap is what drives which plan employees pick.

**Plan lineup per line** — carrier facts, read-only, extracted from documents:

- Plan name, network type, actuarial value, enrolled count
- Benefits: deductible (ind/fam), OOP max (ind/fam), coinsurance, PCP and specialist copay, Rx tiers — each with in-network and out-of-network values. HMO and EPO plans have no out-of-network coverage, so those cells are genuinely empty rather than zero
- Monthly rates by tier, each split into total, employer share, employee share
- Which source document each plan came from

**A common use is comparing plans within a line.** Brokers explain to clients and employees why the HSA plan is cheaper than the PPO, especially at open enrolment. The lineup is a menu employees choose from, so showing 2–4 plans together is the natural shape — not scope creep. The boundary that keeps it distinct from Compare Plans: no deltas, no percentage changes, no cross-carrier mixing, no recommendation.

**Which plans appear:** those in force for this account's plan year. Determined by, in order of reliability — enrolment (if people are enrolled, it's real), effective date matching the plan year, then document type. Where a plan can't be confidently placed, don't guess: surface it and let the broker confirm. The case that will bite is a renewal quote from the incumbent with the same plan name — only the effective date separates them, and getting it wrong silently shows next year's rates as current.

**New clients** have nothing in force. Show quoted plans clearly labelled as quoted. Plan lifecycle: `quoted` → `selected` → `in force`.

### 5.3 Census

The employee roster — personal details only. Columns: employee, date of birth, hire date, department, coverage tier, status.

Data quality matters here more than anywhere else. Missing dates of birth break age-banded rating; missing salary breaks ACA affordability. Surface incomplete records prominently and make them actionable — a count that links to the affected rows, not just a number.

Contextual shortcut: Census Formatter (export to a carrier's required template).

### 5.4 Enrollment

Who is enrolled in which plan, per line of coverage. Columns: employee, enrolled plan, tier, total/mo, employer/mo, employee/mo, status.

Separate from Census deliberately: Census is the roster, Enrollment is plan assignment. An employee can be on the census and have waived coverage.

**Bill Reconciliation should read Enrollment, not raw census.** In the real tool, vision showed 268 on the bill against 446 in census with 190 "Census Only" — almost certainly the census listing all employees while the bill lists only the enrolled. Feeding Enrollment removes a large share of false-positive mismatches before the broker ever sees them.

### 5.5 Contacts

People at the client plus the servicing team. Columns: employee, title, phone, email, with a role badge (primary, finance, benefits admin, broker).

Manually created or extracted from documents. The simplest tab — no derived state, no tool dependencies.

### 5.6 Documents

Every file on the account. Always-visible drop zone, plus a list showing filename, type, and status.

**Documents behave in four distinct ways**, and treating them as one category is what causes new files to go unnoticed:

| Behaviour | Examples | Handling |
|---|---|---|
| Current-state singleton | Census, plan design, rate sheet, contribution schedule | Newest supersedes. Auto-select latest |
| Accumulating collection | Quotes | Each adds to a set. Needs per-item `new` / `reviewed` status |
| Recurring periodical | Monthly invoices | Auto-pick latest, label the period |
| Externally supplied, per-run | Carrier census templates, BOR templates | Never auto-selected. Belongs to the submission, not the client |

Status copy: `New, not yet compared` for unreviewed quotes, `Used in N actions` for consumed documents.

**After any upload, confirm what it unlocked** — "Census added. Cost Analysis and Census Formatter are now ready." This is the moment brokers learn files stick to the account rather than the task. It should also appear in Activities.

### 5.7 Activities

One chronological timeline, grouped by month. Two kinds of event with different visual weight:

**Business events (primary)** — what happened in the real world. Renewal notice received from Anthem +8.7%, RFP sent to Aetna and UnitedHealthcare, quote received from Aetna, proposal sent, plan selected, BOR letter signed.

**System events (secondary)** — what was done in the product. Compare Plans run, census uploaded, bill reconciled with variance flagged. Muted relative to business events.

Business events are what a broker means by "where are we with this account." System events are supporting detail for tracing where a number came from.

**Requirements:**

- Each system event records which documents it used, with versions. The tool-state logic depends on comparing what a run consumed against what's on the account now
- Where a run produced a reopenable output — a Compare Plans artifact, a reconciliation result — link to it. These aren't transient
- This is also what drives stage derivation

**Relationship to the global History rail:** they're different scopes. Activities is per-account, "what's happening with this client." History is cross-account, "where's that thing I was working on yesterday." Inside an account, Activities dominates and the History sidebar is redundant — keep History at app level only.

---

## 6. Connecting the proposal builder

The existing proposal builder (template selection → document input → outline preview → edit → export) should be reachable as **Create Proposal** in the tools list, launched with account context.

Critically, it should consume **analysis results**, not just raw documents. A proposal's content is the recommendation the broker just arrived at in Compare Plans or Cost Analysis. If the builder only accepts source PDFs, they re-derive the comparison by hand — exactly the waste this project exists to remove.

The builder itself doesn't need to change. It needs an entry point that knows which account it's in, and the finished proposal needs to land back on the account, in Activities, reopenable.

---

## 7. Things that should be derived or system-supplied, not typed

Currently hand-entered inside workflows, each a correctness risk:

- **Lowest employee annual salary** — the census has it. A typo produces a wrong ACA affordability determination
- **Pay period** — an employer property, stable across every plan and year. Currently a per-plan dropdown in a modal
- **ACA affordability rate** — a federal figure, identical for every client, changes annually. Currently hardcoded to 9.02%, which is wrong for 2026
- **Bill-to-census plan mapping** — stable per client. Currently redone every month
