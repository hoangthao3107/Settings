import { useState } from "react";
import {
  IconChevronRight, IconShare, IconBookmark, IconBookText,
  IconGraduation, IconMessageWarning, IconBell,
} from "./icons";

function IconButton({ children }: { children: React.ReactNode }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 40, height: 40, borderRadius: 8, border: "none",
        background: hover ? "#f5f5f5" : "transparent", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", transition: "background 0.15s ease",
      }}
    >
      {children}
    </button>
  );
}

export default function GlobalHeader({ title }: { title?: string }) {
  const [shareHover, setShareHover] = useState(false);
  const pageTitle = title ?? "Sales Performance Dashboard";
  const showBreadcrumb = !title || title === "Sales Performance Dashboard";

  return (
    <header style={{
      height: 64, background: "#fff", borderBottom: "1px solid #e7ebee",
      padding: "12px 32px", display: "flex", alignItems: "center",
      justifyContent: "space-between", flexShrink: 0,
    }}>
      {/* Title / Breadcrumbs */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {showBreadcrumb && (
          <>
            <span style={{ color: "#6a758a", fontSize: 16, fontWeight: 500 }}>Dashboard</span>
            <IconChevronRight size={16} color="#9aa5b4" />
          </>
        )}
        <span style={{ color: "#343839", fontSize: 16, fontWeight: 600 }}>
          {pageTitle}
        </span>
        {showBreadcrumb && (
          <button
            onMouseEnter={() => setShareHover(true)}
            onMouseLeave={() => setShareHover(false)}
            style={{
              marginLeft: 12, height: 32, padding: "8px 16px", borderRadius: 8,
              border: "1px solid #e7ebee", background: shareHover ? "#f5f5f5" : "#fff",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
              color: "#525965", fontSize: 14, fontWeight: 500, fontFamily: "inherit",
              transition: "background 0.15s ease",
            }}
          >
            <IconShare size={14} color="#525965" />
            Share
          </button>
        )}
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <IconButton><IconBookmark size={20} color="#525965" /></IconButton>
        <IconButton><IconBookText size={20} color="#525965" /></IconButton>
        <IconButton><IconGraduation size={20} color="#525965" /></IconButton>
        <IconButton><IconMessageWarning size={20} color="#525965" /></IconButton>
        <div style={{ position: "relative" }}>
          <IconButton><IconBell size={20} color="#525965" /></IconButton>
          <div style={{
            position: "absolute", top: 4, right: 4, width: 16, height: 16,
            borderRadius: "50%", background: "#f04438", border: "1.5px solid #fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 11, fontWeight: 600, lineHeight: 1,
          }}>3</div>
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: 48, background: "#ffbc99",
          marginLeft: 8, display: "flex", alignItems: "center", justifyContent: "center",
          color: "#8a4a2f", fontWeight: 600, fontSize: 14,
        }}>LN</div>
      </div>
    </header>
  );
}
