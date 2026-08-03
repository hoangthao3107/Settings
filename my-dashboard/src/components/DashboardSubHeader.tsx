import { color, font } from "../tokens";

type Props = {
  title: string;
  editMode: boolean;
  onToggleEditMode: () => void;
};

export default function DashboardSubHeader({ title, editMode, onToggleEditMode }: Props) {
  return (
    <div style={{
      background: color.white, borderBottom: `1px solid ${color.n06}`,
      padding: "16px 32px", display: "flex", alignItems: "center",
      justifyContent: "space-between", flexShrink: 0,
    }}>
      <h1 style={{
        margin: 0,
        fontFamily: font.family,
        fontSize: font.textLgSemibold.fontSize,
        lineHeight: font.textLgSemibold.lineHeight,
        fontWeight: font.textLgSemibold.fontWeight,
        color: color.n01,
      }}>{title}</h1>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={onToggleEditMode}
          style={{
            height: 36, padding: "8px 12px", borderRadius: 8,
            border: `1px solid ${color.n06}`, background: color.white, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 10,
            fontFamily: font.family,
          }}
        >
          <div style={{
            width: 28, height: 16, borderRadius: 999,
            background: editMode ? color.purple : color.n05,
            position: "relative", transition: "background 0.2s ease", flexShrink: 0,
          }}>
            <div style={{
              position: "absolute", top: 2, left: editMode ? 14 : 2,
              width: 12, height: 12, borderRadius: "50%", background: color.white,
              transition: "left 0.2s ease",
              boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
            }} />
          </div>
          <span style={{
            fontSize: 14, lineHeight: "20px", fontWeight: 500, color: color.n02,
          }}>
            Edit mode
          </span>
        </button>

        <button style={{
          height: 36, padding: "8px 12px", borderRadius: 8,
          border: `1px solid ${color.n06}`, background: color.white, cursor: "pointer",
          fontFamily: font.family, fontSize: 14, fontWeight: 500, color: color.n02,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          Trailing 12 months
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        <button style={{
          height: 36, padding: "8px 12px", borderRadius: 8,
          border: `1px solid ${color.n06}`, background: color.white, cursor: "pointer",
          fontFamily: font.family, fontSize: 14, fontWeight: 500, color: color.n02,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filter
        </button>

        <button style={{
          width: 36, height: 36, borderRadius: 8,
          border: `1px solid ${color.n06}`, background: color.white, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: color.n02,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>
      </div>
    </div>
  );
}
