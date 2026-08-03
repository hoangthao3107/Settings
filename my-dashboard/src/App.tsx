import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import GlobalHeader from "./components/GlobalHeader";
import DashboardSubHeader from "./components/DashboardSubHeader";
import DashboardCanvas from "./components/DashboardCanvas";
import LaunchpadPage from "./pages/LaunchpadPage";
import BlocksPage from "./pages/BlocksPage";
import HeaderFooterBuilderPage from "./pages/HeaderFooterBuilderPage";
import BenchmarkingPage from "./pages/BenchmarkingPage";

type Page = "launchpad" | "dashboard" | "blocks" | "hf-builder" | "benchmarking";

const EDIT_MODE_KEY = "dashboard.editMode";

export default function App() {
  const [activePage, setActivePage] = useState<Page>("launchpad");
  const [editMode, setEditMode] = useState<boolean>(() => {
    try { return localStorage.getItem(EDIT_MODE_KEY) === "true"; } catch { return false; }
  });

  useEffect(() => {
    try { localStorage.setItem(EDIT_MODE_KEY, String(editMode)); } catch { /* ignore */ }
  }, [editMode]);

  const handleNavigate = (id: string) => {
    if (id === "launchpad") setActivePage("launchpad");
    else if (id === "analysis") setActivePage("dashboard");
    else if (id === "blocks") setActivePage("blocks");
    else if (id === "hf-builder") setActivePage("hf-builder");
    else if (id === "benchmarking") setActivePage("benchmarking");
  };

  return (
    <div style={{
      display: "flex", height: "100vh", background: "#fff",
      fontFamily: "'Inter', sans-serif", color: "#343839",
      overflow: "hidden",
    }}>
      <Sidebar
        activeId={activePage === "launchpad" ? "launchpad" : activePage === "blocks" ? "blocks" : activePage === "hf-builder" ? "hf-builder" : activePage === "benchmarking" ? "benchmarking" : "analysis"}
        onNavigate={handleNavigate}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <GlobalHeader title={activePage === "launchpad" ? "Launchpad" : activePage === "hf-builder" ? "Header / Footer Builder" : activePage === "benchmarking" ? "Benchmarking" : undefined} />

        {activePage === "launchpad" ? (
          <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
            <LaunchpadPage />
          </div>
        ) : activePage === "blocks" ? (
          <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
            <BlocksPage />
          </div>
        ) : activePage === "hf-builder" ? (
          <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
            <HeaderFooterBuilderPage />
          </div>
        ) : activePage === "benchmarking" ? (
          <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
            <BenchmarkingPage />
          </div>
        ) : (
          <>
            <DashboardSubHeader
              title="Sales Performance Dashboard"
              editMode={editMode}
              onToggleEditMode={() => setEditMode(v => !v)}
            />
            <DashboardCanvas editMode={editMode} />
          </>
        )}
      </div>
    </div>
  );
}
