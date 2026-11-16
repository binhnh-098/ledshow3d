import { useMemo } from "react";
import { useConfigStore } from "../store/useConfigStore";
import { generateLayout } from "../rules/generateLayout";
import { estimateCost } from "../calculators/costEstimator";

function formatVnd(n: number) {
  return n.toLocaleString("vi-VN") + " đ";
}

export function CostPanel() {
  const config = useConfigStore((s) => s.config);
  const layout = useMemo(() => generateLayout(config), [config]);
  const cost = useMemo(() => estimateCost(layout, config), [layout, config]);

  return (
    <div className="panel">
      <h2>Dự toán chi phí</h2>
      <p className="hint">
        Tính theo khối lượng thực tế của mô hình (mét truss, m² LED, số bàn,
        số đèn) nhân đơn giá theo mức đầu tư đã chọn ở tab Cấu hình.
      </p>

      <section>
        <table className="costTable">
          <thead>
            <tr>
              <th>Hạng mục</th>
              <th>KL</th>
              <th className="num">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {cost.items.map((it) => (
              <tr key={it.label}>
                <td>{it.label}</td>
                <td>
                  {it.qty.toLocaleString("vi-VN")} {it.unit}
                </td>
                <td className="num">{formatVnd(it.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="statRow">
          <span>Tạm tính</span>
          <b>{formatVnd(cost.subtotal)}</b>
        </div>
        <div className="statRow">
          <span>Nhân công / vận hành</span>
          <b>{formatVnd(cost.laborCost)}</b>
        </div>
        <div className="statRow total">
          <span>Tổng dự toán</span>
          <b>{formatVnd(cost.totalVnd)}</b>
        </div>
      </section>
    </div>
  );
}
