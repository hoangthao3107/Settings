import { useState } from "react";
import { color } from "./tokens";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "markets" | "assets" | "contacts" | "activity";

type ActionType = "added-market" | "uploaded-doc" | "updated-market" | "updated-contact" | "removed-market" | "posted-note";

interface Coverage {
  name: string;
  isNew?: boolean;
}

interface FieldChange {
  field: string;
  oldValue: string;
  newValue: string;
  /** Use stacked before/after panels instead of inline arrow diff */
  isMultiline?: boolean;
}

interface ActivityEntry {
  id: string;
  userName: string;
  userInitials: string;
  userColor: string;
  action: ActionType;
  carrierName: string;
  carrierColor: string;
  carrierInitials: string;
  carrierLogo?: string;
  docName?: string;
  contactName?: string;
  newCoverages?: number;
  totalCoverages?: number;
  coverageList?: Coverage[];
  /** Short headline shown in the activity row for notes */
  noteTitle?: string;
  /** Full note body — shown in NoteModal */
  noteContent?: string;
  /** Field-level diff data — shown in FieldChangesModal */
  fieldChanges?: FieldChange[];
  timestamp: Date;
}

interface Carrier {
  id: string;
  name: string;
  initial: string;
  products: string[];
}

// ─── Static data ──────────────────────────────────────────────────────────────

const now = new Date("2026-05-18T14:00:00");

const d = (daysAgo: number, h: number, m: number) => {
  const t = new Date(now);
  t.setDate(t.getDate() - daysAgo);
  t.setHours(h, m, 0, 0);
  return t;
};

const HM_COVERAGES: Coverage[] = [
  { name: "Additional Insured – Engineers, Architects or Surveyors not Engaged by Named Insured", isNew: true },
  { name: "Additional Insured – Owners, Lessees or Contractors", isNew: true },
  { name: "Additional Insured – Owners, Lessees or Contractors – Completed Operations", isNew: true },
  { name: "Additional Insured – State or Political Subdivisions – Permit", isNew: true },
  { name: "Apartment Buildings Endorsement", isNew: true },
  { name: "Beauty Shops and Hair Salons Professional Liability", isNew: true },
  { name: "Business Income with Extra Expense Annual Loss Sustained", isNew: true },
  { name: "Businessowners Choice Endorsement", isNew: true },
  { name: "Businessowners Contractor Choice Endorsement", isNew: true },
  { name: "Businessowners Contractor Extension", isNew: true },
  { name: "Businessowners Florist Extension", isNew: true },
  { name: "Businessowners Funeral Homes Extension", isNew: true },
  { name: "Businessowners Improved Value Endorsement", isNew: true },
  { name: "Businessowners Improved Value Endorsement Plus", isNew: true },
  { name: "Businessowners Policy (BOP)", isNew: true },
  { name: "Businessowners Restaurant Extension", isNew: true },
  { name: "Businessowners Select Endorsement", isNew: true },
  { name: "Businessowners Wholesaler Extension", isNew: true },
  { name: "CPP Restaurant", isNew: true },
  { name: "Choice Additional Of Insurance", isNew: true },
  { name: "Commercial Auto", isNew: true },
  { name: "Commercial Package Policy (CPP)", isNew: true },
  { name: "Condominiums, Co-Ops, Associations – Directors And Officers Liability", isNew: true },
  { name: "Contractors Additional Coverage Endorsement (ACE)", isNew: true },
  { name: "Contractors' Installation, Tools And Equipment Coverage", isNew: true },
  { name: "Crime", isNew: true },
  { name: "Cyber Liability Endorsement Claims-Made and Reported Coverage", isNew: true },
  { name: "General Liability" },
  { name: "Inland Marine" },
  { name: "Property Insurance" },
  { name: "Workers' Compensation" },
];

const LIFE_SCIENCES_COVERAGES: Coverage[] = [
  { name: "Hanover Life Sciences Advantage", isNew: true },
];

