import "./App.css";
import { useState, type ReactNode } from "react";
import { ConfigPanel } from "./ui/ConfigPanel";
import { LibraryPanel } from "./ui/LibraryPanel";
import { SeatingPanel } from "./ui/SeatingPanel";
import { PowerLightingPanel } from "./ui/PowerLightingPanel";
import { CostPanel } from "./ui/CostPanel";
import { SceneRoot } from "./scene/SceneRoot";
import { ViewToolbar } from "./ui/ViewToolbar";

interface NavItem {
  num: number;
  key: string;
  label: string;
  ready: boolean;
  render?: () => ReactNode;
}

// Danh sách bước làm việc bên trái — đánh số như quy trình dựng sân khấu thật.
// Mục "ready: false" là tính năng dự kiến làm tiếp, hiện disable + gắn nhãn
// "Sắp có" để người dùng thấy lộ trình đầy đủ của app, không chỉ phần đã xong.
const NAV_ITEMS: NavItem[] = [
  { num: 1, key: "config", label: "Cấu hình của tôi", ready: true, render: () => <ConfigPanel /> },
  { num: 2, key: "library", label: "Kho mẫu & thư viện", ready: true, render: () => <LibraryPanel /> },
  { num: 3, key: "seating", label: "Chỗ ngồi", ready: true, render: () => <SeatingPanel /> },
  { num: 4, key: "power", label: "Ánh sáng & Điện", ready: true, render: () => <PowerLightingPanel /> },
  { num: 5, key: "cost", label: "Dự toán", ready: true, render: () => <CostPanel /> },
  { num: 6, key: "audio", label: "Âm thanh", ready: false },
  { num: 7, key: "ar", label: "AR thực tế", ready: false },
  { num: 8, key: "handover", label: "Vận hành & bàn giao", ready: false },
];

function App() {
  const [activeKey, setActiveKey] = useState("config");
  const current = NAV_ITEMS.find((t) => t.key === activeKey) ?? NAV_ITEMS[0];

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          STAGE <i>STUDIO</i>
        </div>
        <nav className="navList">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={
                !item.ready
                  ? "navItem soon"
                  : activeKey === item.key
                  ? "navItem on"
                  : "navItem"
              }
              disabled={!item.ready}
              onClick={() => item.ready && setActiveKey(item.key)}
            >
              <span className="navNum">{String(item.num).padStart(2, "0")}</span>
              <span className="navLabel">{item.label}</span>
              {!item.ready && <span className="navBadge">Sắp có</span>}
            </button>
          ))}
        </nav>
        <div className="panelScroll">{current.render?.()}</div>
      </aside>
      <main className="viewport">
        <ViewToolbar />
        <SceneRoot />
      </main>
    </div>
  );
}

export default App;
