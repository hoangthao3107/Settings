import { useState, forwardRef } from "react";
import { IconGrip, IconMoreVertical } from "./icons";

type Props = {
  editMode: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  // react-grid-layout injects these
  onMouseDown?: React.MouseEventHandler;
  onMouseUp?: React.MouseEventHandler;
  onTouchEnd?: React.TouchEventHandler;
};

const WidgetWrapper = forwardRef<HTMLDivElement, Props>(function WidgetWrapper(
  { editMode, children, style, className, onMouseDown, onMouseUp, onTouchEnd, ...rest },
  ref,
) {
  const [hover, setHover] = useState(false);
  const showHandles = editMode;
  const glow = editMode && hover;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        background: "#fff",
        border: `1px solid ${glow ? "#6a56f0" : "#e7ebee"}`,
        borderRadius: 12,
        boxShadow: glow ? "0 0 0 2px rgba(106,86,240,0.12)" : "none",
        cursor: editMode ? (hover ? "grab" : "default") : "default",
        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchEnd={onTouchEnd}
      {...rest}
    >
      {/* Drag handle — top center */}
      {showHandles && (
        <div
          className="widget-drag-handle"
          style={{
            position: "absolute", top: 4, left: "50%", transform: "translateX(-50%)",
            width: 32, height: 18, borderRadius: 6,
            background: hover ? "#eae7fe" : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "grab", zIndex: 2, color: "#6a56f0",
          }}
        >
          <IconGrip size={14} color="#6a56f0" />
        </div>
      )}

      {/* Menu — top right */}
      {showHandles && (
        <button
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position: "absolute", top: 8, right: 8, zIndex: 2,
            width: 24, height: 24, borderRadius: 6, border: "none",
            background: "transparent", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <IconMoreVertical size={16} color="#6a758a" />
        </button>
      )}

      {/* Content */}
      <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
        {children}
      </div>

      {/* Resize handle — bottom right (react-grid-layout styles it via .react-resizable-handle) */}
    </div>
  );
});

export default WidgetWrapper;
