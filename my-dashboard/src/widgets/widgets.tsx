import { BarStack, Pie } from "@visx/shape";
import { Group } from "@visx/group";
import { Grid } from "@visx/grid";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { color, font } from "../tokens";

const RENEWAL_COLOR = color.orangeLight;
const NEW_COLOR = color.orange;
const AREA_COLOR = color.orange;
const PIE_COLORS = [
  "#B42318", "#C2410C", "#DC6803", "#E87818",
  color.orange, "#F5923E", "#F9B27A", "#FCCFA8",
  "#FEE4CA", "#FDE2CF",
];

const months = [
  "Apr 25","May 25","Jun 25","Jul 25","Aug 25","Sep 25",
  "Oct 25","Nov 25","Dec 25","Jan 26","Feb 26","Mar 26"
];

type StackedRow = { month: string; renewal: number; new: number };
const stackedData: StackedRow[] = months.map((month, i) => ({
  month,
  renewal: i === 0 ? 600 : i === months.length - 1 ? 1100 : 2000,
  new: i === 0 ? 800 : i === months.length - 1 ? 3500 : 5800,
}));

const pieData = [
  { label: "Manufacturing", value: 36 },
  { label: "Wholesale Trade", value: 11 },
  { label: "Retail Trade", value: 10 },
  { label: "Agriculture", value: 7 },
  { label: "Public Admin", value: 7 },
  { label: "Information", value: 9 },
  { label: "Finance & Ins.", value: 6 },
  { label: "Professional", value: 6 },
  { label: "Transportation", value: 5 },
  { label: "Other Services", value: 5 },
];

type AreaRow = { month: string; current: number; prior: number };
const areaData: AreaRow[] = months.map((month, i) => ({
  month,
  current: i === 0 ? 15 : i >= months.length - 2 ? Math.max(0, 65 - (i - months.length + 3) * 30) : 60,
  prior: 62,
}));

const sparklineRaw = [40, 42, 45, 44, 48, 52, 55, 58, 56, 60, 62, 68];

// Green delta pill, matching the Figma "↑ 37.8% vs last year" chip.
function DeltaBadge({ value, positive = true }: { value: string; positive?: boolean }) {
  const bg = positive ? color.greenBg : "#FEF3F2";
  const fg = positive ? color.greenText : "#B42318";
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "2px 8px", borderRadius: 999,
        background: bg, color: fg,
        fontSize: 12, lineHeight: "16px", fontWeight: 500,
      }}
    >
      <span style={{ fontSize: 10 }}>{positive ? "↑" : "↓"}</span>
      {value}
    </span>
  );
}

function WidgetTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: font.family, fontSize: 16, lineHeight: "24px",
      fontWeight: 600, color: color.n01,
    }}>
      {children}
    </div>
  );
}

export function KpiCard({ title, value, delta }: {
  title: string; value: string; delta: string;
}) {
  const w = 140, h = 56;
  const xScale = scaleLinear({ domain: [0, sparklineRaw.length - 1], range: [0, w] });
  const yScale = scaleLinear({ domain: [30, 72], range: [h - 2, 2] });
  const pathD = sparklineRaw
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(i)},${yScale(d)}`)
    .join(" ");
  const areaD = pathD + ` L ${w},${h} L 0,${h} Z`;
  const gradId = `spark-grad-${title.replace(/\s+/g, "-")}`;

  return (
    <div style={{
      width: "100%", height: "100%", padding: 20,
      display: "flex", flexDirection: "column", gap: 12,
      boxSizing: "border-box",
    }}>
      <WidgetTitle>{title}</WidgetTitle>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 16, flex: 1,
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
          <div style={{
            fontFamily: font.family, fontSize: 28, lineHeight: "36px",
            fontWeight: 600, color: color.n01, letterSpacing: "-0.01em",
          }}>
            {value}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <DeltaBadge value={delta} positive />
            <span style={{
              fontFamily: font.family, fontSize: 12, lineHeight: "16px",
              color: color.n03,
            }}>
              vs last year
            </span>
          </div>
        </div>
        <svg width={w} height={h} style={{ flexShrink: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color.green} stopOpacity={0.2} />
              <stop offset="100%" stopColor={color.green} stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <path d={areaD} fill={`url(#${gradId})`} />
          <path d={pathD} fill="none" stroke={color.green} strokeWidth={1.5} />
        </svg>
      </div>
    </div>
  );
}

