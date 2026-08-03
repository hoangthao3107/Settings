import { useState } from "react";
import {
  IconLogo, IconHome, IconFolder, IconChart, IconLayers,
  IconUsers, IconSettings, IconGrid, IconShapes, IconLayout, IconBenchmark,
} from "./icons";

type Page = "launchpad" | "dashboard" | string;

type NavItem = {
  id: string;
  icon: React.FC<{ size?: number; color?: string }>;
  label: string;
};

const GROUP_1: NavItem[] = [
  { id: "launchpad", icon: IconGrid,   label: "Launchpad" },
  { id: "home",      icon: IconHome,   label: "Home" },
  { id: "folders",   icon: IconFolder, label: "Folders" },
];
const GROUP_2: NavItem[] = [
  { id: "analysis",      icon: IconChart,     label: "Analytics" },
  { id: "benchmarking",  icon: IconBenchmark, label: "Benchmarking" },
  { id: "blocks",        icon: IconShapes,    label: "Blocks" },
  { id: "hf-builder",   icon: IconLayout,    label: "Header / Footer" },
  { id: "layers",        icon: IconLayers,    label: "Layers" },
];
const GROUP_3: NavItem[] = [
  { id: "team",     icon: IconUsers,    label: "Team" },
  { id: "settings", icon: IconSettings, label: "Settings" },
];

function Divider() {
  return (
    <div style={{
      height: 2, background: "#d0d5dd", borderRadius: 10,
      margin: "12px 16px 8px", flexShrink: 0,
    }} />
  );
}

function NavButton({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);
  const Icon = item.icon;
  const bg    = active ? "#eae7fe" : hover ? "#f5f5f5" : "transparent";
  const color = active ? "#6a56f0" : "#525965";

  return (
    <button
      title={item.label}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 40, height: 40, padding: "10px 12px",
        borderRadius: 8, border: "none", background: bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", transition: "background 0.15s ease",
        margin: "2px auto",
      }}
    >
      <Icon size={20} color={color} />
    </button>
  );
}

export default function Sidebar({
  activeId = "launchpad",
  onNavigate,
}: {
  activeId?: Page;
  onNavigate?: (id: Page) => void;
}) {
  const handle = (id: string) => onNavigate?.(id);

  return (
    <aside style={{
      width: 76, flexShrink: 0, background: "#f9fafb",
      borderRight: "1px solid #e7ebee",
      display: "flex", flexDirection: "column",
      height: "100vh", position: "sticky", top: 0,
    }}>
      <div style={{
        height: 64, display: "flex", alignItems: "center", justifyContent: "center",
        borderBottom: "1px solid transparent",
      }}>
        <IconLogo size={32} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", padding: "4px 0" }}>
        {GROUP_1.map(i => (
          <NavButton key={i.id} item={i} active={i.id === activeId} onClick={() => handle(i.id)} />
        ))}
        <Divider />
        {GROUP_2.map(i => (
          <NavButton key={i.id} item={i} active={i.id === activeId} onClick={() => handle(i.id)} />
        ))}
        <Divider />
        {GROUP_3.map(i => (
          <NavButton key={i.id} item={i} active={i.id === activeId} onClick={() => handle(i.id)} />
        ))}
      </div>
    </aside>
  );
}