const ACTIVITY_DATA: ActivityEntry[] = [
  {
    id: "a1", userName: "Lina Gomez", userInitials: "LG", userColor: "#e86a33",
    action: "updated-market",
    carrierName: "Coterie Insurance Agency", carrierColor: "#e0eaff", carrierInitials: "CI", carrierLogo: "/logos/coterie.svg",
    fieldChanges: [
      { field: "Market Name", oldValue: "Wholesaler Partners Inc.", newValue: "Coterie Insurance Agency" },
      { field: "Contact", oldValue: "John Smith", newValue: "Sarah Lee" },
    ],
    timestamp: d(0, 11, 0),
  },
  {
    id: "a2", userName: "David Kim", userInitials: "DK", userColor: "#e03c3c",
    action: "added-market",
    carrierName: "Fortress Insurance", carrierColor: "transparent", carrierInitials: "FI", carrierLogo: "/logos/fortress.svg",
    timestamp: d(0, 10, 0),
  },
  {
    id: "a3", userName: "Emily Novak", userInitials: "EN", userColor: "#1570ef",
    action: "uploaded-doc",
    carrierName: "Fortress Insurance", carrierColor: "transparent", carrierInitials: "FI", carrierLogo: "/logos/fortress.svg",
    docName: "HM Product Guide.pdf",
    newCoverages: 61, totalCoverages: 62,
    coverageList: HM_COVERAGES,
    timestamp: d(3, 8, 30),
  },
  {
    id: "a4", userName: "Liam Chen", userInitials: "LC", userColor: "#067647",
    action: "updated-contact",
    carrierName: "GreenLeaf Properties", carrierColor: "#f6f7fe", carrierInitials: "GP", carrierLogo: "/logos/greenleaf.svg",
    contactName: "Noah Patel",
    fieldChanges: [
      { field: "Email", oldValue: "noah@gmail.com", newValue: "noah.patel@greenleaf.com" },
      { field: "Phone", oldValue: "+1 (415) 555-0123", newValue: "+1 (415) 555-0189" },
    ],
    timestamp: d(3, 9, 15),
  },
  {
    id: "a4b", userName: "Liam Chen", userInitials: "LC", userColor: "#067647",
    action: "posted-note",
    carrierName: "GreenLeaf Properties", carrierColor: "#f6f7fe", carrierInitials: "GP", carrierLogo: "/logos/greenleaf.svg",
    noteTitle: "Follow-up required on Riverside account",
    noteContent: `Spoke with the underwriter at GreenLeaf this afternoon. They confirmed appetite for the Riverside warehouse account but flagged two items that need to be addressed before they can issue a quote:

1. Need a current loss run for the past 5 years (client to provide by EOW)
2. The sprinkler system certification needs to be updated — last inspection was March 2021

I've sent the requirements list to the client and am following up on Thursday. If we can get these in by Friday, GreenLeaf says they can turnaround a quote within 3 business days.`,
    timestamp: d(3, 9, 45),
  },
  {
    id: "a5", userName: "Sophia Martinez", userInitials: "SM", userColor: "#f59e0b",
    action: "uploaded-doc",
    carrierName: "Rampo Insurance", carrierColor: "#66a6ff", carrierInitials: "RI", carrierLogo: "/logos/rampo.svg",
    docName: "Q2_Sales_Strategy.pptx",
    newCoverages: 0, totalCoverages: 8,
    coverageList: [],
    timestamp: d(3, 10, 2),
  },
  {
    id: "a6", userName: "Noah Patel", userInitials: "NP", userColor: "#0891b2",
    action: "uploaded-doc",
    carrierName: "Skyline Tech", carrierColor: "transparent", carrierInitials: "ST", carrierLogo: "/logos/fortress.svg",
    docName: "Budget_2024.xlsx",
    newCoverages: 4, totalCoverages: 10,
    coverageList: LIFE_SCIENCES_COVERAGES,
    timestamp: d(3, 11, 30),
  },
  {
    id: "a7", userName: "Ava Johnson", userInitials: "AJ", userColor: "#d97706",
    action: "updated-market",
    carrierName: "Vanguard Commercial Assurance", carrierColor: "#f6f7fe", carrierInitials: "VA", carrierLogo: "/logos/vanguard.svg",
    fieldChanges: [
      {
        field: "Description",
        oldValue: "Commercial property insurer focused on small businesses.",
        newValue: "Specialized commercial lines insurer offering property and casualty coverage for mid-market and small businesses across the US, with appetite for habitational and light manufacturing risks.",
        isMultiline: true,
      },
    ],
    timestamp: d(3, 13, 45),
  },
  {
    id: "a8", userName: "Ethan Kim", userInitials: "EK", userColor: "#b45309",
    action: "uploaded-doc",
    carrierName: "Summit Finance", carrierColor: "transparent", carrierInitials: "SF", carrierLogo: "/logos/fortress.svg",
    docName: "Annual_Review.pdf",
    newCoverages: 3, totalCoverages: 15,
    coverageList: [],
    timestamp: d(3, 15, 10),
  },
  {
    id: "a9", userName: "Harsh Modani", userInitials: "HM", userColor: "#6a56f0",
    action: "added-market",
    carrierName: "Novatae Risk Group", carrierColor: "#1570ef", carrierInitials: "NR",
    timestamp: d(4, 15, 0),
  },
  {
    id: "a10", userName: "Ujjwal Singh", userInitials: "US", userColor: "#6a56f0",
    action: "uploaded-doc",
    carrierName: "Hanover Insurance", carrierColor: "#b45309", carrierInitials: "HI",
    docName: "Life Sciences appetite.pdf",
    newCoverages: 1, totalCoverages: 62,
    coverageList: LIFE_SCIENCES_COVERAGES,
    timestamp: d(4, 9, 30),
  },
  {
    id: "a11", userName: "Sarah Chen", userInitials: "SC", userColor: "#1570ef",
    action: "added-market",
    carrierName: "AmTrust Financial", carrierColor: "#f59e0b", carrierInitials: "AF",
    timestamp: d(5, 16, 20),
  },
  {
    id: "a12", userName: "Alex Wilson", userInitials: "AW", userColor: "#f04438",
    action: "removed-market",
    carrierName: "State Farm", carrierColor: "#dc2626", carrierInitials: "SF",
    timestamp: d(5, 15, 45),
  },
  {
    id: "a13", userName: "Michael Johnson", userInitials: "MJ", userColor: "#b45309",
    action: "updated-contact",
    carrierName: "Nationwide", carrierColor: "#1d4ed8", carrierInitials: "NW",
    contactName: "Karen Liu",
    timestamp: d(5, 11, 5),
  },
];

