import { useMemo } from "react";
import { useConfigStore } from "../store/useConfigStore";
import { generateLayout } from "../rules/generateLayout";
import { calculatePower } from "../calculators/powerCalculator";

function formatKw(w: number) {
  return `${w.toFixed(1)} kW`;
}

export function PowerLightingPanel() {
  const config = useConfigStore((s) => s.config);
  const layout = useMemo(() => generateLayout(config), [config]);
  const power = useMemo(() => calculatePower(layout, config), [layout, config]);

  return (
    <div className="panel">
      <h2>Ánh sáng &amp; Điện</h2>
      <p className="hint">
        Số lượng đèn và công suất điện được tính tự động từ chiều dài truss,
        diện tích màn LED và số khách — không cần nhập tay.
      </p>

      <section>
        <h3>Ánh sáng sân khấu</h3>
        <div className="statRow">
          <span>Số đèn trên truss</span>
          <b>{layout.lights.length} đèn</b>
        </div>
        <div className="statRow">
          <span>Công suất / đèn</span>
          <b>{layout.lights[0]?.powerW ?? 0} W</b>
        </div>
      </section>

      <section>
        <h3>Công suất điện</h3>
        <table className="costTable">
          <tbody>
            {power.items.map((it) => (
              <tr key={it.label}>
                <td>{it.label}</td>
                <td className="num">{formatKw(it.watt / 1000)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="statRow total">
          <span>Tổng công suất</span>
          <b>{formatKw(power.totalKw)}</b>
        </div>
        <div className="statRow">
          <span>Có dự phòng 25%</span>
          <b>{formatKw(power.withMarginKw)}</b>
        </div>
        <div className="statRow">
          <span>Dòng điện cần cấp (3 pha 380V)</span>
          <b>{power.suggestedBreakerA.toFixed(0)} A</b>
        </div>
      </section>
    </div>
  );
}
