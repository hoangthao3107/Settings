# Employee benefits, explained for designers

A working primer on the domain behind Outmarket Benefits — who the users are, what they actually do, and what the terms in the UI mean.

---

## 1. Who's who

**The employer (the "group" or "client")** — a company that offers health benefits to its employees. In our product, this is an *account*. Ridgeline Manufacturing, Cascade Logistics. Employers are described by **group size**: small group (usually under 50 or 100 employees, depending on state) and large group. Group size matters because it changes which regulations apply and how carriers price the plan.

**The employee (the "member" or "enrollee")** — the person who actually gets the coverage. They may cover just themselves or add dependents.

**The carrier** — the insurance company. Anthem, Aetna, Cigna, UnitedHealthcare, Kaiser, Blue Cross Blue Shield, Guardian (dental), VSP (vision). They set the rates and pay the claims.

**The broker (our user)** — an independent advisor the employer hires to manage their benefits. The broker doesn't work for the carrier. They shop the market on the employer's behalf, negotiate, handle the paperwork, and manage the relationship year after year. They're typically paid a commission by the carrier, or a flat fee by the employer.

The broker is the person clicking around in our product. Everything we build is for them, not for the employer or the employee.

---

## 2. The money: how a benefits plan actually works

Every month, someone pays the carrier a **premium** to keep coverage active. That premium is split between the employer and the employee:

- **Employer contribution** (also called *employer subsidy*) — the share the company pays
- **Employee contribution** — the share deducted from the employee's paycheck

A typical split is the employer paying 80–100% of the employee's own coverage and much less (or nothing) toward dependents. That split is a policy decision the employer makes, and it's called the **contribution strategy**. It's one of the main levers a broker adjusts when costs go up.

**Coverage tiers** — premiums differ depending on who's covered:

- **EE** — employee only
- **EE + SP** — employee + spouse
- **EE + CH** — employee + child(ren)
- **FAM** — family

You'll see these abbreviations constantly in rate tables and bills.

**Rates** — what the carrier charges per tier per month. Two common structures:

- **Composite / tiered rates** — one price per tier, same for everyone (e.g. EE = $680/mo)
- **Age-banded rates** — priced per member based on age, so the employer's total depends on the actual ages in the census. This is why missing dates of birth matter so much.

**PEPM** — "per employee per month," a normalized cost figure used to compare plans of different sizes fairly.

---

## 3. Lines of coverage

A benefits package usually includes several separate products, each potentially from a different carrier:

- **Medical** — the big one, 80–90% of total cost
- **Dental**
- **Vision**
- Sometimes: life, disability, retirement

Each line is quoted, billed, and renewed separately. This is why the UI keeps splitting things by "line of coverage" — a client might renew with Anthem for medical while switching dental to a different carrier.

---

## 4. Plan types and what makes them different

Plan names look like alphabet soup, but they encode a few real variables:

**Network type** — which doctors are covered:

- **PPO** — broad network, can go out-of-network at higher cost. Most flexible, most expensive.
- **HMO** — narrow network, must stay in-network, usually needs a referral. Cheaper.
- **EPO** — in between: no referrals needed, but no out-of-network coverage except emergencies.
- **POS** — hybrid of HMO and PPO.

**Cost-sharing** — how the bill splits when someone actually uses care:

- **Deductible** — what the member pays before insurance starts paying. Listed as individual/family.
- **Coinsurance** — the percentage split after the deductible (e.g. 80/20 means insurance pays 80%).
- **Copay** — flat fee per visit (e.g. $30 for primary care, $55 for a specialist).
- **Out-of-pocket maximum (OOP max)** — the annual ceiling; after this, insurance pays 100%.

**HDHP / HSA** — a high-deductible health plan, which qualifies the member to open a tax-advantaged Health Savings Account. Cheaper premiums, higher deductible. You'll see "HSA" in plan names.

**Metal tiers** — Bronze, Silver, Gold, Platinum. A shorthand for how generous a plan is, based on **actuarial value** (the share of total costs the plan covers). Gold ≈ 80%, Bronze ≈ 60%.

**Funding type** — who's actually at risk for claims:

- **Fully insured** — employer pays a fixed premium, carrier takes the risk. Simple, predictable.
- **Self-funded** — employer pays claims directly and buys stop-loss insurance for catastrophes. Cheaper if the group is healthy, riskier.
- **Level funded** — a middle option, common for smaller groups.

---

## 5. The annual cycle — this is the key mental model

Benefits work runs on a yearly loop tied to the **plan year** (often but not always the calendar year). The **effective date** is when the plan year starts — Jan 1 is most common. **Renewal** is when it ends and has to be re-decided.

Roughly 90–120 days before renewal:

1. **Renewal notice arrives.** The current carrier sends next year's rates. It's usually an increase — 8%, 15%, 26%. This is what triggers everything else.

2. **Broker decides whether to shop.** If the increase is large, they take the group to market.

3. **RFP / marketing.** The broker sends the group's census and current plan design to other carriers and asks for quotes.

4. **Quotes come back.** Each carrier proposes plans and rates. These are *alternate quotes*, versus the incumbent's *renewal quote*.

5. **Analysis.** The broker compares: what does each option cost, how do the benefits differ, what happens to employee paycheck deductions, what's the employer's total spend. This is where our Compare Plans, Cost Analysis, and Contribution Analysis tools live.

