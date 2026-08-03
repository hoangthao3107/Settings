import { useState } from "react";
import { color, font, radius } from "../tokens";

// ─── Types ────────────────────────────────────────────────────────────────────

type BuilderMode = "header" | "footer";

type ContentZone = "left" | "center" | "right";

interface ZoneContent {
  type: "logo" | "nav" | "text" | "button" | "image" | "empty";
  label: string;
}

interface ZoneStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: "400" | "500" | "600" | "700";
  color: string;
  bgColor: string;
  padding: number;
  align: "left" | "center" | "right";
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CONTENT_OPTIONS: { type: ZoneContent["type"]; label: string; icon: string }[] = [
  { type: "empty",  label: "Empty",      icon: "⬜" },
  { type: "logo",   label: "Logo",       icon: "🔷" },
  { type: "nav",    label: "Navigation", icon: "☰" },
  { type: "text",   label: "Text",       icon: "T" },
  { type: "button", label: "Button",     icon: "⬛" },
  { type: "image",  label: "Image",      icon: "🖼" },
];

const FONT_OPTIONS = ["Inter", "Georgia", "Playfair Display", "DM Sans", "Roboto"];

const DEFAULT_ZONE_CONTENT: Record<ContentZone, ZoneContent> = {
  left:   { type: "logo",  label: "Logo" },
  center: { type: "nav",   label: "Navigation" },
  right:  { type: "button", label: "Button" },
};

const DEFAULT_ZONE_STYLE: ZoneStyle = {
  fontFamily: "Inter",
  fontSize: 14,
  fontWeight: "500",
  color: "#343839",
  bgColor: "#ffffff",
  padding: 16,
  align: "left",
};

// ─── Preview ──────────────────────────────────────────────────────────────────

function ZonePreview({ zone, content, style, isSelected, onClick }: {
  zone: ContentZone;
  content: ZoneContent;
  style: ZoneStyle;
  isSelected: boolean;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);

  const renderContent = () => {
    switch (content.type) {
      case "logo":
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: color.purple, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>O</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: style.color }}>Outmarket</span>
          </div>
        );
      case "nav":
        return (
          <div style={{ display: "flex", gap: 16 }}>
            {["Home", "Solutions", "Pricing"].map(item => (
              <span key={item} style={{ fontSize: 13, color: style.color, fontWeight: Number(style.fontWeight) as number }}>
                {item}
              </span>
            ))}
          </div>
        );
      case "button":
        return (
          <button style={{ padding: "6px 14px", borderRadius: 6, background: color.purple, color: "#fff", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
            Get Started
          </button>
        );
      case "text":
        return <span style={{ fontSize: 13, color: style.color }}>Custom text</span>;
      case "image":
        return <div style={{ width: 60, height: 28, borderRadius: 4, background: color.n06, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 10, color: color.n03 }}>img</span>
        </div>;
      default:
        return <span style={{ fontSize: 12, color: color.n05 }}>Empty zone</span>;
    }
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        flex: zone === "center" ? 1.5 : 1,
        minWidth: 0,
        padding: "0 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: zone === "center" ? "center" : zone === "right" ? "flex-end" : "flex-start",
        cursor: "pointer",
        borderRadius: 6,
        outline: isSelected
          ? `2px solid ${color.purple}`
          : hover ? `1.5px dashed ${color.n05}` : "1.5px dashed transparent",
        transition: "outline 0.12s",
        position: "relative",
      }}
    >
      {renderContent()}
      {isSelected && (
        <div style={{
          position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)",
          background: color.purple, color: "#fff",
          fontSize: 10, fontWeight: 600, padding: "1px 7px", borderRadius: 100,
          whiteSpace: "nowrap", pointerEvents: "none",
        }}>
          {zone.charAt(0).toUpperCase() + zone.slice(1)}
        </div>
      )}
    </div>
  );
}

