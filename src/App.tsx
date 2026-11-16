import "./App.css";
import { useState } from "react";
import { ConfigPanel } from "./ui/ConfigPanel";
import { LibraryPanel } from "./ui/LibraryPanel";
import { PowerLightingPanel } from "./ui/PowerLightingPanel";
import { CostPanel } from "./ui/CostPanel";
import { SceneRoot } from "./scene/SceneRoot";
import { ViewToolbar } from "./ui/ViewToolbar";

const TABS = [
  { key: "config", label: "01 Cấu hình", render: () => <ConfigPanel /> },
  {
    key: "library",
    label: "02 Kho mẫu & thư viện",
    render: () => <LibraryPanel />,
  },
  {
    key: "power",
    label: "03 Ánh sáng & Điện",
    render: () => <PowerLightingPanel />,
  },
  { key: "cost", label: "04 Dự toán", render: () => <CostPanel /> },
] as const;

function App() {
  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]["key"]>("config");
  const current = TABS.find((t) => t.key === activeTab) ?? TABS[0];

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          STAGE <i>STUDIO</i>
        </div>
        <nav className="tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={activeTab === t.key ? "tabBtn on" : "tabBtn"}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        {current.render()}
      </aside>
      <main className="viewport">
        <ViewToolbar />
        <SceneRoot />
      </main>
    </div>
  );
}

export default App;
