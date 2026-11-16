import { useConfigStore } from "../store/useConfigStore";
import { TRUSS_PRESETS } from "../data/trussPresets";
import { LED_PRESETS } from "../data/ledPresets";

export function LibraryPanel() {
  const config = useConfigStore((s) => s.config);
  const setConfig = useConfigStore((s) => s.setConfig);

  return (
    <div className="panel">
      <h2>Kho mẫu &amp; thư viện</h2>
      <p className="hint">
        Chọn kiểu kết cấu truss và loại màn LED — mô hình 3D, công suất điện
        và dự toán chi phí sẽ tự cập nhật theo lựa chọn.
      </p>

      <section>
        <h3>Kết cấu truss</h3>
        <div className="cardGrid">
          {TRUSS_PRESETS.map((t) => (
            <button
              key={t.id}
              className={config.ketCauChinh === t.id ? "presetCard on" : "presetCard"}
              onClick={() => setConfig({ ketCauChinh: t.id })}
            >
              <b>{t.label}</b>
              <small>{t.description}</small>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3>Màn hình LED</h3>
        <div className="cardGrid">
          {LED_PRESETS.map((l) => (
            <button
              key={l.id}
              className={config.ledPresetId === l.id ? "presetCard on" : "presetCard"}
              onClick={() => setConfig({ ledPresetId: l.id })}
            >
              <b>{l.label}</b>
              <small>{l.usage}</small>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
