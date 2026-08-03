import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import { InputField } from "@/components/ui/input";
import {
  IconSearch, IconPlus, IconX, IconCheck, IconTag,
  IconEye, IconDownload, IconRefresh, IconArrowRight,
  IconFileSearch, IconChevronRight, IconChevronLeft,
  IconChevronDown, IconMoreVertical,
} from "@/components/icons";

// ── Types ──────────────────────────────────────────────────────────────────────

type Schema = {
  id: string;
  name: string;
  category: string;
  fieldCount: number;
  fields: string[];
  color: string;
};

type Client = {
  id: string;
  name: string;
  industry: string;
  docCount: number;
  tags: string[];
  ams: string;
};

type ExtractionDoc = {
  id: string;
  clientId: string;
  name: string;
  type: string;
  pages: number;
  selected: boolean;
};

type Session = {
  id: string;
  name: string;
  schema: string;
  clientCount: number;
  docCount: number;
  status: "completed" | "running" | "failed" | "queued";
  confidence: number;
  createdAt: string;
  duration: string;
};

type ExtractedField = { label: string; value: string; confidence: number };

// ── Mock Data ──────────────────────────────────────────────────────────────────

const SCHEMAS: Schema[] = [
  { id: "s1", name: "GL Policy Extraction", category: "General Liability", fieldCount: 12, color: "#6a56f0",
    fields: ["Policy Number", "Effective Date", "Expiration Date", "Premium", "Each Occurrence Limit", "General Aggregate", "Products Aggregate", "Deductible", "Carrier", "Named Insured", "Additional Insureds", "Endorsements"] },
  { id: "s2", name: "Workers Comp Analysis", category: "Workers Compensation", fieldCount: 8, color: "#0ea5e9",
    fields: ["Policy Number", "State", "Effective Date", "Class Codes", "Payroll", "Premium", "Experience Mod", "Carrier"] },
  { id: "s3", name: "Professional Liability", category: "E&O / PL", fieldCount: 15, color: "#10b981",
    fields: ["Policy Number", "Retroactive Date", "Claims-Made Date", "Aggregate Limit", "Each Claim Limit", "Deductible", "Carrier", "Effective Date", "Expiration Date", "Premium", "Industry", "Retroactive Coverage", "Defense Costs", "Continuity Date", "Tail Period"] },
  { id: "s4", name: "Commercial Auto", category: "Auto", fieldCount: 10, color: "#f59e0b",
    fields: ["Policy Number", "Vehicles", "CSL Limit", "BI per Person", "BI per Occurrence", "PD Limit", "Deductible", "Premium", "Carrier", "Effective Date"] },
  { id: "s5", name: "Property Coverage", category: "Property", fieldCount: 11, color: "#ef4444",
    fields: ["Policy Number", "Building Value", "Contents Value", "Business Income", "Coinsurance", "Deductible", "Carrier", "Effective Date", "Expiration Date", "Premium", "Cause of Loss"] },
  { id: "s6", name: "Umbrella / Excess", category: "Umbrella", fieldCount: 7, color: "#8b5cf6",
    fields: ["Policy Number", "Each Occurrence Limit", "Aggregate Limit", "Retention", "Carrier", "Effective Date", "Underlying Policies"] },
  { id: "s7", name: "Cyber Liability", category: "Cyber", fieldCount: 9, color: "#06b6d4",
    fields: ["Policy Number", "First-Party Limit", "Third-Party Limit", "Ransomware Sublimit", "Retention", "Carrier", "Effective Date", "Premium", "Coverage Triggers"] },
  { id: "s8", name: "Directors & Officers", category: "D&O", fieldCount: 13, color: "#ec4899",
    fields: ["Policy Number", "Side A Limit", "Side B Limit", "Side C Limit", "Retention", "Carrier", "Effective Date", "Expiration Date", "Premium", "Entity Coverage", "Employment Coverage", "Fiduciary", "Run-Off Period"] },
  { id: "s9", name: "Employment Practices", category: "EPLI", fieldCount: 6, color: "#84cc16",
    fields: ["Policy Number", "Each Claim Limit", "Aggregate Limit", "Retention", "Carrier", "Effective Date"] },
];

