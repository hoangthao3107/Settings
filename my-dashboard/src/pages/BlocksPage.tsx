import { useState } from "react";
import { color, font, radius } from "../tokens";
import {
  IconSparkle, IconType, IconShapes, IconImage, IconHash,
  IconGrid, IconCode, IconLayers, IconHistory,
} from "../components/icons";
import ImageLibraryPopover from "../components/ImageLibraryPopover";

// ─── FAB config ───────────────────────────────────────────────────────────────

type FabId = "ai" | "text" | "shapes" | "image" | "frame" | "components" | "code" | "layers" | "history";

const FAB_ITEMS: { id: FabId; icon: React.FC<{ size?: number; color?: string }>; label: string }[] = [
  { id: "ai",         icon: IconSparkle,  label: "AI Assistant" },
  { id: "text",       icon: IconType,     label: "Text" },
  { id: "shapes",     icon: IconShapes,   label: "Shapes" },
  { id: "image",      icon: IconImage,    label: "Images" },
  { id: "frame",      icon: IconHash,     label: "Frame" },
  { id: "components", icon: IconGrid,     label: "Components" },
  { id: "code",       icon: IconCode,     label: "Code" },
  { id: "layers",     icon: IconLayers,   label: "Layers" },
  { id: "history",    icon: IconHistory,  label: "History" },
];

// ─── Layers placeholder panel ─────────────────────────────────────────────────

function LayersPanel() {
  return (
    <div style={{
      position: "absolute", right: 88, top: 16,
      width: 320, background: color.white, borderRadius: radius.md,
      boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
      zIndex: 100, overflow: "hidden",
    }}>
      <div style={{
        padding: "14px 16px",
        borderBottom: `1px solid ${color.n06}`,
        ...font.textMdSemibold, color: color.n01,
      }}>
        Layers
      </div>
      <div style={{
        padding: 48, textAlign: "center",
        ...font.textSmRegular, color: color.n03,
      }}>
        No layers yet
      </div>
    </div>
  );
}

// ─── FAB group ────────────────────────────────────────────────────────────────

function FabGroup({
  activeFab,
  onFabClick,
}: {
  activeFab: FabId | null;
  onFabClick: (id: FabId) => void;
}) {
  const [hovered, setHovered] = useState<FabId | null>(null);

  return (
    <div style={{
      position: "absolute", right: 16, top: 16,
      background: color.white, borderRadius: 16,
      boxShadow: "0 4px 20px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
      display: "flex", flexDirection: "column",
      padding: "6px 0", zIndex: 200,
    }}>
      {FAB_ITEMS.map((item, idx) => {
        const isActive = activeFab === item.id;
        const isHovered = hovered === item.id;
        const IconComp = item.icon;
        const iconColor = isActive ? "#fff" : isHovered ? color.n01 : color.n02;
        const bg = isActive ? color.purple : isHovered ? color.n08 : "transparent";

        return (
          <button
            key={item.id}
            title={item.label}
            onClick={() => onFabClick(item.id)}
            onMouseEnter={() => setHovered(item.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              width: 52, height: 52,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: bg, border: "none", cursor: "pointer",
              borderRadius: 12, margin: "1px 6px",
              transition: "background 0.12s",
              // Subtle divider between AI and text
              ...(idx === 0 ? { marginBottom: 2 } : {}),
            }}
          >
            <IconComp size={22} color={iconColor} />
          </button>
        );
      })}
    </div>
  );
}

// ─── Canvas ───────────────────────────────────────────────────────────────────

function BlocksCanvas() {
  return (
    <div style={{
      flex: 1, position: "relative",
      background: "#f0f1f5",
      backgroundImage: "radial-gradient(circle, #c8cad4 1px, transparent 1px)",
      backgroundSize: "24px 24px",
      overflow: "hidden",
    }}>
      {/* Placeholder slide/frame on the canvas */}
      <div style={{
        position: "absolute",
        left: "50%", top: "50%",
        transform: "translate(-60%, -50%)",
        width: 640, height: 400,
        background: color.white,
        borderRadius: 8,
        boxShadow: "0 2px 24px rgba(0,0,0,0.10)",
      }} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlocksPage() {
  const [activeFab, setActiveFab] = useState<FabId | null>(null);

  const handleFabClick = (id: FabId) => {
    setActiveFab(prev => (prev === id ? null : id));
  };

  return (
    <div style={{ flex: 1, position: "relative", display: "flex", overflow: "hidden" }}>
      <BlocksCanvas />

      {/* Popovers */}
      {activeFab === "image" && (
        <ImageLibraryPopover
          onClose={() => setActiveFab(null)}
          onInsert={(img) => {
            // TODO: place image on canvas
            console.log("Insert image:", img.name);
            setActiveFab(null);
          }}
        />
      )}

      {activeFab === "layers" && (
        <LayersPanel />
      )}

      <FabGroup activeFab={activeFab} onFabClick={handleFabClick} />
    </div>
  );
}
