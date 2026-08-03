import { useState, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Line = "commercial" | "benefits" | "personal-lines";

interface Workflow {
  id: string;
  name: string;
  description: string;
  line: Line;
  subCategory: string;
  iconType: string;
  tags?: string[];
}

interface HistoryEntry {
  id: string;
  title: string;
  workflowId: string;
  line: Line;
}

// ─── Line + Sub-category config ────────────────────────────────────────────────

const LINE_CONFIG: Record<Line, { label: string; color: string; bg: string }> = {
  commercial:       { label: "Commercial Insurance", color: "#6a56f0", bg: "#eae7fe" },
  benefits:         { label: "Employee Benefits",    color: "#1570ef", bg: "#d1e9ff" },
  "personal-lines": { label: "Personal Lines",       color: "#067647", bg: "#dcfae6" },
};

// Ordered sub-categories for Commercial
const COMMERCIAL_SUBCATEGORIES: { id: string; label: string }[] = [
  { id: "comparisons",      label: "Comparisons" },
  { id: "reviews",          label: "Reviews" },
  { id: "verification",     label: "Verification" },
  { id: "document-builder", label: "Document Builder" },
  { id: "ams-workflows",    label: "AMS Workflows" },
  { id: "schedules",        label: "Schedules" },
  { id: "surety-bonds",     label: "Surety Bonds" },
  { id: "risk-management",  label: "Risk Management" },
  { id: "form-fill",        label: "Form Fill" },
  { id: "custom-workflows", label: "Custom Workflows" },
];

// ─── Workflow data ─────────────────────────────────────────────────────────────

const WORKFLOWS: Workflow[] = [
  // ── Commercial > Comparisons ──
  { id: "compare-quotes",    name: "Compare Quotes",            description: "Compare quotes across multiple providers to identify the best options for your clients.", line: "commercial", subCategory: "comparisons", iconType: "compare", tags: ["quote", "comparison"] },
  { id: "compare-policies",  name: "Compare Policies",          description: "Compare expiring policy with renewal to identify changes in coverage, limits, and exclusions.", line: "commercial", subCategory: "comparisons", iconType: "policy", tags: ["policy", "renewal"] },
  { id: "contract-req",      name: "Contract Requirements",     description: "Evaluate if insurance policies meet the coverage requirements of a customer contract.", line: "commercial", subCategory: "comparisons", iconType: "contract", tags: ["contract", "requirements"] },
  { id: "compare-template",  name: "Compare Quotes in Template",description: "Compare multiple quotes side-by-side using a standardized template for faster decisions.", line: "commercial", subCategory: "comparisons", iconType: "compare", tags: ["template", "quote"] },

  // ── Commercial > Reviews ──
  { id: "review-policies",   name: "Review Policies",           description: "Review and analyze insurance policies with AI-driven insights for accuracy and compliance.", line: "commercial", subCategory: "reviews", iconType: "review", tags: ["review", "policy"] },
  { id: "challenge-claim",   name: "Challenge Claim Denial",    description: "Analyze claim denial letters and policy documents to evaluate validity and identify challenges.", line: "commercial", subCategory: "reviews", iconType: "claim", tags: ["claim", "denial"] },
  { id: "analyze-gaps",      name: "Analyze Coverage Gaps",     description: "Analyze an insurance policy to surface potential gaps and coverage deficiencies.", line: "commercial", subCategory: "reviews", iconType: "gap", tags: ["coverage", "gaps"] },
  { id: "analyze-towers",    name: "Analyze Towers",            description: "Review the structure and compliance of insurance coverage towers layer by layer.", line: "commercial", subCategory: "reviews", iconType: "tower", tags: ["tower", "layers"] },

  // ── Commercial > Verification ──
  { id: "verify-quote",      name: "Verify Against Quote",      description: "Verify a bound policy against the original quote to confirm accuracy of all terms.", line: "commercial", subCategory: "verification", iconType: "verify", tags: ["verify", "quote"] },
  { id: "verify-application",name: "Verify Against Application",description: "Cross-check the issued policy against the original application for discrepancies.", line: "commercial", subCategory: "verification", iconType: "verify", tags: ["verify", "application"] },
  { id: "exposure-checklist",name: "Exposure Checklist",        description: "Run an insurance policy against exposure checklists to ensure all risk areas are addressed.", line: "commercial", subCategory: "verification", iconType: "exposure", tags: ["exposure", "checklist"] },
  { id: "idl-verifier",      name: "IDL Verifier",              description: "Verify insured location details against policy schedules and declarations pages.", line: "commercial", subCategory: "verification", iconType: "verify", tags: ["IDL", "location"] },

  // ── Commercial > Document Builder ──
  { id: "bor-letters",       name: "BOR Letters",               description: "Extract policy information and generate Broker of Record letters grouped by carrier.", line: "commercial", subCategory: "document-builder", iconType: "bor", tags: ["BOR", "broker", "record", "letters"] },
  { id: "nb-proposals",      name: "NB Proposals",              description: "Build new business insurance proposals using policy data and customizable templates.", line: "commercial", subCategory: "document-builder", iconType: "proposal", tags: ["proposal", "new business"] },
  { id: "renewal-proposals", name: "Renewal Proposals",         description: "Generate renewal proposals with prior-year comparison highlights and premium changes.", line: "commercial", subCategory: "document-builder", iconType: "bor", tags: ["renewal", "proposal"] },
  { id: "fill-acord",        name: "Fill Acord Forms",          description: "Automatically populate Acord forms from policy documents and application data.", line: "commercial", subCategory: "document-builder", iconType: "contract", tags: ["acord", "forms", "fill"] },

  // ── Commercial > AMS Workflows ──
  { id: "policy-check",      name: "Policy Check",              description: "Validate policy details against your AMS records to catch mismatches before binding.", line: "commercial", subCategory: "ams-workflows", iconType: "verify", tags: ["AMS", "policy", "check"] },
  { id: "soi",               name: "SOI",                       description: "Generate Summaries of Insurance from policy documents for client-ready delivery.", line: "commercial", subCategory: "ams-workflows", iconType: "summary", tags: ["SOI", "summary"] },
  { id: "certs",             name: "Certs",                     description: "Create and manage certificates of insurance from policy data automatically.", line: "commercial", subCategory: "ams-workflows", iconType: "contract", tags: ["certificates", "certs"] },
  { id: "submissions",       name: "Submissions",               description: "Prepare and package submission materials for carrier underwriting review.", line: "commercial", subCategory: "ams-workflows", iconType: "bor", tags: ["submission", "underwriting"] },
  { id: "ask-ams",           name: "Ask AMS",                   description: "Query your AMS data with natural language to surface policy, client, and account insights.", line: "commercial", subCategory: "ams-workflows", iconType: "review", tags: ["AMS", "query", "data"] },

  // ── Commercial > Schedules ──
  { id: "extract-schedules", name: "Extract Schedules",         description: "Pull structured schedule data from policy documents for locations, vehicles, and equipment.", line: "commercial", subCategory: "schedules", iconType: "tower", tags: ["schedule", "extract", "SOV"] },
  { id: "compare-sovs",      name: "Compare SOVs",              description: "Compare Statements of Value across periods to identify changes in insured assets.", line: "commercial", subCategory: "schedules", iconType: "compare", tags: ["SOV", "schedule", "values"] },
  { id: "build-sovs",        name: "Build SOVs",                description: "Compile and structure Statements of Value from multiple source documents.", line: "commercial", subCategory: "schedules", iconType: "chart", tags: ["SOV", "build", "schedule"] },

  // ── Commercial > Surety Bonds ──
  { id: "surety-application",name: "Surety Bond Application",   description: "Streamline surety bond applications by extracting and validating required data.", line: "commercial", subCategory: "surety-bonds", iconType: "contract", tags: ["surety", "bond", "application"] },
  { id: "surety-verification",name:"Surety Bond Verification",  description: "Verify surety bond terms and conditions against project or contract requirements.", line: "commercial", subCategory: "surety-bonds", iconType: "verify", tags: ["surety", "bond", "verify"] },
  { id: "surety-renewal",    name: "Surety Bond Renewal",       description: "Review expiring surety bonds and prepare renewal submissions with updated financials.", line: "commercial", subCategory: "surety-bonds", iconType: "bor", tags: ["surety", "bond", "renewal"] },
  { id: "surety-analysis",   name: "Surety Bond Analysis",      description: "Analyze surety bond capacity, obligee requirements, and indemnity provisions.", line: "commercial", subCategory: "surety-bonds", iconType: "exposure", tags: ["surety", "bond", "analysis"] },

  // ── Commercial > Risk Management ──
  { id: "loss-runs",         name: "Loss Runs",                 description: "Extract and summarize loss run data from carrier documents for underwriting review.", line: "commercial", subCategory: "risk-management", iconType: "claim", tags: ["loss", "runs", "claims"] },
  { id: "loss-summary",      name: "Loss Summary",              description: "Generate a concise loss summary report from raw loss run data across carriers.", line: "commercial", subCategory: "risk-management", iconType: "summary", tags: ["loss", "summary", "report"] },
  { id: "claims-analytics",  name: "Claims Analytics",          description: "Analyze claims history trends to identify patterns and risk improvement opportunities.", line: "commercial", subCategory: "risk-management", iconType: "chart", tags: ["claims", "analytics", "trends"] },
  { id: "risk-control",      name: "Risk Control",              description: "Evaluate risk control recommendations and match them to policy coverages.", line: "commercial", subCategory: "risk-management", iconType: "exposure", tags: ["risk", "control"] },

  // ── Commercial > Form Fill ──
  { id: "acord-apps",        name: "Acord Apps",                description: "Pre-populate Acord application forms using data extracted from existing documents.", line: "commercial", subCategory: "form-fill", iconType: "contract", tags: ["acord", "application", "form"] },
  { id: "form-certs",        name: "Certs",                     description: "Auto-fill certificate forms using active policy data from your records.", line: "commercial", subCategory: "form-fill", iconType: "contract", tags: ["certificate", "form", "fill"] },
  { id: "supplementals",     name: "Supplementals",             description: "Complete supplemental applications using AI to extract relevant risk information.", line: "commercial", subCategory: "form-fill", iconType: "summary", tags: ["supplemental", "application"] },
  { id: "form-custom",       name: "Custom",                    description: "Fill any custom form or template using data extracted from uploaded documents.", line: "commercial", subCategory: "form-fill", iconType: "proposal", tags: ["custom", "form"] },

  // ── Commercial > Custom Workflows ──
  { id: "quarterly-review",  name: "Quarterly Policy Review",   description: "Scheduled quarterly review of all active policies for coverage adequacy and renewals.", line: "commercial", subCategory: "custom-workflows", iconType: "review", tags: ["quarterly", "review"] },
  { id: "client-onboarding", name: "New Client Onboarding",     description: "Guided workflow to collect, verify, and bind coverage for new commercial clients.", line: "commercial", subCategory: "custom-workflows", iconType: "proposal", tags: ["onboarding", "new client"] },
  { id: "renewal-campaign",  name: "Renewal Campaign",          description: "Run proactive renewal outreach and proposal generation for upcoming policy expirations.", line: "commercial", subCategory: "custom-workflows", iconType: "bor", tags: ["renewal", "campaign"] },

  // ── Employee Benefits ──
  { id: "compare-plans",     name: "Compare Plans",             description: "Compare employee benefits plans across multiple carriers to find the best options.", line: "benefits", subCategory: "benefits", iconType: "compare", tags: ["plans", "compare"] },
  { id: "analyze-costs",     name: "Analyze Costs",             description: "Analyze health insurance costs by comparing plan rates with employee census enrollment.", line: "benefits", subCategory: "benefits", iconType: "cost", tags: ["cost", "analysis", "census"] },
  { id: "analyze-contributions", name: "Analyze Contributions", description: "Evaluate employer and employee contribution strategies for health insurance plans.", line: "benefits", subCategory: "benefits", iconType: "contribution", tags: ["contribution", "employer", "employee"] },
  { id: "ben-bor-letters",   name: "BOR Letters",               description: "Generate Broker of Record letters for group benefit plans grouped by carrier.", line: "benefits", subCategory: "benefits", iconType: "bor", tags: ["BOR", "broker", "record"] },
  { id: "bill-reconciliation",name:"Bill Reconciliation",       description: "Compare and reconcile employee census data against carrier billing across periods.", line: "benefits", subCategory: "benefits", iconType: "bill", tags: ["bill", "reconciliation", "census"] },

  // ── Personal Lines ──
  { id: "pl-compare-quotes", name: "Compare Quotes",            description: "Compare personal lines quotes across carriers to identify the best value for clients.", line: "personal-lines", subCategory: "personal-lines", iconType: "compare", tags: ["personal", "quote"] },
  { id: "pl-compare-expiring",name:"Compare w/ Expiring",       description: "Compare new quotes against expiring personal lines policies to surface coverage changes.", line: "personal-lines", subCategory: "personal-lines", iconType: "policy", tags: ["personal", "expiring", "compare"] },
  { id: "pl-review-policies",name: "Review Policies",           description: "Review personal lines policies for accuracy, gaps, and coverage adequacy.", line: "personal-lines", subCategory: "personal-lines", iconType: "review", tags: ["personal", "review"] },
  { id: "pl-proposal",       name: "Proposal",                  description: "Build client-ready personal lines proposals from quotes and coverage recommendations.", line: "personal-lines", subCategory: "personal-lines", iconType: "proposal", tags: ["personal", "proposal"] },
];

// ─── History data ──────────────────────────────────────────────────────────────

const HISTORY_GROUPS: { label: string; items: HistoryEntry[] }[] = [
  {
    label: "Previous 7 Days",
    items: [
      { id: "h1", title: "Outmarket AI Tech E&O & Cyber Quote Comparison", workflowId: "compare-quotes", line: "commercial" },
      { id: "h2", title: "BOR Request - Outmarket AI & Chaucer Insurance - Lucas Boyd", workflowId: "bor-letters", line: "commercial" },
    ],
  },
  {
    label: "Previous 30 Days",
    items: [
      { id: "h3", title: "BOR Request for Prairie Farms Dairy Flood Policies", workflowId: "bor-letters", line: "commercial" },
      { id: "h4", title: "Contract Insurance Mismatch Review", workflowId: "contract-req", line: "commercial" },
      { id: "h5", title: "Outmarket AI Contract Insurance Requirements Review", workflowId: "contract-req", line: "commercial" },
      { id: "h6", title: "Outmarket AI Tech E&O & Cyber Quote Comparison", workflowId: "compare-quotes", line: "commercial" },
    ],
  },
  {
    label: "March",
    items: [
      { id: "h7", title: "Missing Commercial Auto Coverage Analysis", workflowId: "analyze-gaps", line: "commercial" },
      { id: "h8", title: "Bill Reconciliation - Steel Plate Cigna 2026", workflowId: "bill-reconciliation", line: "benefits" },
      { id: "h9", title: "CMJ Technologies Bill Reconciliation Jan–Feb 2026", workflowId: "bill-reconciliation", line: "benefits" },
      { id: "h10", title: "Vanguard March 2026 Bill Reconciliation", workflowId: "bill-reconciliation", line: "benefits" },
      { id: "h11", title: "Argen Corp 2025–2026 Health Plan Cost Analysis", workflowId: "analyze-costs", line: "benefits" },
    ],
  },
];

const RECENTLY_USED_IDS = ["compare-quotes", "bor-letters", "contract-req", "bill-reconciliation", "analyze-gaps"];

// ─── SVG Icons ─────────────────────────────────────────────────────────────────

function WorkflowIcon({ type, size = 18, color = "#6a56f0" }: { type: string; size?: number; color?: string }) {
  const p = {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: color, strokeWidth: 1.75,
    strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
  };
  switch (type) {
    case "compare":      return <svg {...p}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>;
    case "policy":       return <svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>;
    case "review":       return <svg {...p}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
    case "claim":        return <svg {...p}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
    case "contract":     return <svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/></svg>;
    case "proposal":     return <svg {...p}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
    case "bor":          return <svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><line x1="12" y1="12" x2="12" y2="18"/><line x1="9.5" y1="15" x2="14.5" y2="15"/></svg>;
    case "exposure":     return <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>;
    case "gap":          return <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
    case "tower":        return <svg {...p}><rect x="3" y="3" width="18" height="4" rx="1"/><rect x="3" y="10" width="13" height="4" rx="1"/><rect x="3" y="17" width="8" height="4" rx="1"/></svg>;
    case "verify":       return <svg {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
    case "chart":        return <svg {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
    case "cost":         return <svg {...p}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
    case "contribution": return <svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case "bill":         return <svg {...p}><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/></svg>;
    case "summary":      return <svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
    case "email":        return <svg {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
    default:             return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="2"/></svg>;
  }
}

// ─── Small icon button ─────────────────────────────────────────────────────────

function SmallIconBtn({ children, title }: { children: React.ReactNode; title?: string }) {
  const [hover, setHover] = useState(false);
  return (
    <button title={title} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ width: 28, height: 28, borderRadius: 6, border: "none", background: hover ? "#f2f4f7" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s ease" }}>
      {children}
    </button>
  );
}

// ─── Workflow card ─────────────────────────────────────────────────────────────

function WorkflowCard({ workflow, showDescription = false }: { workflow: Workflow; showDescription?: boolean }) {
  const [hover, setHover] = useState(false);
  const cfg = LINE_CONFIG[workflow.line];
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%", padding: "10px 12px", borderRadius: 8,
        border: `1px solid ${hover ? cfg.color : "#E7EBEE"}`,
        background: hover ? (workflow.line === "commercial" ? "#f6f7fe" : workflow.line === "benefits" ? "#f0f7ff" : "#f0fdf4") : "#ffffff",
        display: "flex", alignItems: "flex-start", gap: 10,
        cursor: "pointer", transition: "border-color 0.15s ease, background 0.15s ease",
        textAlign: "left", fontFamily: "inherit",
      }}
    >
      <div style={{ width: 32, height: 32, borderRadius: 7, flexShrink: 0, background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <WorkflowIcon type={workflow.iconType} size={16} color={cfg.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#1b1d1d", lineHeight: "18px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" } as React.CSSProperties}>
          {workflow.name}
        </div>
        {showDescription && (
          <div style={{ fontSize: 12, color: "#6a758a", lineHeight: "17px", marginTop: 2, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" } as React.CSSProperties}>
            {workflow.description}
          </div>
        )}
      </div>
    </button>
  );
}

// ─── Count badge ───────────────────────────────────────────────────────────────

function CountBadge({ count, color, bg }: { count: number; color: string; bg: string }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 500, color, background: bg, borderRadius: 100, padding: "1px 7px", lineHeight: "18px" }}>
      {count}
    </span>
  );
}

// ─── Sub-category section (for Commercial) ────────────────────────────────────

function SubCategorySection({
  subCategoryId, label, workflows, lineCfg, searchQuery,
}: {
  subCategoryId: string; label: string; workflows: Workflow[];
  lineCfg: { label: string; color: string; bg: string };
  searchQuery: string;
}) {
  const q = searchQuery.toLowerCase();
  const filtered = q
    ? workflows.filter(w =>
        w.name.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q) ||
        (w.tags ?? []).some(t => t.toLowerCase().includes(q))
      )
    : workflows;

  if (filtered.length === 0) return null;

  const isCustom = subCategoryId === "custom-workflows";

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        {isCustom && (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={lineCfg.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        )}
        <span style={{ fontSize: 13, fontWeight: 500, color: "#525965" }}>{label}</span>
        <CountBadge count={filtered.length} color={lineCfg.color} bg={lineCfg.bg} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 6 }}>
        {filtered.map(w => <WorkflowCard key={w.id} workflow={w} />)}
      </div>
    </div>
  );
}

