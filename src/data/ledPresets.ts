export interface LedPreset {
  id: string;
  label: string;
  pitchMm: number; // khoảng cách điểm ảnh (mm) — số càng nhỏ càng mịn, càng đắt
  usage: string;
}

// Thư viện mẫu màn LED — mỗi mẫu chỉ khác nhau ở pitch (độ mịn điểm ảnh).
// Kích thước thực tế (m) vẫn do generateLayout tính theo sân khấu;
// ở đây chỉ định nghĩa "loại màn" để tính ra độ phân giải tương ứng.
export const LED_PRESETS: LedPreset[] = [
  { id: "p2.6", label: "P2.6 (mịn, xem gần)", pitchMm: 2.6, usage: "Trong nhà, sự kiện cao cấp" },
  { id: "p3.91", label: "P3.91 (tiêu chuẩn)", pitchMm: 3.91, usage: "Phổ biến nhất, trong nhà & ngoài trời" },
  { id: "p4.81", label: "P4.81 (ngoài trời)", pitchMm: 4.81, usage: "Ngoài trời, xem xa" },
  { id: "p5.95", label: "P5.95 (đại nhạc hội)", pitchMm: 5.95, usage: "Sân khấu lớn, khoảng cách xem rất xa" },
];

export const DEFAULT_LED_PRESET_ID = "p3.91";

export function getLedPreset(id: string): LedPreset {
  return LED_PRESETS.find((p) => p.id === id) ?? LED_PRESETS[1];
}

const CABIN_SIZE_M = 0.5; // cabin LED tiêu chuẩn 500x500mm

export interface LedSpecs {
  cols: number;
  rows: number;
  resolutionW: number;
  resolutionH: number;
  pitchMm: number;
}

/**
 * Từ kích thước màn (m) + mẫu pitch đã chọn -> số cabin thực tế (làm tròn)
 * và độ phân giải tổng (px). Làm tròn theo cabin vì ngoài thực tế LED luôn
 * ghép nguyên khối cabin, không cắt lẻ.
 */
export function computeLedSpecs(
  widthM: number,
  heightM: number,
  presetId: string
): LedSpecs {
  const preset = getLedPreset(presetId);
  const cols = Math.max(1, Math.round(widthM / CABIN_SIZE_M));
  const rows = Math.max(1, Math.round(heightM / CABIN_SIZE_M));
  const pixelsPerCabin = Math.round((CABIN_SIZE_M * 1000) / preset.pitchMm);
  return {
    cols,
    rows,
    resolutionW: cols * pixelsPerCabin,
    resolutionH: rows * pixelsPerCabin,
    pitchMm: preset.pitchMm,
  };
}

export { CABIN_SIZE_M };