6. **Proposal.** The broker packages the recommendation into a client-facing document and presents it to the employer.

7. **Decision and implementation.** Employer picks. If switching carriers, a **Broker of Record (BOR) letter** is signed to establish who represents the group. Census gets submitted to the new carrier in their required format.

8. **Open enrollment.** Employees choose their plan and tier for the year.

9. **The year runs.** Monthly invoices arrive; the broker reconciles them against who's actually enrolled. Employees join, leave, get married, have babies — all of which change the bill.

Then it starts again.

---

## 6. Key documents (and why each one matters)

**Census** — the employee roster: names, dates of birth, gender, ZIP, salary, sometimes dependents. Carriers need it to price the group. DOB matters because of age-banded rates; ZIP matters because rates are regional; salary matters for ACA affordability testing.

**SBC (Summary of Benefits and Coverage)** — a standardized, legally required plan summary. Deductibles, copays, coinsurance. This is where plan attributes come from.

**Rate sheet** — what each tier costs per month.

**Contribution schedule** — how the employer splits that cost with employees.

**Invoice / bill** — the carrier's monthly charge, line by line.

**Quote / proposal** — a carrier's offer for a future plan year. Contains plan design + rates.

**Renewal notice** — the incumbent carrier's quote for next year.

**BOR letter (Broker of Record)** — a signed letter from the employer telling the carrier which broker represents them. It's how a broker wins or keeps an account.

---

## 7. Compliance terms you'll see in the UI

**ACA (Affordable Care Act)** — the federal law. Employers with 50+ full-time employees must offer coverage that's both "affordable" and provides "minimum value," or face penalties.

**Affordability threshold** — the employee's cost for self-only coverage can't exceed a set percentage of their income. This percentage is set by the IRS and **changes every year**: it was 9.02% for 2025 and rises to **9.96% for 2026**. This is why it shouldn't be a field brokers type in by hand — it's a federal constant per plan year.

**Safe harbors** — since employers don't know an employee's household income, the IRS allows three proxies:

- **Federal Poverty Line (FPL) safe harbor** — measured against the FPL ($15,650 for 2026 in the mainland US), which for 2026 works out to a maximum employee contribution of about $129.89/month
- **W-2 safe harbor** — measured against reported W-2 wages
- **Rate of pay safe harbor** — measured against hourly rate × hours

When our UI asks for "minimum employee annual salary," it's doing an FPL-style affordability check against the lowest-paid person.

**Minimum value** — the plan must cover at least 60% of expected costs.

**Participation requirement** — carriers typically require a minimum share of eligible employees to actually enroll (often 70–75%), otherwise they won't offer the plan. This is why participation rate appears on the Enrollment screen.

**Waived** — an employee who was eligible but declined coverage, usually because they're covered elsewhere. Waived employees appear on the census but not on the bill, which is a common source of reconciliation mismatches.

---

## 8. Reconciliation, and why it's messy

Every month the carrier sends a bill. It's frequently wrong, because carriers and employers fall out of sync — someone terminated in March is still billed in April, a new hire's coverage hasn't been added yet, a tier changed after a marriage.

The broker's job is to compare the bill against who should actually be enrolled and flag the differences:

- **Matched** — bill and enrollment agree
- **Bill only** — carrier is charging for someone who shouldn't be covered (usually a termination that didn't process)
- **Census only** — someone should be covered but isn't being billed
- **Tier mismatch** — billed as family, enrolled as employee-only, etc.
- **Premium mismatch** — the amount doesn't match the contracted rate

Each discrepancy is money. Catching them is one of the most concrete values a broker delivers.

---

## 9. Vocabulary quick reference

| Term | Meaning |
|---|---|
| Group | The employer / client |
| Member, enrollee | Covered employee |
| Carrier | Insurance company |
| Premium | Monthly cost of coverage |
| EE / EE+SP / EE+CH / FAM | Coverage tiers |
| PEPM | Per employee per month |
| Deductible | Paid by member before insurance pays |
| Coinsurance | Percentage split after deductible |
| Copay | Flat fee per visit |
| OOP max | Annual ceiling on member spending |
| Actuarial value | Share of costs the plan covers |
| Plan year | The 12-month coverage period |
| Effective date | First day of the plan year |
| Renewal | End of plan year; decision point |
| Rate action | The size of the renewal increase |
| Incumbent | The current carrier |
| Alternate | A competing carrier's quote |
| RFP / marketing | Taking the group out to other carriers |
| Census | Employee roster |
| SBC | Standardized plan summary |
| BOR letter | Names the broker of record |
| Fully insured / self-funded / level funded | Who bears claims risk |
| Waived | Declined coverage |
| Participation rate | Share of eligible employees enrolled |

---

## Sources

- [2026 affordability percentage for employer health coverage increases — Mercer](https://www.mercer.com/insights/law-and-policy/2026-affordability-percentage-for-employer-health-coverage-increases/)
- [The ACA Affordability Determination in 2026 — Newfront](https://www.newfront.com/blog/the-aca-affordability-determination-in-2026)
- [ACA 2026 Affordability Threshold — Businessolver](https://businessolver.com/blog/aca-2026-affordability-threshold-what-hr-benefits-leaders-need-to-know/)