// ─── Line section ──────────────────────────────────────────────────────────────

function LineSection({ line, workflows, searchQuery }: { line: Line; workflows: Workflow[]; searchQuery: string }) {
  const cfg = LINE_CONFIG[line];
  const q = searchQuery.toLowerCase();

  const filtered = q
    ? workflows.filter(w =>
        w.name.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q) ||
        (w.tags ?? []).some(t => t.toLowerCase().includes(q))
      )
    : workflows;

  if (filtered.length === 0) return null;

  const isCommercial = line === "commercial";

  return (
    <div style={{ marginBottom: 40 }}>
      {/* Line header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        marginBottom: isCommercial ? 20 : 14,
        paddingBottom: 12,
        borderBottom: `1.5px solid ${cfg.bg}`,
      }}>
        <div style={{ width: 4, height: 18, borderRadius: 2, background: cfg.color, flexShrink: 0 }} />
        <span style={{ fontSize: 15, fontWeight: 700, color: "#1b1d1d" }}>{cfg.label}</span>
        <CountBadge count={filtered.length} color={cfg.color} bg={cfg.bg} />
      </div>

      {isCommercial ? (
        // Commercial: grouped by sub-category
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" }}>
          {COMMERCIAL_SUBCATEGORIES.map(sub => {
            const subWorkflows = workflows.filter(w => w.subCategory === sub.id);
            return (
              <SubCategorySection
                key={sub.id}
                subCategoryId={sub.id}
                label={sub.label}
                workflows={subWorkflows}
                lineCfg={cfg}
                searchQuery={searchQuery}
              />
            );
          })}
        </div>
      ) : (
        // Benefits / Personal Lines: flat grid
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
          {filtered.map(w => <WorkflowCard key={w.id} workflow={w} />)}
        </div>
      )}
    </div>
  );
}

// ─── History panel ─────────────────────────────────────────────────────────────

function HistoryItem({ item }: { item: HistoryEntry }) {
  const [hover, setHover] = useState(false);
  const cfg = LINE_CONFIG[item.line];
  const workflow = WORKFLOWS.find(w => w.id === item.workflowId);
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ width: "100%", padding: "7px 16px", background: hover ? "#f6f7fe" : "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 8, textAlign: "left", fontFamily: "inherit", transition: "background 0.15s ease" }}
    >
      <div style={{ width: 28, height: 28, borderRadius: 6, flexShrink: 0, background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
        {workflow && <WorkflowIcon type={workflow.iconType} size={14} color={cfg.color} />}
      </div>
      <span style={{ fontSize: 13, color: "#343839", lineHeight: "18px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" } as React.CSSProperties}>
        {item.title}
      </span>
    </button>
  );
}

function HistoryPanel() {
  return (
    <aside style={{ width: 280, flexShrink: 0, borderRight: "1px solid #E7EBEE", background: "#ffffff", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "16px 16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#1b1d1d" }}>History</span>
        <div style={{ display: "flex", gap: 2 }}>
          <SmallIconBtn title="Filter">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6a758a" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </SmallIconBtn>
          <SmallIconBtn title="Search history">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6a758a" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </SmallIconBtn>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {HISTORY_GROUPS.map(group => (
          <div key={group.label}>
            <div style={{ padding: "8px 16px 4px", fontSize: 11, fontWeight: 500, color: "#97a0b4", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              {group.label}
            </div>
            {group.items.map(item => <HistoryItem key={item.id} item={item} />)}
          </div>
        ))}
      </div>
    </aside>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function LaunchpadPage() {
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const recentlyUsed = useMemo(
    () => RECENTLY_USED_IDS.map(id => WORKFLOWS.find(w => w.id === id)).filter(Boolean) as Workflow[],
    []
  );

  const byLine = useMemo(() => ({
    commercial:       WORKFLOWS.filter(w => w.line === "commercial"),
    benefits:         WORKFLOWS.filter(w => w.line === "benefits"),
    "personal-lines": WORKFLOWS.filter(w => w.line === "personal-lines"),
  }), []);

  const q = search.toLowerCase();
  const hasResults = !search || WORKFLOWS.some(w =>
    w.name.toLowerCase().includes(q) ||
    w.description.toLowerCase().includes(q) ||
    (w.tags ?? []).some(t => t.toLowerCase().includes(q))
  );

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
      <HistoryPanel />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "20px 32px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, borderBottom: "1px solid #F2F4F7" }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1b1d1d", margin: 0, lineHeight: "32px" }}>Launchpad</h1>
          <div style={{ position: "relative", width: 320 }}>
            <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6a758a" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <input
              type="text" value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search workflows..."
              style={{
                width: "100%", height: 36, padding: "0 32px 0 36px",
                border: `1px solid ${searchFocused || search ? "#6a56f0" : "#E7EBEE"}`,
                borderRadius: 8, fontSize: 14, color: "#1b1d1d", background: "#fff",
                outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                boxShadow: searchFocused ? "0 0 0 3px rgba(106,86,240,0.12)" : "none",
                transition: "border-color 0.15s ease, box-shadow 0.15s ease",
              }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 2, borderRadius: 4 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6a758a" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px 48px" }}>
          {/* Recently Used */}
          {!search && (
            <>
              <div style={{ marginBottom: 36 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1b1d1d", marginBottom: 12 }}>Recently Used</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 8 }}>
                  {recentlyUsed.map(w => <WorkflowCard key={w.id} workflow={w} showDescription />)}
                </div>
              </div>
              <div style={{ height: 1, background: "#F2F4F7", marginBottom: 36 }} />
            </>
          )}

          {/* Line sections */}
          <LineSection line="commercial"       workflows={byLine.commercial}       searchQuery={search} />
          <LineSection line="benefits"         workflows={byLine.benefits}         searchQuery={search} />
          <LineSection line="personal-lines"   workflows={byLine["personal-lines"]} searchQuery={search} />

          {/* No results */}
          {!hasResults && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 0", gap: 8 }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d0d5dd" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <div style={{ fontSize: 14, color: "#6a758a", marginTop: 4 }}>No workflows found for "{search}"</div>
              <button onClick={() => setSearch("")} style={{ fontSize: 13, color: "#6a56f0", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: "4px 8px", borderRadius: 6 }}>
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
