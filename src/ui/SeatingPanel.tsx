import { useMemo } from "react";
import { useConfigStore } from "../store/useConfigStore";
import { generateLayout } from "../rules/generateLayout";

export function SeatingPanel() {
  const config = useConfigStore((s) => s.config);
  const setConfig = useConfigStore((s) => s.setConfig);
  const layout = useMemo(() => generateLayout(config), [config]);

  const totalSeats = layout.tables.length * config.khachMoiBan;

  return (
    <div className="panel">
      <h2>Chỗ ngồi</h2>
      <p className="hint">
        Chỉnh số khách/bàn và khoảng cách bố trí — bàn ghế trong scene 3D tự
        xếp lại ngay, không cần kéo thả từng bàn.
      </p>

      <section>
        <h3>Thông số bàn</h3>
        <label>
          Số khách / bàn
          <input
            type="range"
            min={6}
            max={12}
            value={config.khachMoiBan}
            onChange={(e) =>
              setConfig({ khachMoiBan: Number(e.target.value) })
            }
          />
          <output>{config.khachMoiBan} khách</output>
        </label>
        <label>
          Khoảng cách giữa các bàn (m)
          <input
            type="range"
            min={2.4}
            max={4.5}
            step={0.1}
            value={config.khoangCachBan}
            onChange={(e) =>
              setConfig({ khoangCachBan: Number(e.target.value) })
            }
          />
          <output>{config.khoangCachBan.toFixed(1)} m</output>
        </label>
        <label>
          Lối đi giữa (m)
          <input
            type="range"
            min={1.5}
            max={4}
            step={0.1}
            value={config.loiDiGiua}
            onChange={(e) => setConfig({ loiDiGiua: Number(e.target.value) })}
          />
          <output>{config.loiDiGiua.toFixed(1)} m</output>
        </label>
      </section>

      <section>
        <h3>Kết quả xếp chỗ</h3>
        <div className="statRow">
          <span>Số bàn đã xếp được</span>
          <b>{layout.tables.length} bàn</b>
        </div>
        <div className="statRow">
          <span>Tổng chỗ ngồi thực tế</span>
          <b>{totalSeats.toLocaleString("vi-VN")} chỗ</b>
        </div>
        <div className="statRow">
          <span>Số khách yêu cầu</span>
          <b>{config.soKhach.toLocaleString("vi-VN")} khách</b>
        </div>
        {totalSeats < config.soKhach && (
          <p className="hint warn">
            Mặt bằng hiện tại chỉ xếp đủ {totalSeats} chỗ, thiếu{" "}
            {config.soKhach - totalSeats} chỗ so với yêu cầu — hãy tăng chiều
            dài mặt bằng hoặc giảm khoảng cách bàn.
          </p>
        )}
      </section>
    </div>
  );
}