function HeaderPreview({ mode, zoneContents, zoneStyles, selectedZone, onSelectZone }: {
  mode: BuilderMode;
  zoneContents: Record<ContentZone, ZoneContent>;
  zoneStyles: Record<ContentZone, ZoneStyle>;
  selectedZone: ContentZone;
  onSelectZone: (z: ContentZone) => void;
}) {
  const selectedStyle = zoneStyles[selectedZone];

  return (
    <div style={{
      flex: 1,
      background: "#f0f1f5",
      backgroundImage: "radial-gradient(circle, #c8cad4 1px, transparent 1px)",
      backgroundSize: "24px 24px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Mode label */}
      <div style={{
        position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: 4,
        background: color.white,
        border: `1px solid ${color.n06}`,
        borderRadius: 8,
        padding: 3,
      }}>
        {(["header", "footer"] as BuilderMode[]).map(m => (
          <div key={m} style={{
            padding: "4px 14px",
            borderRadius: 6,
            fontSize: 13, fontWeight: 500,
            background: mode === m ? color.purpleTint : "transparent",
            color: mode === m ? color.purple : color.n03,
            cursor: "default",
          }}>
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </div>
        ))}
      </div>

      {/* Preview frame */}
      <div style={{
        width: 800, maxWidth: "90%",
        background: color.white,
        borderRadius: 8,
        boxShadow: "0 2px 24px rgba(0,0,0,0.10)",
        overflow: "hidden",
      }}>
        {/* Top bar (simulated page top) */}
        <div style={{ height: 8, background: color.n08, borderBottom: `1px solid ${color.n06}` }} />

        {/* Header/Footer bar */}
        <div style={{
          height: 56,
          background: selectedStyle.bgColor,
          borderBottom: mode === "header" ? `1px solid ${color.n06}` : undefined,
          borderTop: mode === "footer" ? `1px solid ${color.n06}` : undefined,
          display: "flex",
          alignItems: "center",
          padding: `0 ${selectedStyle.padding}px`,
          gap: 8,
        }}>
          {(["left", "center", "right"] as ContentZone[]).map(z => (
            <ZonePreview
              key={z}
              zone={z}
              content={zoneContents[z]}
              style={zoneStyles[z]}
              isSelected={selectedZone === z}
              onClick={() => onSelectZone(z)}
            />
          ))}
        </div>

        {/* Page body placeholder */}
        <div style={{
          height: 160,
          background: color.white,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: 20,
        }}>
          {[100, 80, 90, 60].map((w, i) => (
            <div key={i} style={{ height: 10, borderRadius: 4, background: color.n08, width: `${w}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Panel section heading ─────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 600, color: color.n03, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
      {children}
    </div>
  );
}

// ─── Color swatch picker ───────────────────────────────────────────────────────

const PALETTE = ["#ffffff", "#f9fafb", "#343839", "#6a56f0", "#1570ef", "#12b76a", "#f04438", "#ED7D2D"];

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
      <span style={{ fontSize: 13, color: color.n02 }}>{label}</span>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {PALETTE.map(c => (
          <button
            key={c}
            onClick={() => onChange(c)}
            style={{
              width: 20, height: 20, borderRadius: 4,
              background: c,
              border: value === c ? `2px solid ${color.purple}` : `1.5px solid ${color.n06}`,
              cursor: "pointer", padding: 0, flexShrink: 0,
              boxShadow: value === c ? `0 0 0 2px ${color.purpleTint}` : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Right panel ─────────────────────────────────────────────────────────────

function BuilderPanel({ selectedZone, content, style, onContentChange, onStyleChange }: {
  selectedZone: ContentZone;
  content: ZoneContent;
  style: ZoneStyle;
  onContentChange: (c: ZoneContent) => void;
  onStyleChange: (s: ZoneStyle) => void;
}) {
  return (
    <div style={{
      width: 280,
      flexShrink: 0,
      background: color.white,
      borderLeft: `1px solid ${color.n06}`,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      {/* Panel header */}
      <div style={{
        padding: "14px 16px",
        borderBottom: `1px solid ${color.n06}`,
        flexShrink: 0,
      }}>
        <div style={{ ...font.textSmMedium, color: color.n01 }}>
          {selectedZone.charAt(0).toUpperCase() + selectedZone.slice(1)} Zone
        </div>
        <div style={{ ...font.textXsRegular, color: color.n03, marginTop: 2 }}>
          Content &amp; style settings
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── Content Zone ─────────────────────────────────── */}
        <div>
          <SectionLabel>Content zone</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
            {CONTENT_OPTIONS.map(opt => {
              const isSelected = content.type === opt.type;
              return (
                <button
                  key={opt.type}
                  onClick={() => onContentChange({ type: opt.type, label: opt.label })}
                  style={{
                    padding: "8px 4px",
                    borderRadius: 8,
                    border: `1.5px solid ${isSelected ? color.purple : color.n06}`,
                    background: isSelected ? color.purpleTint : color.white,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    transition: "border-color 0.12s, background 0.12s",
                  }}
                >
                  <span style={{ fontSize: 16 }}>{opt.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: isSelected ? 600 : 400, color: isSelected ? color.purple : color.n02 }}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Divider ─────────────────────────────────────── */}
        <div style={{ height: 1, background: color.n06 }} />

        {/* ── Typography ───────────────────────────────────── */}
        <div>
          <SectionLabel>Typography</SectionLabel>

          {/* Font family */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 12, color: color.n03, marginBottom: 4 }}>Font</div>
            <select
              value={style.fontFamily}
              onChange={e => onStyleChange({ ...style, fontFamily: e.target.value })}
              style={{
                width: "100%", height: 32, borderRadius: 6,
                border: `1px solid ${color.n06}`, padding: "0 8px",
                fontSize: 13, color: color.n01, background: color.white,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          {/* Font size + weight row */}
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: color.n03, marginBottom: 4 }}>Size</div>
              <div style={{ display: "flex", alignItems: "center", border: `1px solid ${color.n06}`, borderRadius: 6, overflow: "hidden", height: 32 }}>
                <button onClick={() => onStyleChange({ ...style, fontSize: Math.max(8, style.fontSize - 1) })}
                  style={{ width: 28, height: "100%", border: "none", background: color.n08, cursor: "pointer", color: color.n02, fontSize: 14, flexShrink: 0 }}>−</button>
                <span style={{ flex: 1, textAlign: "center", fontSize: 13, color: color.n01 }}>{style.fontSize}</span>
                <button onClick={() => onStyleChange({ ...style, fontSize: Math.min(48, style.fontSize + 1) })}
                  style={{ width: 28, height: "100%", border: "none", background: color.n08, cursor: "pointer", color: color.n02, fontSize: 14, flexShrink: 0 }}>+</button>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: color.n03, marginBottom: 4 }}>Weight</div>
              <select
                value={style.fontWeight}
                onChange={e => onStyleChange({ ...style, fontWeight: e.target.value as ZoneStyle["fontWeight"] })}
                style={{ width: "100%", height: 32, borderRadius: 6, border: `1px solid ${color.n06}`, padding: "0 8px", fontSize: 13, color: color.n01, background: color.white, cursor: "pointer", fontFamily: "inherit" }}
              >
                <option value="400">Regular</option>
                <option value="500">Medium</option>
                <option value="600">Semibold</option>
                <option value="700">Bold</option>
              </select>
            </div>
          </div>

          {/* Text align */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 12, color: color.n03, marginBottom: 4 }}>Align</div>
            <div style={{ display: "flex", gap: 4 }}>
              {(["left", "center", "right"] as const).map(a => (
                <button
                  key={a}
                  onClick={() => onStyleChange({ ...style, align: a })}
                  style={{
                    flex: 1, height: 32, borderRadius: 6,
                    border: `1.5px solid ${style.align === a ? color.purple : color.n06}`,
                    background: style.align === a ? color.purpleTint : color.white,
                    cursor: "pointer", fontSize: 12,
                    color: style.align === a ? color.purple : color.n02,
                    fontFamily: "inherit",
                  }}
                >
                  {a === "left" ? "⬅" : a === "center" ? "↔" : "➡"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Divider ─────────────────────────────────────── */}
        <div style={{ height: 1, background: color.n06 }} />

        {/* ── Colors ───────────────────────────────────────── */}
        <div>
          <SectionLabel>Colors</SectionLabel>
          <ColorRow label="Text color" value={style.color} onChange={v => onStyleChange({ ...style, color: v })} />
          <ColorRow label="Background" value={style.bgColor} onChange={v => onStyleChange({ ...style, bgColor: v })} />
        </div>

        {/* ── Divider ─────────────────────────────────────── */}
        <div style={{ height: 1, background: color.n06 }} />

        {/* ── Spacing ──────────────────────────────────────── */}
        <div>
          <SectionLabel>Spacing</SectionLabel>
          <div style={{ fontSize: 12, color: color.n03, marginBottom: 4 }}>Padding</div>
          <div style={{ display: "flex", alignItems: "center", border: `1px solid ${color.n06}`, borderRadius: 6, overflow: "hidden", height: 32 }}>
            <button onClick={() => onStyleChange({ ...style, padding: Math.max(0, style.padding - 4) })}
              style={{ width: 32, height: "100%", border: "none", background: color.n08, cursor: "pointer", color: color.n02, fontSize: 14, flexShrink: 0 }}>−</button>
            <span style={{ flex: 1, textAlign: "center", fontSize: 13, color: color.n01 }}>{style.padding}px</span>
            <button onClick={() => onStyleChange({ ...style, padding: Math.min(64, style.padding + 4) })}
              style={{ width: 32, height: "100%", border: "none", background: color.n08, cursor: "pointer", color: color.n02, fontSize: 14, flexShrink: 0 }}>+</button>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div style={{
        padding: "12px 16px",
        borderTop: `1px solid ${color.n06}`,
        display: "flex",
        gap: 8,
        flexShrink: 0,
      }}>
        <button style={{
          flex: 1, height: 34, borderRadius: radius.sm,
          border: `1px solid ${color.n06}`, background: color.white,
          cursor: "pointer", fontSize: 13, fontWeight: 500, color: color.n02,
          fontFamily: "inherit",
        }}>
          Reset
        </button>
        <button style={{
          flex: 2, height: 34, borderRadius: radius.sm,
          border: "none", background: color.purple,
          cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#fff",
          fontFamily: "inherit",
        }}>
          Save changes
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HeaderFooterBuilderPage() {
  const [mode] = useState<BuilderMode>("header");
  const [selectedZone, setSelectedZone] = useState<ContentZone>("left");

  const [zoneContents, setZoneContents] = useState<Record<ContentZone, ZoneContent>>(DEFAULT_ZONE_CONTENT);
  const [zoneStyles, setZoneStyles] = useState<Record<ContentZone, ZoneStyle>>({
    left:   { ...DEFAULT_ZONE_STYLE },
    center: { ...DEFAULT_ZONE_STYLE },
    right:  { ...DEFAULT_ZONE_STYLE },
  });

  const updateContent = (c: ZoneContent) =>
    setZoneContents(prev => ({ ...prev, [selectedZone]: c }));

  const updateStyle = (s: ZoneStyle) =>
    setZoneStyles(prev => ({ ...prev, [selectedZone]: s }));

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
      <HeaderPreview
        mode={mode}
        zoneContents={zoneContents}
        zoneStyles={zoneStyles}
        selectedZone={selectedZone}
        onSelectZone={setSelectedZone}
      />
      <BuilderPanel
        selectedZone={selectedZone}
        content={zoneContents[selectedZone]}
        style={zoneStyles[selectedZone]}
        onContentChange={updateContent}
        onStyleChange={updateStyle}
      />
    </div>
  );
}
