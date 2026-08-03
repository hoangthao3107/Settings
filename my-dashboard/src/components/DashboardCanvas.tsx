import { useEffect, useRef, useState } from "react";
import GridLayout, { type Layout, type LayoutItem } from "react-grid-layout";
import WidgetWrapper from "./WidgetWrapper";
import { KpiCard, StackedBarChart, DonutChart, AreaChart } from "../widgets/widgets";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const MAX_WIDTH = 1440;
const COLS = 12;
const ROW_HEIGHT = 60;
const MARGIN: [number, number] = [16, 16];

const DEFAULT_LAYOUT: Layout = [
  { i: "kpi-1", x: 0, y: 0, w: 4, h: 3, minW: 3, minH: 2 },
  { i: "kpi-2", x: 4, y: 0, w: 4, h: 3, minW: 3, minH: 2 },
  { i: "kpi-3", x: 8, y: 0, w: 4, h: 3, minW: 3, minH: 2 },
  { i: "policies", x: 0, y: 3, w: 12, h: 7, minW: 6, minH: 4 },
  { i: "industry", x: 0, y: 10, w: 5, h: 6, minW: 3, minH: 4 },
  { i: "premium", x: 5, y: 10, w: 7, h: 6, minW: 4, minH: 4 },
];

function DotGrid({ width, height }: { width: number; height: number }) {
  // 12px grid; dots visible enough to read like the Figma edit surface.
  return (
    <svg
      width={width} height={height}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <defs>
        <pattern id="dot-grid" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#c8cfd9" fillOpacity="0.55" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot-grid)" />
    </svg>
  );
}

export default function DashboardCanvas({ editMode }: { editMode: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: MAX_WIDTH, h: 0 });
  const [layout, setLayout] = useState<Layout>(DEFAULT_LAYOUT);

  const handleLayoutChange = (nextLayout: Layout) => {
    setLayout(nextLayout.map((item) => ({ ...item })) as LayoutItem[]);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const ro = new ResizeObserver(() => {
      setSize({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  return (
    <div style={{
      flex: 1, background: "#fff", overflow: "auto",
      display: "flex", justifyContent: "center", position: "relative",
    }}>
      <div
        ref={containerRef}
        style={{
          width: "100%", maxWidth: MAX_WIDTH,
          position: "relative", padding: 24, boxSizing: "border-box",
          minHeight: "100%",
        }}
      >
        {editMode && <DotGrid width={size.w} height={Math.max(size.h, 2000)} />}
        <GridLayout
          className="dashboard-grid"
          layout={layout}
          onLayoutChange={handleLayoutChange}
          width={Math.max(size.w - 48, 0)}
          gridConfig={{
            cols: COLS,
            rowHeight: ROW_HEIGHT,
            margin: MARGIN,
            containerPadding: [0, 0],
          }}
          dragConfig={{
            enabled: editMode,
            handle: ".widget-drag-handle",
          }}
          resizeConfig={{
            enabled: editMode,
          }}
        >
          <div key="kpi-1"><WidgetWrapper editMode={editMode}>
            <KpiCard title="Total Premium" value="$975.76M" delta="37.8%" />
          </WidgetWrapper></div>
          <div key="kpi-2"><WidgetWrapper editMode={editMode}>
            <KpiCard title="Policy Count" value="87.53K" delta="12.4%" />
          </WidgetWrapper></div>
          <div key="kpi-3"><WidgetWrapper editMode={editMode}>
            <KpiCard title="Total Fees" value="$11.4M" delta="8.2%" />
          </WidgetWrapper></div>
          <div key="policies"><WidgetWrapper editMode={editMode}><StackedBarChart /></WidgetWrapper></div>
          <div key="industry"><WidgetWrapper editMode={editMode}><DonutChart /></WidgetWrapper></div>
          <div key="premium"><WidgetWrapper editMode={editMode}><AreaChart /></WidgetWrapper></div>
        </GridLayout>
      </div>
    </div>
  );
}