export function StackedBarChart() {
  const width = 780, height = 280;
  const margin = { top: 10, right: 20, bottom: 50, left: 50 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;
  const keys: (keyof StackedRow)[] = ["renewal", "new"];
  const xScale = scaleBand<string>({ domain: months, range: [0, innerW], padding: 0.3 });
  const yScale = scaleLinear<number>({ domain: [0, 10000], range: [innerH, 0], nice: true });
  const colorScale = scaleOrdinal<string, string>({ domain: ["renewal", "new"], range: [RENEWAL_COLOR, NEW_COLOR] });

  return (
    <div style={{ padding: 24, width: "100%", height: "100%", boxSizing: "border-box" }}>
      <WidgetTitle>Policies Metrics</WidgetTitle>
      <div style={{ display: "flex", gap: 48, marginTop: 16, marginBottom: 16 }}>
        {[
          { lbl: "Renewal Policies", val: "25.8K", d: "9.9%" },
          { lbl: "New Policies", val: "61.7K", d: "9.9%" },
        ].map(({ lbl, val, d }) => (
          <div key={lbl} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: 14, lineHeight: "20px", color: color.n03 }}>{lbl}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <div style={{
                fontSize: 24, lineHeight: "32px", fontWeight: 600, color: color.n01,
              }}>
                {val}
              </div>
              <DeltaBadge value={d} positive />
            </div>
          </div>
        ))}
      </div>
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          <Grid xScale={xScale} yScale={yScale} width={innerW} height={innerH}
            stroke={color.n06} numTicksRows={5} numTicksColumns={0} />
          <BarStack<StackedRow, string>
            data={stackedData} keys={keys as string[]}
            x={(d) => d.month} xScale={xScale} yScale={yScale} color={colorScale}
          >
            {(barStacks) =>
              barStacks.map((barStack) =>
                barStack.bars.map((bar) => (
                  <rect key={`${barStack.index}-${bar.index}`}
                    x={bar.x} y={bar.y} width={bar.width} height={bar.height}
                    fill={bar.color} stroke="white" strokeWidth={2} rx={2} />
                ))
              )
            }
          </BarStack>
          <AxisBottom top={innerH} scale={xScale} stroke={color.n06} tickStroke="transparent"
            tickLabelProps={() => ({ fontSize: 12, fill: color.n03, textAnchor: "middle" })} />
          <AxisLeft scale={yScale} stroke="transparent" tickStroke="transparent"
            tickFormat={(v) => `${Number(v) / 1000}K`}
            tickLabelProps={() => ({ fontSize: 12, fill: color.n03, dx: -4 })} numTicks={5} />
        </Group>
      </svg>
      <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 8 }}>
        {[["Renewal Policies", RENEWAL_COLOR], ["New Policies", NEW_COLOR]].map(([label, c]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: color.n02 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DonutChart() {
  const size = 200;
  const radius = size / 2;

  return (
    <div style={{ padding: 24, width: "100%", height: "100%", boxSizing: "border-box" }}>
      <WidgetTitle>Top 10 Industry Categories</WidgetTitle>
      <div style={{ display: "flex", alignItems: "center", gap: 32, marginTop: 16 }}>
        <svg width={size} height={size}>
          <Group top={radius} left={radius}>
            <Pie data={pieData} pieValue={(d) => d.value}
              outerRadius={radius - 8} innerRadius={radius - 44} padAngle={0.015}>
              {(pie) =>
                pie.arcs.map((arc, i) => (
                  <path key={i} d={pie.path(arc) ?? ""} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))
              }
            </Pie>
          </Group>
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {pieData.map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, lineHeight: "16px", color: color.n02 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
              {d.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AreaChart() {
  const width = 620, height = 220;
  const margin = { top: 20, right: 20, bottom: 40, left: 60 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;
  const xScale = scaleLinear({ domain: [0, areaData.length - 1], range: [0, innerW] });
  const yScale = scaleLinear({ domain: [0, 100], range: [innerH, 0], nice: true });
  const currentPath = areaData.map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(i)},${yScale(d.current)}`).join(" ");
  const priorPath = areaData.map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(i)},${yScale(d.prior)}`).join(" ");
  const areaPath = currentPath + ` L ${innerW},${innerH} L 0,${innerH} Z`;

  return (
    <div style={{ padding: 24, width: "100%", height: "100%", boxSizing: "border-box" }}>
      <WidgetTitle>New Business Premium Trend</WidgetTitle>
      <svg width={width} height={height} style={{ marginTop: 8 }}>
        <defs>
          <linearGradient id="area-gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={AREA_COLOR} stopOpacity={0.2} />
            <stop offset="100%" stopColor={AREA_COLOR} stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <Group left={margin.left} top={margin.top}>
          <Grid xScale={xScale} yScale={yScale} width={innerW} height={innerH}
            stroke={color.n06} numTicksRows={5} numTicksColumns={0} />
          <path d={areaPath} fill="url(#area-gradient)" />
          <path d={currentPath} fill="none" stroke={AREA_COLOR} strokeWidth={2} />
          <path d={priorPath} fill="none" stroke={color.trendLine} strokeWidth={1.5} strokeDasharray="4,4" strokeOpacity={0.7} />
          <AxisBottom top={innerH} scale={xScale} stroke={color.n06} tickStroke="transparent"
            numTicks={months.length} tickFormat={(_, i) => months[i as number] ?? ""}
            tickLabelProps={() => ({ fontSize: 11, fill: color.n03, textAnchor: "middle" })} />
          <AxisLeft scale={yScale} stroke="transparent" tickStroke="transparent"
            tickFormat={(v) => `$${v}M`}
            tickLabelProps={() => ({ fontSize: 12, fill: color.n03, dx: -4 })} numTicks={5} />
        </Group>
      </svg>
      <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: color.n02 }}>
          <div style={{ width: 16, height: 2, background: AREA_COLOR }} />
          Current Period
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: color.n02 }}>
          <svg width={16} height={2}><line x1={0} y1={1} x2={16} y2={1} stroke={color.trendLine} strokeWidth={1.5} strokeDasharray="4,3" strokeOpacity={0.7} /></svg>
          Prior Period
        </div>
      </div>
    </div>
  );
}
