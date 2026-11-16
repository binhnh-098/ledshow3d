import { useViewStore, type ViewKey } from "../store/useViewStore";

const VIEWS: { key: ViewKey; label: string }[] = [
  { key: "free", label: "3D" },
  { key: "chinh-dien", label: "Chính diện" },
  { key: "canh", label: "Cạnh" },
  { key: "tren", label: "Trên" },
  { key: "khan-gia", label: "Khán giả" },
  { key: "mat-bang", label: "Mặt bằng" },
];

export function ViewToolbar() {
  const activeView = useViewStore((s) => s.activeView);
  const setView = useViewStore((s) => s.setView);

  return (
    <div className="viewToolbar">
      {VIEWS.map((v) => (
        <button
          key={v.key}
          className={activeView === v.key ? "vb on" : "vb"}
          onClick={() => setView(v.key)}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}