const CLIENTS: Client[] = [
  { id: "c1",  name: "Acme Corporation",         industry: "Manufacturing",   docCount: 8,  tags: ["gl", "wc"],       ams: "Applied" },
  { id: "c2",  name: "Blue Sky Ventures",         industry: "Technology",     docCount: 5,  tags: ["pl", "cyber"],    ams: "Vertafore" },
  { id: "c3",  name: "Coastal Properties LLC",    industry: "Real Estate",    docCount: 12, tags: ["property"],       ams: "Applied" },
  { id: "c4",  name: "Delta Logistics Group",     industry: "Transportation", docCount: 6,  tags: ["auto", "gl"],     ams: "Applied" },
  { id: "c5",  name: "Eagle Eye Security",        industry: "Security",       docCount: 4,  tags: ["wc", "gl"],       ams: "Vertafore" },
  { id: "c6",  name: "Fusion Biotech Inc",        industry: "Biotech",        docCount: 9,  tags: ["pl", "d&o"],      ams: "Custom" },
  { id: "c7",  name: "Green Earth Landscaping",   industry: "Landscaping",    docCount: 3,  tags: ["gl", "auto"],     ams: "Applied" },
  { id: "c8",  name: "Harbor View Restaurant",    industry: "Hospitality",    docCount: 4,  tags: ["gl"],             ams: "Applied" },
  { id: "c9",  name: "Infinity Data Systems",     industry: "IT Services",    docCount: 7,  tags: ["cyber", "pl"],    ams: "Vertafore" },
  { id: "c10", name: "Jasper Construction Co",    industry: "Construction",   docCount: 11, tags: ["gl", "wc", "auto"], ams: "Applied" },
  { id: "c11", name: "Keystone Medical Group",    industry: "Healthcare",     docCount: 6,  tags: ["pl", "epli"],     ams: "Custom" },
  { id: "c12", name: "Liberty Financial Advisors",industry: "Finance",        docCount: 5,  tags: ["d&o", "epli"],    ams: "Vertafore" },
  { id: "c13", name: "Metro Architecture Firm",   industry: "Architecture",   docCount: 4,  tags: ["pl"],             ams: "Applied" },
  { id: "c14", name: "Nexus Retail Partners",     industry: "Retail",         docCount: 8,  tags: ["gl", "property"], ams: "Applied" },
  { id: "c15", name: "Orion Energy Solutions",    industry: "Energy",         docCount: 6,  tags: ["gl", "umbrella"], ams: "Vertafore" },
  { id: "c16", name: "Pinnacle Law Group",        industry: "Legal",          docCount: 3,  tags: ["pl", "epli"],     ams: "Custom" },
  { id: "c17", name: "Quantum Software Ltd",      industry: "Software",       docCount: 5,  tags: ["cyber", "d&o"],   ams: "Vertafore" },
  { id: "c18", name: "Riverside Healthcare",      industry: "Healthcare",     docCount: 9,  tags: ["pl", "wc"],       ams: "Applied" },
  { id: "c19", name: "Summit Outdoor Gear",       industry: "Retail",         docCount: 4,  tags: ["gl", "property"], ams: "Applied" },
  { id: "c20", name: "Titan Engineering Inc",     industry: "Engineering",    docCount: 7,  tags: ["gl", "pl", "wc"], ams: "Applied" },
];

const SESSIONS: Session[] = [
  { id: "sess1", name: "Q2 GL Renewal Batch",       schema: "GL Policy Extraction",    clientCount: 12, docCount: 67, status: "completed", confidence: 94, createdAt: "2026-05-28", duration: "4m 12s" },
  { id: "sess2", name: "Workers Comp Annual Review", schema: "Workers Comp Analysis",  clientCount: 8,  docCount: 34, status: "completed", confidence: 88, createdAt: "2026-05-25", duration: "2m 45s" },
  { id: "sess3", name: "Cyber Liability Audit",      schema: "Cyber Liability",        clientCount: 5,  docCount: 22, status: "completed", confidence: 91, createdAt: "2026-05-22", duration: "1m 58s" },
  { id: "sess4", name: "Professional Liability Q2",  schema: "Professional Liability", clientCount: 9,  docCount: 41, status: "running",   confidence: 0,  createdAt: "2026-06-01", duration: "—" },
  { id: "sess5", name: "D&O Executive Review",       schema: "Directors & Officers",   clientCount: 4,  docCount: 18, status: "completed", confidence: 96, createdAt: "2026-05-19", duration: "1m 22s" },
  { id: "sess6", name: "Property Portfolio Scan",    schema: "Property Coverage",      clientCount: 7,  docCount: 53, status: "failed",    confidence: 0,  createdAt: "2026-05-17", duration: "—" },
  { id: "sess7", name: "Commercial Auto Fleet",      schema: "Commercial Auto",        clientCount: 6,  docCount: 31, status: "completed", confidence: 89, createdAt: "2026-05-14", duration: "3m 04s" },
  { id: "sess8", name: "Umbrella Limits Review",     schema: "Umbrella / Excess",      clientCount: 15, docCount: 72, status: "completed", confidence: 92, createdAt: "2026-05-10", duration: "5m 37s" },
  { id: "sess9", name: "EPLI Compliance Batch",      schema: "Employment Practices",   clientCount: 11, docCount: 44, status: "queued",    confidence: 0,  createdAt: "2026-06-01", duration: "—" },
];

