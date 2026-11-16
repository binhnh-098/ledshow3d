import type { StageLayout } from "../types/layout";
import type { EventConfig } from "../types/config";

const LED_POWER_DENSITY_W_PER_M2 = 350; // công suất màn LED trung bình: ~350W/m2
const AUDIO_W_PER_GUEST = 18; // công suất âm thanh ước tính theo đầu khách
const SAFETY_MARGIN = 1.25; // hệ số dự phòng 25% (dây dẫn, tủ điện, hao hụt)

export interface PowerBreakdownItem {
  label: string;
  watt: number;
}

export interface PowerBreakdown {
  items: PowerBreakdownItem[];
  totalW: number;
  totalKw: number;
  withMarginKw: number;
  suggestedBreakerA: number; // dòng điện tổng cần (ampe), điện 3 pha 380V
}

/**
 * Tính tổng công suất điện cần cấp cho sự kiện, dựa trên layout đã sinh ra.
 * Đây là hàm thuần — chỉ đọc layout/config, không đụng DOM hay 3D.
 */
export function calculatePower(
  layout: StageLayout,
  config: EventConfig
): PowerBreakdown {
  const ledAreaM2 = layout.ledScreen.width * layout.ledScreen.height;
  const ledW = ledAreaM2 * LED_POWER_DENSITY_W_PER_M2;

  const lightingW = layout.lights.reduce((sum, l) => sum + l.powerW, 0);

  const audioW = config.soKhach * AUDIO_W_PER_GUEST;

  const items: PowerBreakdownItem[] = [
    { label: "Màn hình LED", watt: ledW },
    { label: "Ánh sáng sân khấu", watt: lightingW },
    { label: "Âm thanh", watt: audioW },
  ];

  const totalW = items.reduce((s, i) => s + i.watt, 0);
  const totalKw = totalW / 1000;
  const withMarginKw = totalKw * SAFETY_MARGIN;

  // P = sqrt(3) * U * I * cosφ  →  I = P / (sqrt(3) * U * cosφ), điện 3 pha 380V, cosφ=0.85
  const suggestedBreakerA =
    (withMarginKw * 1000) / (Math.sqrt(3) * 380 * 0.85);

  return { items, totalW, totalKw, withMarginKw, suggestedBreakerA };
}
