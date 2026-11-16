import { useConfigStore } from "../store/useConfigStore";
import type { MatBang, MucDauTu, TinhChatSuKien } from "../types/config";

const TINH_CHAT_OPTIONS: { value: TinhChatSuKien; label: string }[] = [
  { value: "gala", label: "Gala, Year End Party" },
  { value: "hoi-nghi", label: "Hội nghị, hội thảo" },
  { value: "ra-mat-san-pham", label: "Ra mắt sản phẩm" },
  { value: "trao-giai", label: "Lễ trao giải, vinh danh" },
  { value: "tiec-cuoi", label: "Tiệc cưới" },
  { value: "khai-truong", label: "Khai trương, khánh thành" },
  { value: "ky-niem", label: "Kỷ niệm thành lập, tri ân" },
  { value: "concert", label: "Concert, đêm nhạc" },
];

const MUC_DAU_TU_OPTIONS: { value: MucDauTu; label: string }[] = [
  { value: "co-ban", label: "Cơ bản" },
  { value: "tieu-chuan", label: "Tiêu chuẩn" },
  { value: "cao-cap", label: "Cao cấp" },
  { value: "dai-nhac-hoi", label: "Đại nhạc hội" },
];

export function ConfigPanel() {
  const config = useConfigStore((s) => s.config);
  const setConfig = useConfigStore((s) => s.setConfig);

  return (
    <div className="panel">
      <h2>Cấu hình sự kiện của tôi</h2>
      <p className="hint">
        Nhập mặt bằng và nhu cầu, mô hình 3D sẽ tự dựng lại theo thời gian thực.
      </p>

      <section>
        <h3>1. Mặt bằng địa điểm</h3>
        <div className="row">
          {(["trong-nha", "ngoai-troi"] as MatBang[]).map((v) => (
            <button
              key={v}
              className={config.matBang === v ? "chip on" : "chip"}
              onClick={() => setConfig({ matBang: v })}
            >
              {v === "trong-nha" ? "Trong nhà" : "Ngoài trời"}
            </button>
          ))}
        </div>
        <div className="grid2">
          <label>
            Chiều ngang (m)
            <input
              type="number"
              min={10}
              max={100}
              value={config.chieuNgang}
              onChange={(e) =>
                setConfig({ chieuNgang: Number(e.target.value) || 0 })
              }
            />
          </label>
          <label>
            Chiều dài (m)
            <input
              type="number"
              min={10}
              max={150}
              value={config.chieuDai}
              onChange={(e) =>
                setConfig({ chieuDai: Number(e.target.value) || 0 })
              }
            />
          </label>
        </div>
      </section>

      <section>
        <h3>2. Tính chất sự kiện</h3>
        <div className="row wrap">
          {TINH_CHAT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={config.tinhChat === opt.value ? "chip on" : "chip"}
              onClick={() => setConfig({ tinhChat: opt.value })}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <label>
          Số khách (khách)
          <input
            type="number"
            min={10}
            max={5000}
            value={config.soKhach}
            onChange={(e) =>
              setConfig({ soKhach: Number(e.target.value) || 0 })
            }
          />
        </label>
        <div className="row wrap">
          <span className="fl">Mức đầu tư kỹ thuật</span>
        </div>
        <div className="row wrap">
          {MUC_DAU_TU_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={config.mucDauTu === opt.value ? "chip on" : "chip"}
              onClick={() => setConfig({ mucDauTu: opt.value })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