const EXTRACTED_DATA: Record<string, ExtractedField[]> = {
  sess1: [
    { label: "Policy Number", value: "GL-2024-00871", confidence: 99 },
    { label: "Effective Date", value: "04/01/2026", confidence: 98 },
    { label: "Expiration Date", value: "04/01/2027", confidence: 98 },
    { label: "Premium", value: "$42,500", confidence: 95 },
    { label: "Each Occurrence Limit", value: "$1,000,000", confidence: 97 },
    { label: "General Aggregate", value: "$2,000,000", confidence: 96 },
    { label: "Products Aggregate", value: "$2,000,000", confidence: 94 },
    { label: "Deductible", value: "$5,000", confidence: 91 },
    { label: "Carrier", value: "Travelers Insurance", confidence: 99 },
    { label: "Named Insured", value: "Acme Corporation", confidence: 99 },
    { label: "Additional Insureds", value: "3 listed", confidence: 83 },
    { label: "Endorsements", value: "CG 20 10, CG 20 37", confidence: 78 },
  ],
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function StepIndicator({ step, current }: { step: number; current: number }) {
  const done = current > step;
  const active = current === step;
  return (
    <div className="flex items-center gap-2">
      <div className={[
        "flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium transition-colors",
        done   ? "bg-[#6a56f0] text-white" :
        active ? "bg-[#6a56f0] text-white" :
                 "bg-[#f2f4f7] text-[#97a0b4]",
      ].join(" ")}>
        {done ? <IconCheck size={12} color="white" /> : step}
      </div>
      <span className={[
        "text-sm font-medium",
        active ? "text-[#1b1d1d]" : done ? "text-[#6a56f0]" : "text-[#97a0b4]",
      ].join(" ")}>
        {step === 1 ? "Schema" : step === 2 ? "Clients" : step === 3 ? "Documents" : "Review"}
      </span>
    </div>
  );
}

function SchemaCard({ schema, selected, onSelect }: { schema: Schema; selected: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className={[
        "w-full text-left p-4 rounded-xl border-2 transition-all hover:shadow-md",
        selected
          ? "border-[#6a56f0] bg-[#f6f7fe] shadow-[0_0_0_3px_rgba(106,86,240,0.12)]"
          : "border-[#e7ebee] bg-white hover:border-[#d0d5dd]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: schema.color + "20" }}
          >
            <IconFileSearch size={16} color={schema.color} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1b1d1d]">{schema.name}</p>
            <p className="text-xs text-[#97a0b4]">{schema.category}</p>
          </div>
        </div>
        <div className={[
          "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
          selected ? "border-[#6a56f0] bg-[#6a56f0]" : "border-[#d0d5dd]",
        ].join(" ")}>
          {selected && <IconCheck size={10} color="white" />}
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {schema.fields.slice(0, 4).map(f => (
          <span key={f} className="px-1.5 py-0.5 bg-[#f2f4f7] rounded text-[11px] text-[#525965]">{f}</span>
        ))}
        {schema.fieldCount > 4 && (
          <span className="px-1.5 py-0.5 bg-[#f2f4f7] rounded text-[11px] text-[#97a0b4]">+{schema.fieldCount - 4} more</span>
        )}
      </div>
    </button>
  );
}

function ClientRow({
  client, selected, onToggle,
}: { client: Client; selected: boolean; onToggle: () => void }) {
  return (
    <div
      className={[
        "flex items-center gap-3 px-4 py-3 border-b border-[#f2f4f7] hover:bg-[#fafafa] transition-colors cursor-pointer",
        selected ? "bg-[#f6f7fe]" : "",
      ].join(" ")}
      onClick={onToggle}
    >
      <div className={[
        "w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors",
        selected ? "border-[#6a56f0] bg-[#6a56f0]" : "border-[#d0d5dd] bg-white",
      ].join(" ")}>
        {selected && <IconCheck size={9} color="white" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#1b1d1d] truncate">{client.name}</p>
        <p className="text-xs text-[#97a0b4]">{client.industry} · {client.docCount} docs · {client.ams}</p>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        {client.tags.slice(0, 2).map(t => (
          <Badge key={t} color="purple" variant="outline" size="small">{t}</Badge>
        ))}
        {client.tags.length > 2 && (
          <Badge color="grey" variant="outline" size="small">+{client.tags.length - 2}</Badge>
        )}
      </div>
    </div>
  );
}

function ConfidenceBadge({ value }: { value: number }) {
  const color = value >= 90 ? "green" : value >= 75 ? "yellow" : "red";
  return <Badge color={color} variant="solid" size="small">{value}%</Badge>;
}

function StatusBadge({ status }: { status: Session["status"] }) {
  const map: Record<Session["status"], { color: "green" | "blue" | "red" | "grey"; label: string }> = {
    completed: { color: "green", label: "Completed" },
    running:   { color: "blue",  label: "Running…" },
    failed:    { color: "red",   label: "Failed" },
    queued:    { color: "grey",  label: "Queued" },
  };
  const { color, label } = map[status];
  return <Badge color={color} variant="outline" dot>{label}</Badge>;
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function BenchmarkingPage() {
  const [activeTab, setActiveTab] = useState<"extraction" | "clients" | "sessions">("extraction");
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedSchema, setSelectedSchema] = useState<Schema | null>(null);
  const [selectedClientIds, setSelectedClientIds] = useState<Set<string>>(new Set());
  const [clientSearch, setClientSearch] = useState("");
  const [schemaSearch, setSchemaSearch] = useState("");
  const [viewingSession, setViewingSession] = useState<Session | null>(null);
  const [sessionFilter, setSessionFilter] = useState<"all" | Session["status"]>("all");

  // Client tag management state
  const [clientTagSearch, setClientTagSearch] = useState("");
  const [suggestedTagsAccepted, setSuggestedTagsAccepted] = useState<Set<string>>(new Set());
  const [suggestedTagsRejected, setSuggestedTagsRejected] = useState<Set<string>>(new Set());

  const filteredClients = CLIENTS.filter(c =>
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.industry.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const filteredSchemas = SCHEMAS.filter(s =>
    s.name.toLowerCase().includes(schemaSearch.toLowerCase()) ||
    s.category.toLowerCase().includes(schemaSearch.toLowerCase())
  );

  const selectedClients = CLIENTS.filter(c => selectedClientIds.has(c.id));
  const totalDocs = selectedClients.reduce((sum, c) => sum + c.docCount, 0);

  const filteredSessions = SESSIONS.filter(s =>
    sessionFilter === "all" || s.status === sessionFilter
  );

  const toggleClient = (id: string) => {
    setSelectedClientIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAllClients = () => {
    setSelectedClientIds(new Set(filteredClients.map(c => c.id)));
  };

  const clearClients = () => setSelectedClientIds(new Set());

  const handleRunExtraction = () => {
    setWizardStep(1);
    setSelectedSchema(null);
    setSelectedClientIds(new Set());
    setActiveTab("sessions");
  };

  // ── Suggested tags for client mapping ────────────────────────────────────────
  const suggestedMappings = [
    { clientId: "c6",  clientName: "Fusion Biotech Inc",        tag: "umbrella", reason: "High-value policy detected" },
    { clientId: "c11", clientName: "Keystone Medical Group",     tag: "wc",       reason: "Payroll data in docs" },
    { clientId: "c12", clientName: "Liberty Financial Advisors", tag: "cyber",    reason: "Tech exposure identified" },
    { clientId: "c17", clientName: "Quantum Software Ltd",       tag: "pl",       reason: "Professional services flag" },
  ].filter(m => !suggestedTagsAccepted.has(m.clientId + m.tag) && !suggestedTagsRejected.has(m.clientId + m.tag));

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col w-full h-full overflow-hidden bg-[#f9fafb]">

      {/* Page header + tabs */}
      <div className="bg-white border-b border-[#e7ebee] px-6">
        <div className="flex items-center justify-between py-4">
          <div>
            <h1 className="text-lg font-semibold text-[#1b1d1d]">Benchmarking Extractions</h1>
            <p className="text-sm text-[#6a758a] mt-0.5">Extract structured data from loss runs and policy documents</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => { setActiveTab("extraction"); setWizardStep(1); }}
          >
            <IconPlus size={16} color="white" />
            New Extraction
          </Button>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 -mb-px">
          {(["extraction", "clients", "sessions"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeTab === tab
                  ? "border-[#6a56f0] text-[#6a56f0]"
                  : "border-transparent text-[#6a758a] hover:text-[#1b1d1d]",
              ].join(" ")}
            >
              {tab === "extraction" ? "New Extraction" : tab === "clients" ? "Client Lists" : "Sessions"}
              {tab === "sessions" && (
                <span className="ml-2 px-1.5 py-0.5 bg-[#f2f4f7] rounded text-xs text-[#525965]">
                  {SESSIONS.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto">

        {/* ── Tab: New Extraction Wizard ──────────────────────────────────────── */}
        {activeTab === "extraction" && (
          <div className="max-w-5xl mx-auto px-6 py-6">
            {/* Progress steps */}
            <div className="flex items-center gap-3 mb-8 bg-white rounded-xl border border-[#e7ebee] px-6 py-4">
              {[1, 2, 3, 4].map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <StepIndicator step={s} current={wizardStep} />
                  {i < 3 && <IconChevronRight size={14} color="#d0d5dd" />}
                </div>
              ))}
            </div>

            {/* Step 1: Schema Selection */}
            {wizardStep === 1 && (
              <div>
                <div className="mb-5">
                  <h2 className="text-base font-semibold text-[#1b1d1d]">Select Extraction Schema</h2>
                  <p className="text-sm text-[#6a758a] mt-1">Choose the schema that defines the fields to extract from your documents.</p>
                </div>
                <div className="mb-4">
                  <InputField
                    leadingIcon={<IconSearch size={16} color="#97a0b4" />}
                    placeholder="Search schemas…"
                    value={schemaSearch}
                    onChange={e => setSchemaSearch(e.target.value)}
                    size="sm"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {filteredSchemas.map(s => (
                    <SchemaCard
                      key={s.id}
                      schema={s}
                      selected={selectedSchema?.id === s.id}
                      onSelect={() => setSelectedSchema(s)}
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#97a0b4]">
                    {selectedSchema ? `Selected: ${selectedSchema.name} (${selectedSchema.fieldCount} fields)` : "No schema selected"}
                  </span>
                  <Button
                    variant="primary"
                    size="md"
                    disabled={!selectedSchema}
                    onClick={() => setWizardStep(2)}
                  >
                    Continue <IconArrowRight size={16} color="white" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Client Selection */}
            {wizardStep === 2 && (
              <div>
                <div className="mb-5">
                  <h2 className="text-base font-semibold text-[#1b1d1d]">Select Clients</h2>
                  <p className="text-sm text-[#6a758a] mt-1">Choose which clients' documents to run this extraction on.</p>
                </div>
                <div className="bg-white rounded-xl border border-[#e7ebee] overflow-hidden mb-4">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#f2f4f7]">
                    <div className="flex-1 max-w-sm">
                      <InputField
                        leadingIcon={<IconSearch size={16} color="#97a0b4" />}
                        placeholder="Search clients…"
                        value={clientSearch}
                        onChange={e => setClientSearch(e.target.value)}
                        size="sm"
                      />
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-sm text-[#97a0b4]">{selectedClientIds.size} selected</span>
                      <Button variant="tertiary-color" size="sm" onClick={selectAllClients}>Select all</Button>
                      {selectedClientIds.size > 0 && (
                        <Button variant="tertiary-gray" size="sm" onClick={clearClients}>Clear</Button>
                      )}
                    </div>
                  </div>
                  <div className="max-h-[420px] overflow-y-auto">
                    {filteredClients.map(c => (
                      <ClientRow
                        key={c.id}
                        client={c}
                        selected={selectedClientIds.has(c.id)}
                        onToggle={() => toggleClient(c.id)}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Button variant="secondary" size="md" onClick={() => setWizardStep(1)}>
                    <IconChevronLeft size={16} color="#343839" /> Back
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    disabled={selectedClientIds.size === 0}
                    onClick={() => setWizardStep(3)}
                  >
                    Continue ({selectedClientIds.size} clients) <IconArrowRight size={16} color="white" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Document Selection */}
            {wizardStep === 3 && (
              <div>
                <div className="mb-5">
                  <h2 className="text-base font-semibold text-[#1b1d1d]">Review Documents</h2>
                  <p className="text-sm text-[#6a758a] mt-1">All available documents for selected clients are included by default.</p>
                </div>
                <div className="space-y-3 mb-6">
                  {selectedClients.map(client => (
                    <div key={client.id} className="bg-white rounded-xl border border-[#e7ebee] overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 bg-[#fafafa] border-b border-[#f2f4f7]">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#eae7fe] flex items-center justify-center">
                            <span className="text-[10px] font-bold text-[#6a56f0]">
                              {client.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-[#1b1d1d]">{client.name}</span>
                          <Badge color="grey" variant="solid" size="small">{client.docCount} docs</Badge>
                        </div>
                        <Button variant="tertiary-gray" size="sm">
                          <IconChevronDown size={14} color="#525965" /> All selected
                        </Button>
                      </div>
                      <div className="divide-y divide-[#f2f4f7]">
                        {Array.from({ length: Math.min(client.docCount, 3) }, (_, i) => ({
                          name: `${client.name.split(" ")[0]}_Policy_Doc_${i + 1}.pdf`,
                          pages: Math.floor(Math.random() * 20) + 3,
                        })).map((doc, i) => (
                          <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                            <div className="w-4 h-4 rounded border-2 border-[#6a56f0] bg-[#6a56f0] flex items-center justify-center flex-shrink-0">
                              <IconCheck size={9} color="white" />
                            </div>
                            <span className="text-sm text-[#343839] flex-1 truncate">{doc.name}</span>
                            <span className="text-xs text-[#97a0b4] flex-shrink-0">{doc.pages}p</span>
                            <Badge color="red" variant="solid" size="small">PDF</Badge>
                          </div>
                        ))}
                        {client.docCount > 3 && (
                          <div className="px-4 py-2 text-xs text-[#6a56f0] cursor-pointer hover:bg-[#f6f7fe]">
                            + {client.docCount - 3} more documents
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <Button variant="secondary" size="md" onClick={() => setWizardStep(2)}>
                    <IconChevronLeft size={16} color="#343839" /> Back
                  </Button>
                  <Button variant="primary" size="md" onClick={() => setWizardStep(4)}>
                    Continue ({totalDocs} docs) <IconArrowRight size={16} color="white" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Review & Run */}
            {wizardStep === 4 && (
              <div>
                <div className="mb-5">
                  <h2 className="text-base font-semibold text-[#1b1d1d]">Review & Run</h2>
                  <p className="text-sm text-[#6a758a] mt-1">Confirm your extraction settings before running.</p>
                </div>
                <div className="space-y-3 mb-6">
                  {/* Schema summary */}
                  <div className="bg-white rounded-xl border border-[#e7ebee] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-[#97a0b4] uppercase tracking-wide">Schema</span>
                      <Button variant="tertiary-color" size="sm" onClick={() => setWizardStep(1)}>Edit</Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: (selectedSchema?.color ?? "#6a56f0") + "20" }}>
                        <IconFileSearch size={18} color={selectedSchema?.color ?? "#6a56f0"} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1b1d1d]">{selectedSchema?.name}</p>
                        <p className="text-xs text-[#97a0b4]">{selectedSchema?.fieldCount} fields · {selectedSchema?.category}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {selectedSchema?.fields.slice(0, 6).map(f => (
                        <span key={f} className="px-2 py-0.5 bg-[#f2f4f7] rounded text-xs text-[#525965]">{f}</span>
                      ))}
                      {(selectedSchema?.fieldCount ?? 0) > 6 && (
                        <span className="px-2 py-0.5 bg-[#f2f4f7] rounded text-xs text-[#97a0b4]">+{(selectedSchema?.fieldCount ?? 0) - 6} more</span>
                      )}
                    </div>
                  </div>

                  {/* Clients summary */}
                  <div className="bg-white rounded-xl border border-[#e7ebee] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-[#97a0b4] uppercase tracking-wide">Clients</span>
                      <Button variant="tertiary-color" size="sm" onClick={() => setWizardStep(2)}>Edit</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedClients.map(c => (
                        <div key={c.id} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#f6f7fe] rounded-lg border border-[#eae7fe]">
                          <span className="text-sm font-medium text-[#343839]">{c.name}</span>
                          <span className="text-xs text-[#97a0b4]">{c.docCount}d</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Total Clients",   value: selectedClients.length, color: "#6a56f0" },
                      { label: "Total Documents",  value: totalDocs,              color: "#0ea5e9" },
                      { label: "Fields to Extract",value: selectedSchema?.fieldCount ?? 0, color: "#10b981" },
                    ].map(stat => (
                      <div key={stat.label} className="bg-white rounded-xl border border-[#e7ebee] p-4 text-center">
                        <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                        <p className="text-xs text-[#97a0b4] mt-0.5">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Extraction name */}
                  <div className="bg-white rounded-xl border border-[#e7ebee] p-4">
                    <label className="block text-xs font-semibold text-[#97a0b4] uppercase tracking-wide mb-2">Session Name</label>
                    <InputField
                      placeholder={`${selectedSchema?.name} — ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
                      size="sm"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Button variant="secondary" size="md" onClick={() => setWizardStep(3)}>
                    <IconChevronLeft size={16} color="#343839" /> Back
                  </Button>
                  <Button variant="primary" size="md" onClick={handleRunExtraction}>
                    Run Extraction <IconArrowRight size={16} color="white" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Client Lists ──────────────────────────────────────────────── */}
        {activeTab === "clients" && (
          <div className="max-w-5xl mx-auto px-6 py-6">
            {/* AI Suggestions banner */}
            {suggestedMappings.length > 0 && (
              <div className="bg-[#f6f7fe] border border-[#eae7fe] rounded-xl p-4 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-[#6a56f0] flex items-center justify-center">
                    <IconTag size={12} color="white" />
                  </div>
                  <span className="text-sm font-semibold text-[#1b1d1d]">Auto-tagging Suggestions</span>
                  <Badge color="purple" variant="solid" size="small">{suggestedMappings.length} new</Badge>
                </div>
                <div className="space-y-2">
                  {suggestedMappings.map(m => (
                    <div key={m.clientId + m.tag} className="flex items-center justify-between bg-white rounded-lg border border-[#eae7fe] px-3 py-2.5">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-[#1b1d1d]">{m.clientName}</span>
                        <IconArrowRight size={12} color="#97a0b4" />
                        <Badge color="purple" variant="outline" size="small">{m.tag}</Badge>
                        <span className="text-xs text-[#97a0b4]">{m.reason}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSuggestedTagsRejected(prev => new Set([...prev, m.clientId + m.tag]))}
                        >
                          <IconX size={14} color="#525965" /> Dismiss
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setSuggestedTagsAccepted(prev => new Set([...prev, m.clientId + m.tag]))}
                        >
                          <IconCheck size={14} color="white" /> Accept
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Client table */}
            <div className="bg-white rounded-xl border border-[#e7ebee] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#f2f4f7]">
                <div className="flex-1 max-w-sm">
                  <InputField
                    leadingIcon={<IconSearch size={16} color="#97a0b4" />}
                    placeholder="Search clients…"
                    value={clientTagSearch}
                    onChange={e => setClientTagSearch(e.target.value)}
                    size="sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#97a0b4]">{CLIENTS.length} clients</span>
                  <Button variant="secondary" size="sm">
                    <IconDownload size={14} color="#343839" /> Export CSV
                  </Button>
                </div>
              </div>
              {/* Header */}
              <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-4 py-2.5 bg-[#fafafa] border-b border-[#f2f4f7]">
                {["Client", "Industry", "AMS", "Tags"].map(h => (
                  <span key={h} className="text-xs font-semibold text-[#97a0b4] uppercase tracking-wide">{h}</span>
                ))}
              </div>
              {/* Rows */}
              {CLIENTS.filter(c => c.name.toLowerCase().includes(clientTagSearch.toLowerCase())).map(client => (
                <div key={client.id} className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 items-center px-4 py-3 border-b border-[#f2f4f7] hover:bg-[#fafafa] transition-colors">
                  <div>
                    <p className="text-sm font-medium text-[#1b1d1d]">{client.name}</p>
                    <p className="text-xs text-[#97a0b4]">{client.docCount} documents</p>
                  </div>
                  <span className="text-sm text-[#525965]">{client.industry}</span>
                  <Badge color="grey" variant="outline" size="small">{client.ams}</Badge>
                  <div className="flex items-center gap-1 flex-wrap justify-end">
                    {client.tags.map(t => (
                      <span key={t} className="flex items-center gap-1 px-2 py-0.5 bg-[#f6f7fe] border border-[#eae7fe] rounded-full text-xs text-[#6a56f0]">
                        {t}
                        <button className="hover:text-[#f04438] transition-colors"><IconX size={10} color="currentColor" /></button>
                      </span>
                    ))}
                    <IconButton size="sm" border={false} tooltip="Add tag">
                      <IconPlus size={14} color="#97a0b4" />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab: Sessions ────────────────────────────────────────────────────── */}
        {activeTab === "sessions" && (
          <div className="max-w-5xl mx-auto px-6 py-6">
            {/* Filter bar */}
            <div className="flex items-center gap-2 mb-5">
              {(["all", "completed", "running", "failed", "queued"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setSessionFilter(f)}
                  className={[
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                    sessionFilter === f
                      ? "bg-[#eae7fe] text-[#6a56f0]"
                      : "bg-white border border-[#e7ebee] text-[#525965] hover:bg-[#f9fafb]",
                  ].join(" ")}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  <span className="ml-1.5 text-xs text-[#97a0b4]">
                    {f === "all" ? SESSIONS.length : SESSIONS.filter(s => s.status === f).length}
                  </span>
                </button>
              ))}
              <div className="ml-auto">
                <Button variant="tertiary-gray" size="sm">
                  <IconRefresh size={14} color="#525965" /> Refresh
                </Button>
              </div>
            </div>

            {/* Session list */}
            <div className="space-y-3">
              {filteredSessions.map(session => (
                <div key={session.id} className="bg-white rounded-xl border border-[#e7ebee] p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-[#1b1d1d]">{session.name}</h3>
                        <StatusBadge status={session.status} />
                        {session.confidence > 0 && <ConfidenceBadge value={session.confidence} />}
                      </div>
                      <p className="text-xs text-[#97a0b4] mb-3">{session.schema}</p>
                      <div className="flex items-center gap-4 text-xs text-[#6a758a]">
                        <span>{session.clientCount} clients</span>
                        <span>·</span>
                        <span>{session.docCount} documents</span>
                        <span>·</span>
                        <span>{session.createdAt}</span>
                        {session.duration !== "—" && (
                          <>
                            <span>·</span>
                            <span>{session.duration}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-4">
                      {session.status === "completed" && (
                        <Button variant="tertiary-color" size="sm" onClick={() => setViewingSession(session)}>
                          <IconEye size={14} color="#6a56f0" /> View data
                        </Button>
                      )}
                      {session.status === "failed" && (
                        <Button variant="secondary" size="sm">
                          <IconRefresh size={14} color="#343839" /> Retry
                        </Button>
                      )}
                      {session.status === "completed" && (
                        <Button variant="secondary" size="sm">
                          <IconDownload size={14} color="#343839" /> Export
                        </Button>
                      )}
                      <IconButton size="sm" border={false} tooltip="More options">
                        <IconMoreVertical size={14} color="#525965" />
                      </IconButton>
                    </div>
                  </div>
                  {session.status === "running" && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-[#97a0b4] mb-1.5">
                        <span>Extracting documents…</span>
                        <span>Processing</span>
                      </div>
                      <div className="h-1.5 bg-[#f2f4f7] rounded-full overflow-hidden">
                        <div className="h-full bg-[#6a56f0] rounded-full w-[45%] animate-pulse" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Extracted Data Modal ──────────────────────────────────────────────── */}
      {viewingSession && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6"
          onClick={e => { if (e.target === e.currentTarget) setViewingSession(null); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e7ebee]">
              <div>
                <h2 className="text-base font-semibold text-[#1b1d1d]">{viewingSession.name}</h2>
                <p className="text-xs text-[#97a0b4] mt-0.5">{viewingSession.schema} · {viewingSession.docCount} docs · {viewingSession.clientCount} clients</p>
              </div>
              <IconButton size="sm" border tooltip="Close" onClick={() => setViewingSession(null)}>
                <IconX size={16} color="#525965" />
              </IconButton>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-[#1b1d1d]">Extracted Fields — Acme Corporation</span>
                <ConfidenceBadge value={viewingSession.confidence} />
              </div>
              <div className="space-y-2">
                {(EXTRACTED_DATA[viewingSession.id] ?? EXTRACTED_DATA["sess1"]).map(field => (
                  <div key={field.label} className="flex items-center justify-between py-2.5 border-b border-[#f2f4f7] last:border-0">
                    <span className="text-xs font-medium text-[#6a758a] w-44 flex-shrink-0">{field.label}</span>
                    <span className="text-sm text-[#1b1d1d] flex-1 mx-4">{field.value}</span>
                    <ConfidenceBadge value={field.confidence} />
                  </div>
                ))}
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#e7ebee]">
              <Button variant="tertiary-gray" size="sm" onClick={() => setViewingSession(null)}>Close</Button>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">
                  <IconDownload size={14} color="#343839" /> Export CSV
                </Button>
                <Button variant="primary" size="sm">
                  Sync to Assurex <IconArrowRight size={14} color="white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