const CARRIERS: Carrier[] = [
  { id: "c1",  initial: "A", name: "AmTrust Financial",    products: ["Environmental Liability", "Commercial Package Select", "Excess Liability", "+45"] },
  { id: "c2",  initial: "O", name: "Outmarket AI",         products: ["Commercial Contractor's Insurance", "Commercial Auto/Trucking", "+4"] },
  { id: "c3",  initial: "N", name: "Nationwide",           products: ["Commercial Package Select", "College Sports Insurance", "First Responder Insurance", "+2"] },
  { id: "c4",  initial: "T", name: "Travelers",            products: ["Casualty", "Insurance", "Inland Marine"] },
  { id: "c5",  initial: "C", name: "Chubb",                products: ["BOP", "Workers Comp", "Bond", "Property"] },
  { id: "c6",  initial: "L", name: "Liberty Mutual",       products: ["Property", "Workers Comp", "Equipment Breakdown", "+4"] },
  { id: "c7",  initial: "Z", name: "Zurich North America", products: ["Property", "Workers Comp", "Equipment Breakdown", "+4"] },
  { id: "c8",  initial: "H", name: "Hartford",             products: ["Garage", "Environmental", "Bond", "Property", "+15"] },
  { id: "c9",  initial: "A", name: "AIG",                  products: ["Auto", "Property", "Inland Marine"] },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRelativeTime(date: Date): string {
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return `Yesterday ${timeStr}`;
  if (diffDays < 7) {
    const day = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${day}, ${timeStr}`;
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Action config ────────────────────────────────────────────────────────────

const ACTION_VERB: Record<ActionType, string> = {
  "added-market":    "added new market",
  "uploaded-doc":    "uploaded document",
  "updated-market":  "updated market",
  "updated-contact": "updated contact",
  "removed-market":  "removed market",
  "posted-note":     "posted a note",
};

// ─── User avatar ──────────────────────────────────────────────────────────────

function UserAvatar({ initials, color: bg, size = 32 }: { initials: string; color: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 700, color: "#fff", letterSpacing: "0.01em",
    }}>
      {initials}
    </div>
  );
}

// ─── Carrier logo ─────────────────────────────────────────────────────────────

function CarrierLogo({ initials, bg, logoUrl, size = 24 }: { initials: string; bg: string; logoUrl?: string; size?: number }) {
  if (logoUrl) {
    return (
      <div style={{
        width: size, height: size, borderRadius: 50, flexShrink: 0,
        background: bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        <img src={logoUrl} alt={initials} style={{ width: "65%", height: "65%", objectFit: "contain" }} />
      </div>
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: 6, flexShrink: 0,
      background: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 700, color: "#fff", letterSpacing: "0.01em",
    }}>
      {initials}
    </div>
  );
}

// ─── Activity type indicator — filled colored icon, no container ──────────────

const ACTION_ICON_COLOR: Record<ActionType, string> = {
  "added-market":    "#6a56f0",
  "uploaded-doc":    "#1570ef",
  "updated-market":  "#b54708",
  "updated-contact": "#0d9488",
  "removed-market":  "#f04438",
  "posted-note":     "#f59e0b",
};

function FeaturedIcon({ type }: { type: ActionType }) {
  const c = ACTION_ICON_COLOR[type];

  if (type === "added-market") return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={c}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
    </svg>
  );

  if (type === "uploaded-doc") return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={c}>
      <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
    </svg>
  );

  if (type === "updated-market") return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={c}>
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>
  );

  if (type === "updated-contact") return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={c}>
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
    </svg>
  );

  if (type === "posted-note") return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={c}>
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
    </svg>
  );

  // removed-market
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={c}>
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
    </svg>
  );
}

// ─── Coverage pills ───────────────────────────────────────────────────────────

function CoveragePill({ name, isNew }: { name: string; isNew?: boolean }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: 12, color: "#344054",
      background: "#f9fafb", border: "1px solid #e7ebee",
      borderRadius: 6, padding: "2px 8px", lineHeight: "18px",
      whiteSpace: "nowrap",
    }}>
      {isNew && (
        <span style={{
          fontSize: 10, fontWeight: 700, color: "#fff",
          background: color.green, borderRadius: 4, padding: "1px 4px",
          lineHeight: "14px",
        }}>New</span>
      )}
      {name}
    </span>
  );
}

// ─── Activity row ─────────────────────────────────────────────────────────────

function ActivityRow({ entry, onViewCoverages, onViewDetails }: {
  entry: ActivityEntry;
  onViewCoverages: (e: React.MouseEvent) => void;
  onViewDetails: (e: React.MouseEvent) => void;
}) {
  const [hover, setHover] = useState(false);
  const hasCoverages = entry.action === "uploaded-doc" && (entry.coverageList?.length ?? 0) > 0;
  const hasNote = entry.action === "posted-note" && !!entry.noteContent;

  // Short field changes (name, email, phone…) are shown fully inline — no CTA needed.
  // Only long/multiline changes (description) warrant a "View details" modal.
  const inlineChanges = (entry.fieldChanges ?? []).filter(c => !c.isMultiline);
  const multilineChanges = (entry.fieldChanges ?? []).filter(c => c.isMultiline);
  const hasViewDetails = multilineChanges.length > 0 || hasNote;
  const hasSubtext = hasCoverages || (entry.fieldChanges ?? []).length > 0 || hasNote;

  const verb = ACTION_VERB[entry.action];
  const entity = entry.action === "uploaded-doc" ? entry.docName
               : entry.action === "updated-contact" ? entry.contactName
               : entry.action === "posted-note" ? entry.noteTitle
               : null;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => {/* navigate to market detail */}}
      style={{
        background: hover ? color.n08 : "#fff",
        border: `1px solid ${color.n06}`,
        borderRadius: 10,
        transition: "background 0.1s",
        marginBottom: 8,
        cursor: "pointer",
      }}
    >
      <div style={{
        display: "flex", alignItems: "center",
        padding: "0 16px", minHeight: hasSubtext ? 76 : 64, gap: 0,
      }}>
        {/* Featured icon — self-centered */}
        <div style={{ display: "flex", alignSelf: "center", flexShrink: 0 }}>
          <FeaturedIcon type={entry.action} />
        </div>
        <div style={{ width: 12, flexShrink: 0 }} />

        {/* Left cell: avatar + text */}
        <div style={{ flex: "1 1 0", minWidth: 0, display: "flex", alignItems: hasSubtext ? "flex-start" : "center", gap: 10, padding: hasSubtext ? "14px 0" : "0" }}>
          <div style={{ flexShrink: 0, paddingTop: hasSubtext ? 2 : 0 }}>
            <UserAvatar initials={entry.userInitials} color={entry.userColor} size={32} />
          </div>
          <div style={{ minWidth: 0, overflow: "hidden" }}>
            <p style={{ margin: 0, fontSize: 14, lineHeight: "20px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
              <span style={{ fontWeight: 600, color: "#101828" }}>{entry.userName}</span>
              <span style={{ fontWeight: 400, color: "#667085" }}> {verb} </span>
              {entity && <span style={{ fontWeight: 500, color: "#101828" }}>"{entity}"</span>}
            </p>

            {/* Coverage link */}
            {hasCoverages && (
              <button
                onClick={onViewCoverages}
                style={{
                  background: "none", border: "none", cursor: "pointer", padding: 0,
                  display: "inline-flex", alignItems: "center", gap: 4,
                  fontSize: 12, color: color.purple, fontFamily: "inherit", fontWeight: 500,
                  marginTop: 3,
                }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                {entry.newCoverages} new · {entry.totalCoverages} total coverages
              </button>
            )}

            {/* Short field changes — all shown inline, no CTA */}
            {inlineChanges.map((change, i) => (
              <p key={i} style={{ margin: "3px 0 0", fontSize: 13, color: color.n03, lineHeight: "18px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                {change.field} from{" "}
                <span style={{ color: "#f04438" }}>'{change.oldValue}'</span>
                {" "}to{" "}
                <span style={{ color: "#067647" }}>'{change.newValue}'</span>
              </p>
            ))}

            {/* Multiline changes (e.g. description) — label only; full diff in modal */}
            {multilineChanges.map((change, i) => (
              <p key={i} style={{ margin: "3px 0 0", fontSize: 13, color: color.n03, lineHeight: "18px" }}>
                {change.field} updated
              </p>
            ))}

            {/* Note first-line preview */}
            {hasNote && entry.noteContent && (
              <p style={{ margin: "3px 0 0", fontSize: 13, color: color.n04, lineHeight: "18px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", fontStyle: "italic" }}>
                {entry.noteContent.split("\n")[0]}
              </p>
            )}

            {/* "View details" only for description or note */}
            {hasViewDetails && (
              <button
                onClick={onViewDetails}
                style={{
                  background: "none", border: "none", cursor: "pointer", padding: 0,
                  display: "inline-flex", alignItems: "center", gap: 3,
                  fontSize: 12, color: color.purple, fontFamily: "inherit", fontWeight: 500,
                  marginTop: 4, textDecoration: "underline", textDecorationColor: `${color.purple}60`,
                }}
              >
                View details
              </button>
            )}
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 32, background: color.n06, flexShrink: 0, margin: "0 12px" }} />

        {/* Carrier cell */}
        <div style={{ flex: "1 0 0", maxWidth: 240, display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <CarrierLogo initials={entry.carrierInitials} bg={entry.carrierColor} logoUrl={entry.carrierLogo} size={24} />
          <span style={{ fontSize: 14, fontWeight: 400, color: "#101828", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
            {entry.carrierName}
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 32, background: color.n06, flexShrink: 0, margin: "0 12px" }} />

        {/* Timestamp */}
        <div style={{ flex: "0 0 96px", textAlign: "right", fontSize: 13, color: "#98a2b3", whiteSpace: "nowrap" }}>
          {formatRelativeTime(entry.timestamp)}
        </div>

        {/* Chevron */}
        <div style={{ padding: "4px 0 4px 10px", display: "flex", alignItems: "center", flexShrink: 0, color: "#98a2b3" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Coverage modal ───────────────────────────────────────────────────────────

function CoverageModal({ entry, onClose }: { entry: ActivityEntry; onClose: () => void }) {
  const newItems = entry.coverageList?.filter(c => c.isNew) ?? [];
  const existingItems = entry.coverageList?.filter(c => !c.isNew) ?? [];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(16, 24, 40, 0.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 16,
          width: "100%", maxWidth: 560,
          maxHeight: "80vh", display: "flex", flexDirection: "column",
          boxShadow: "0 20px 60px rgba(16,24,40,0.18)",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          padding: "20px 24px 16px", borderBottom: `1px solid ${color.n06}`, flexShrink: 0,
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color.n03} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#101828" }}>{entry.docName}</span>
            </div>
            <div style={{ display: "flex", gap: 12, fontSize: 13, color: color.n03 }}>
              <span>
                <span style={{ fontWeight: 600, color: color.green }}>{entry.newCoverages} new</span>
                {" · "}
                {entry.totalCoverages} total coverages
              </span>
              <span>·</span>
              <span>{entry.carrierName}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none", cursor: "pointer", padding: 4,
              color: color.n03, display: "flex", alignItems: "center", borderRadius: 6,
              flexShrink: 0, marginLeft: 16,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: "auto", padding: "16px 24px 24px" }}>
          {newItems.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: "#fff",
                  background: color.green, borderRadius: 6, padding: "2px 8px",
                }}>
                  New · {newItems.length}
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {newItems.map((c, i) => <CoveragePill key={i} name={c.name} isNew />)}
              </div>
            </div>
          )}
          {existingItems.length > 0 && (
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: color.n04, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 10px" }}>
                Existing · {existingItems.length}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {existingItems.map((c, i) => <CoveragePill key={i} name={c.name} />)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Note modal ───────────────────────────────────────────────────────────────

function NoteModal({ entry, onClose }: { entry: ActivityEntry; onClose: () => void }) {
  const BACKDROP: React.CSSProperties = {
    position: "fixed", inset: 0, zIndex: 1000,
    background: "rgba(16,24,40,0.45)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
  };
  const CARD: React.CSSProperties = {
    background: "#fff", borderRadius: 16,
    width: "100%", maxWidth: 540,
    maxHeight: "80vh", display: "flex", flexDirection: "column",
    boxShadow: "0 20px 60px rgba(16,24,40,0.18)",
  };
  const CLOSE_BTN: React.CSSProperties = {
    background: "none", border: "none", cursor: "pointer", padding: 4,
    color: color.n03, display: "flex", alignItems: "center", borderRadius: 6,
    flexShrink: 0, marginLeft: 16,
  };

  return (
    <div onClick={onClose} style={BACKDROP}>
      <div onClick={e => e.stopPropagation()} style={CARD}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          padding: "20px 24px 16px", borderBottom: `1px solid ${color.n06}`, flexShrink: 0,
        }}>
          <div style={{ minWidth: 0 }}>
            {/* Title row: icon + "Note" + carrier */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
              </svg>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#101828" }}>Note</span>
              <span style={{ color: color.n05, fontSize: 14 }}>·</span>
              <CarrierLogo initials={entry.carrierInitials} bg={entry.carrierColor} logoUrl={entry.carrierLogo} size={18} />
              <span style={{ fontSize: 13, color: color.n03, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.carrierName}</span>
            </div>
            {/* Author + time */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <UserAvatar initials={entry.userInitials} color={entry.userColor} size={20} />
              <span style={{ fontSize: 12, fontWeight: 500, color: color.n02 }}>{entry.userName}</span>
              <span style={{ fontSize: 12, color: color.n05 }}>·</span>
              <span style={{ fontSize: 12, color: color.n04 }}>{formatRelativeTime(entry.timestamp)}</span>
            </div>
          </div>
          <button onClick={onClose} style={CLOSE_BTN}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: "auto", padding: "20px 24px 24px" }}>
          {entry.noteTitle && (
            <p style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 600, color: "#101828", lineHeight: "22px" }}>
              {entry.noteTitle}
            </p>
          )}
          <p style={{ margin: 0, fontSize: 14, color: "#344054", lineHeight: "22px", whiteSpace: "pre-wrap" }}>
            {entry.noteContent}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Field changes modal ───────────────────────────────────────────────────────

function FieldChangesModal({ entry, onClose }: { entry: ActivityEntry; onClose: () => void }) {
  const changes = entry.fieldChanges ?? [];

  const BACKDROP: React.CSSProperties = {
    position: "fixed", inset: 0, zIndex: 1000,
    background: "rgba(16,24,40,0.45)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
  };
  const CARD: React.CSSProperties = {
    background: "#fff", borderRadius: 16,
    width: "100%", maxWidth: 600,
    maxHeight: "80vh", display: "flex", flexDirection: "column",
    boxShadow: "0 20px 60px rgba(16,24,40,0.18)",
  };
  const CLOSE_BTN: React.CSSProperties = {
    background: "none", border: "none", cursor: "pointer", padding: 4,
    color: color.n03, display: "flex", alignItems: "center", borderRadius: 6,
    flexShrink: 0, marginLeft: 16,
  };

  return (
    <div onClick={onClose} style={BACKDROP}>
      <div onClick={e => e.stopPropagation()} style={CARD}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          padding: "20px 24px 16px", borderBottom: `1px solid ${color.n06}`, flexShrink: 0,
        }}>
          <div style={{ minWidth: 0 }}>
            {/* Title row */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#b54708">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#101828" }}>Field Changes</span>
              <span style={{ color: color.n05, fontSize: 14 }}>·</span>
              <CarrierLogo initials={entry.carrierInitials} bg={entry.carrierColor} logoUrl={entry.carrierLogo} size={18} />
              <span style={{ fontSize: 13, color: color.n03, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.carrierName}</span>
            </div>
            {/* Author + time */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <UserAvatar initials={entry.userInitials} color={entry.userColor} size={20} />
              <span style={{ fontSize: 12, fontWeight: 500, color: color.n02 }}>{entry.userName}</span>
              <span style={{ fontSize: 12, color: color.n05 }}>·</span>
              <span style={{ fontSize: 12, color: color.n04 }}>{formatRelativeTime(entry.timestamp)}</span>
            </div>
          </div>
          <button onClick={onClose} style={CLOSE_BTN}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: "auto", padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
          {changes.map((change, i) => (
            <div key={i}>
              {/* Field label */}
              <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: color.n04 }}>
                {change.field}
              </p>

              {change.isMultiline ? (
                /* Stacked before / after panels */
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {/* Before panel */}
                  <div style={{ borderRadius: 8, border: "1px solid #fecdca", background: "#fff5f4", padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#f04438", background: "#fee4e2", borderRadius: 4, padding: "2px 6px" }}>Before</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: "#667085", lineHeight: "20px", textDecoration: "line-through", textDecorationColor: "#f0443860" }}>
                      {change.oldValue}
                    </p>
                  </div>
                  {/* After panel */}
                  <div style={{ borderRadius: 8, border: "1px solid #abefc6", background: "#f6fef9", padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#067647", background: "#dcfae6", borderRadius: 4, padding: "2px 6px" }}>After</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: "#101828", lineHeight: "20px" }}>
                      {change.newValue}
                    </p>
                  </div>
                </div>
              ) : (
                /* Inline arrow diff for short values */
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{
                    fontSize: 13, color: "#f04438", background: "#fff5f4",
                    border: "1px solid #fecdca", borderRadius: 6,
                    padding: "4px 10px", lineHeight: "18px",
                    textDecoration: "line-through", textDecorationColor: "#f0443870",
                    maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {change.oldValue}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color.n04} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                  <span style={{
                    fontSize: 13, color: "#067647", background: "#f6fef9",
                    border: "1px solid #abefc6", borderRadius: 6,
                    padding: "4px 10px", lineHeight: "18px",
                    maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {change.newValue}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Activity tab ─────────────────────────────────────────────────────────────

type DateFilter = "last7" | "last30" | "all";

function ActivityTab() {
  const [typeFilter, setTypeFilter] = useState<ActionType | null>(null);
  const [userFilter, setUserFilter] = useState<string>("All Users");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [dateFilter] = useState<DateFilter>("last7");
  const [modalEntry, setModalEntry] = useState<ActivityEntry | null>(null);
  const [detailsEntry, setDetailsEntry] = useState<ActivityEntry | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const users = ["All Users", ...Array.from(new Set(ACTIVITY_DATA.map(e => e.userName)))];

  const visible = ACTIVITY_DATA.filter(e => {
    if (typeFilter && e.action !== typeFilter) return false;
    if (userFilter !== "All Users" && e.userName !== userFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!e.carrierName.toLowerCase().includes(q) &&
          !e.userName.toLowerCase().includes(q) &&
          !(e.docName?.toLowerCase().includes(q)) &&
          !(e.contactName?.toLowerCase().includes(q))) return false;
    }
    if (dateFilter === "last7") {
      const diffDays = (now.getTime() - e.timestamp.getTime()) / 86400000;
      if (diffDays > 7) return false;
    }
    return true;
  });

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      {modalEntry && <CoverageModal entry={modalEntry} onClose={() => setModalEntry(null)} />}
      {detailsEntry && detailsEntry.action === "posted-note" && (
        <NoteModal entry={detailsEntry} onClose={() => setDetailsEntry(null)} />
      )}
      {detailsEntry && detailsEntry.action !== "posted-note" && (
        <FieldChangesModal entry={detailsEntry} onClose={() => setDetailsEntry(null)} />
      )}

      {/* Filter bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 0 12px", flexShrink: 0, gap: 8,
      }}>
        {/* Left filters */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Active type filter chip */}
          {typeFilter && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 0,
              height: 40, border: `1.5px solid ${color.purple}`,
              borderRadius: 8, padding: "0 6px 0 12px", background: "#fff",
            }}>
              <span style={{ fontSize: 13, color: color.n03 }}>Type: </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: color.purple, marginLeft: 3 }}>
                {ACTION_VERB[typeFilter].replace(/^\w/, c => c.toUpperCase())}
              </span>
              <button
                onClick={() => setTypeFilter(null)}
                style={{
                  background: "none", border: "none", cursor: "pointer", padding: "0 4px",
                  display: "flex", alignItems: "center", color: color.purple, marginLeft: 4,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          )}

          {/* User dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setUserDropdownOpen(v => !v)}
              style={{
                height: 40, padding: "0 10px 0 12px", border: `1px solid ${color.n05}`,
                borderRadius: 8, background: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
                fontSize: 13, color: "#344054", fontFamily: "inherit",
              }}
            >
              {userFilter}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {userDropdownOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 100,
                background: "#fff", border: `1px solid ${color.n06}`, borderRadius: 8,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)", minWidth: 160, overflow: "hidden",
              }}>
                {users.map(u => (
                  <button key={u} onClick={() => { setUserFilter(u); setUserDropdownOpen(false); }} style={{
                    display: "block", width: "100%", textAlign: "left",
                    padding: "8px 14px", fontSize: 13, color: u === userFilter ? color.purple : "#344054",
                    background: u === userFilter ? color.purpleTint : "transparent",
                    border: "none", cursor: "pointer", fontFamily: "inherit",
                    fontWeight: u === userFilter ? 600 : 400,
                  }}>
                    {u}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: search + date */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color.n04} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <input
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
              placeholder="Search..."
              style={{
                width: 180, height: 40, padding: "0 10px 0 32px",
                border: `1px solid ${searchFocused ? color.purple : color.n05}`,
                borderRadius: 8, fontSize: 13, color: color.n01, background: "#fff",
                outline: "none", fontFamily: "inherit",
                boxShadow: searchFocused ? `0 0 0 3px ${color.purpleTint}` : "none",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
            />
          </div>
          <button style={{
            height: 40, padding: "0 14px", border: `1px solid ${color.n05}`,
            borderRadius: 8, background: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 7,
            fontSize: 13, color: "#344054", fontFamily: "inherit",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color.n03} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Last 7 days
          </button>
        </div>
      </div>

      {/* Feed */}
      <div style={{ flex: 1, overflowY: "auto" }} onClick={() => setUserDropdownOpen(false)}>
        {visible.length === 0 ? (
          <div style={{ padding: "48px 0", textAlign: "center", color: color.n03, fontSize: 14 }}>
            No activity matches your filters.
          </div>
        ) : (
          visible.map(entry => (
            <ActivityRow
              key={entry.id}
              entry={entry}
              onViewCoverages={(e) => {
                e.stopPropagation();
                setModalEntry(entry);
              }}
              onViewDetails={(e) => {
                e.stopPropagation();
                setDetailsEntry(entry);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ─── Markets tab ──────────────────────────────────────────────────────────────

function ProductPill({ label }: { label: string }) {
  const isOverflow = label.startsWith("+");
  return (
    <span style={{
      fontSize: 12, fontWeight: 500,
      background: color.n07, color: isOverflow ? color.n03 : color.n02,
      borderRadius: 6, padding: "3px 8px", whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

function MarketsTab({ searchQuery }: { searchQuery: string }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [rowHover, setRowHover] = useState<string | null>(null);
  const [localSearch, setLocalSearch] = useState("");
  const [localFocused, setLocalFocused] = useState(false);

  const q = (searchQuery || localSearch).toLowerCase();
  const filtered = q
    ? CARRIERS.filter(c => c.name.toLowerCase().includes(q) || c.products.some(p => p.toLowerCase().includes(q)))
    : CARRIERS;

  const allSelected = filtered.length > 0 && filtered.every(c => selected.has(c.id));
  const toggleAll = () => {
    if (allSelected) setSelected(prev => { const s = new Set(prev); filtered.forEach(c => s.delete(c.id)); return s; });
    else setSelected(prev => { const s = new Set(prev); filtered.forEach(c => s.add(c.id)); return s; });
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      <div style={{ padding: "16px 0 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: color.n01 }}>All Carriers</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color.n03} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <input
              value={localSearch} onChange={e => setLocalSearch(e.target.value)}
              onFocus={() => setLocalFocused(true)} onBlur={() => setLocalFocused(false)}
              placeholder="Search carriers..."
              style={{
                width: 176, height: 36, padding: "0 12px 0 30px",
                border: `1px solid ${localFocused ? color.purple : color.n06}`,
                borderRadius: 8, fontSize: 13, color: color.n01,
                background: "#fff", outline: "none", fontFamily: "inherit",
                boxShadow: localFocused ? `0 0 0 3px ${color.purpleTint}` : "none",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
            />
          </div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", marginTop: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "48px 1fr 1fr 56px", borderBottom: `1px solid ${color.n06}`, background: color.n08 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 44 }}>
            <Checkbox checked={allSelected} onChange={toggleAll} />
          </div>
          <TH label="Carrier" /><TH label="Products" /><div />
        </div>
        {filtered.map(carrier => {
          const isSel = selected.has(carrier.id);
          const isHov = rowHover === carrier.id;
          return (
            <div key={carrier.id} onMouseEnter={() => setRowHover(carrier.id)} onMouseLeave={() => setRowHover(null)}
              style={{ display: "grid", gridTemplateColumns: "48px 1fr 1fr 56px", borderBottom: `1px solid ${color.n07}`, background: isSel ? "#faf9ff" : isHov ? color.n08 : "#fff", minHeight: 68, transition: "background 0.1s" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Checkbox checked={isSel} onChange={() => setSelected(prev => { const s = new Set(prev); s.has(carrier.id) ? s.delete(carrier.id) : s.add(carrier.id); return s; })} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 24px" }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, flexShrink: 0, background: color.purpleTint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: color.purple }}>{carrier.initial}</div>
                <span style={{ fontSize: 14, fontWeight: 500, color: color.n01 }}>{carrier.name}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6, padding: "12px 24px" }}>
                {carrier.products.slice(0, 3).map((p, i) => <ProductPill key={i} label={p} />)}
                {carrier.products.length > 3 && <ProductPill label={`+${carrier.products.length - 3}`} />}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <KebabBtn />
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 0", gap: 8 }}>
            <span style={{ fontSize: 14, color: color.n03 }}>No carriers found</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <div onClick={onChange} style={{ width: 16, height: 16, borderRadius: 4, cursor: "pointer", border: `1.5px solid ${checked ? color.purple : color.n05}`, background: checked ? color.purple : "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.1s, background 0.1s" }}>
      {checked && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
    </div>
  );
}

function TH({ label }: { label: string }) {
  return <div style={{ padding: "0 24px", display: "flex", alignItems: "center", height: 44 }}><span style={{ fontSize: 11, fontWeight: 600, color: color.n03, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span></div>;
}

function KebabBtn() {
  const [hover, setHover] = useState(false);
  return (
    <button onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ width: 28, height: 28, borderRadius: 6, border: "none", background: hover ? color.n07 : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.12s" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color.n03} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
      </svg>
    </button>
  );
}

// ─── Empty tab ────────────────────────────────────────────────────────────────

function EmptyTab({ title, message }: { title: string; message: string }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: color.purpleTint, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color.purple} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="3"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: color.n01, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 13, color: color.n03, maxWidth: 280 }}>{message}</div>
      </div>
    </div>
  );
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string }[] = [
  { id: "markets",  label: "Markets" },
  { id: "assets",   label: "Assets" },
  { id: "contacts", label: "Contacts" },
  { id: "activity", label: "Activity" },
];

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${color.n06}`, flexShrink: 0 }}>
      {/* Tabs */}
      <div style={{ display: "flex" }}>
        {TABS.map(tab => {
          const isActive = tab.id === active;
          return (
            <button key={tab.id} onClick={() => onChange(tab.id)} style={{
              height: 44, padding: "0 14px", background: "transparent", border: "none", cursor: "pointer",
              fontSize: 14, fontWeight: 500, fontFamily: "inherit",
              color: isActive ? color.purple : color.n01,
              borderBottom: isActive ? `2px solid ${color.purple}` : "2px solid transparent",
              marginBottom: -1, transition: "color 0.12s, border-color 0.12s",
            }}>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button style={{
          height: 36, padding: "0 14px", borderRadius: 8,
          border: `1px solid ${color.n06}`, background: "#fff",
          fontSize: 13, fontWeight: 500, color: color.n02, cursor: "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export to Excel
        </button>
        <button style={{
          height: 36, padding: "0 14px", borderRadius: 8,
          border: "none", background: color.purple,
          fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add
        </button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function MarketPage() {
  const [activeTab, setActiveTab] = useState<Tab>("activity");
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#fff", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Hero search area — lavender background */}
      <div style={{
        background: "#f0effe",
        padding: "36px 0 28px",
        display: "flex", flexDirection: "column", alignItems: "center",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e05c2a" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <h1 style={{ fontSize: 30, fontWeight: 700, color: color.n01, lineHeight: "38px", margin: 0 }}>Market Search</h1>
        </div>
        <p style={{ fontSize: 14, color: color.n03, textAlign: "center", margin: "0 0 20px", lineHeight: "20px" }}>
          Ask me anything about insurance properties, autos, businesses, life or unique risks.<br />
          Get matched with suitable coverages across providers.
        </p>
        {/* Search bar */}
        <div style={{ position: "relative", width: 560 }}>
          <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color.n04} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <input
            type="text" value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Eg: Who offers general liability insurance for builders?"
            style={{
              width: "100%", height: 48, padding: "0 40px 0 40px",
              border: `1px solid ${searchFocused || search ? color.purple : "#ddd"}`,
              borderRadius: 10, fontSize: 14, color: color.n01, background: "#fff",
              outline: "none", fontFamily: "inherit", boxSizing: "border-box",
              boxShadow: searchFocused ? `0 0 0 3px ${color.purpleTint}` : "0 1px 4px rgba(0,0,0,0.08)",
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 4, borderRadius: 4 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color.n03} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Content area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, padding: "0 40px", maxWidth: 1200, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        {/* Tab bar with action buttons */}
        <TabBar active={activeTab} onChange={setActiveTab} />

        {/* Tab content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
          {activeTab === "markets"  && <MarketsTab searchQuery={search} />}
          {activeTab === "assets"   && <EmptyTab title="No assets yet" message="Uploaded policy documents and files will appear here once added." />}
          {activeTab === "contacts" && <EmptyTab title="No contacts yet" message="Carrier contacts and underwriter details will appear here once added." />}
          {activeTab === "activity" && <ActivityTab />}
        </div>
      </div>
    </div>
  );
}
