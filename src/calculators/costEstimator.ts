import type { StageLayout } from "../types/layout";
import type { EventConfig, MucDauTu } from "../types/config";

// Đơn giá tham khảo (VNĐ) — tách riêng khỏi logic tính toán để sau này
// dễ thay bằng bảng giá thật (đọc từ file cấu hình/CMS) mà không sửa code.
interface PriceTable {
  trussPerM: number; // giá thuê truss theo mét dài
  ledPerM2PerEvent: number; // giá thuê LED theo m2 / sự kiện
  tableSetPrice: number; // giá 1 bộ bàn + ghế (10 khách)
  lightFixturePrice: number; // giá thuê 1 đèn sân khấu
  audioBasePrice: number; // giá gói âm thanh cơ bản
  audioPerGuest: number; // phụ phí âm thanh theo đầu khách
  laborPercent: number; // % nhân công / vận hành / vận chuyển trên tổng
}

const PRICE_TABLE: Record<MucDauTu, PriceTable> = {
  "co-ban": {
    trussPerM: 350_000,
    ledPerM2PerEvent: 850_000,
    tableSetPrice: 650_000,
    lightFixturePrice: 300_000,
    audioBasePrice: 8_000_000,
    audioPerGuest: 15_000,
    laborPercent: 0.12,
  },
  "tieu-chuan": {
    trussPerM: 450_000,
    ledPerM2PerEvent: 1_100_000,
    tableSetPrice: 850_000,
    lightFixturePrice: 450_000,
    audioBasePrice: 15_000_000,
    audioPerGuest: 22_000,
    laborPercent: 0.15,
  },
  "cao-cap": {
    trussPerM: 600_000,
    ledPerM2PerEvent: 1_450_000,
    tableSetPrice: 1_200_000,
    lightFixturePrice: 650_000,
    audioBasePrice: 28_000_000,
    audioPerGuest: 32_000,
    laborPercent: 0.18,
  },
  "dai-nhac-hoi": {
    trussPerM: 850_000,
    ledPerM2PerEvent: 1_900_000,
    tableSetPrice: 1_600_000,
    lightFixturePrice: 900_000,
    audioBasePrice: 55_000_000,
    audioPerGuest: 45_000,
    laborPercent: 0.2,
  },
};

export interface CostItem {
  label: string;
  qty: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface CostEstimate {
  items: CostItem[];
  subtotal: number;
  laborCost: number;
  totalVnd: number;
}

function vec3Dist(
  a: { x: number; y: number; z: number },
  b: { x: number; y: number; z: number }
) {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

/**
 * Dự toán chi phí dựa trên khối lượng thực tế trong layout (mét truss,
 * m2 LED, số bàn, số đèn...) nhân với đơn giá theo mức đầu tư đã chọn.
 */
export function estimateCost(
  layout: StageLayout,
  config: EventConfig
): CostEstimate {
  const price = PRICE_TABLE[config.mucDauTu];

  const trussLengthM = layout.trussBeams.reduce(
    (sum, b) => sum + vec3Dist(b.from, b.to),
    0
  );
  const ledAreaM2 = layout.ledScreen.width * layout.ledScreen.height;

  const items: CostItem[] = [
    {
      label: "Khung truss",
      qty: Number(trussLengthM.toFixed(1)),
      unit: "m",
      unitPrice: price.trussPerM,
      total: trussLengthM * price.trussPerM,
    },
    {
      label: "Màn hình LED",
      qty: Number(ledAreaM2.toFixed(1)),
      unit: "m²",
      unitPrice: price.ledPerM2PerEvent,
      total: ledAreaM2 * price.ledPerM2PerEvent,
    },
    {
      label: "Bàn ghế (bộ 10 khách)",
      qty: layout.tables.length,
      unit: "bộ",
      unitPrice: price.tableSetPrice,
      total: layout.tables.length * price.tableSetPrice,
    },
    {
      label: "Đèn sân khấu",
      qty: layout.lights.length,
      unit: "đèn",
      unitPrice: price.lightFixturePrice,
      total: layout.lights.length * price.lightFixturePrice,
    },
    {
      label: "Âm thanh",
      qty: config.soKhach,
      unit: "khách",
      unitPrice: price.audioPerGuest,
      total: price.audioBasePrice + config.soKhach * price.audioPerGuest,
    },
  ];

  const subtotal = items.reduce((s, i) => s + i.total, 0);
  const laborCost = subtotal * price.laborPercent;
  const totalVnd = subtotal + laborCost;

  return { items, subtotal, laborCost, totalVnd };
}
