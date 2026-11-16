import type { StageLayout } from "../types/layout";
import type { ViewKey } from "../store/useViewStore";

export interface CameraPreset {
  position: [number, number, number];
  target: [number, number, number];
  orthographic?: boolean;
}

/**
 * Tính vị trí camera cho từng góc nhìn, dựa trên kích thước layout hiện tại
 * (không hardcode toạ độ) — vì vậy khi đổi mặt bằng/sân khấu, các góc nhìn
 * vẫn luôn canh đúng khung hình.
 */
export function getCameraPreset(
  view: ViewKey,
  layout: StageLayout
): CameraPreset {
  const { ground, stage } = layout;
  const halfW = ground.width / 2;
  const halfD = ground.depth / 2;
  const stageTop = stage.height + 4;

  switch (view) {
    case "chinh-dien":
      // Nhìn thẳng mặt sân khấu từ phía khán đài, ngang tầm sân khấu.
      return {
        position: [0, stageTop, stage.center.z + stage.depth * 2.4 + 4],
        target: [0, stageTop * 0.6, stage.center.z],
      };

    case "canh":
      // Nhìn từ hông sân khấu — thấy được chiều sâu/kết cấu truss.
      return {
        position: [halfW * 0.95, stageTop * 1.1, stage.center.z + 6],
        target: [0, stageTop * 0.5, stage.center.z + 6],
      };

    case "tren":
      // Nhìn từ trên xuống theo góc nghiêng (không phải mặt bằng kỹ thuật).
      return {
        position: [0.001, Math.max(halfW, halfD) * 2.1, 0.001],
        target: [0, 0, 0],
      };

    case "khan-gia":
      // Góc nhìn mô phỏng một khách ngồi ở giữa khu vực bàn tiệc.
      return {
        position: [0, 1.6, halfD * 0.35],
        target: [0, stageTop * 0.5, stage.center.z],
      };

    case "mat-bang":
      // Mặt bằng kỹ thuật: nhìn thẳng đứng từ trên xuống, dùng với
      // OrthographicCamera để không bị méo phối cảnh (đúng tỉ lệ bản vẽ).
      return {
        position: [0, Math.max(halfW, halfD) * 3, 0.001],
        target: [0, 0, 0],
        orthographic: true,
      };

    case "free":
    default:
      return {
        position: [0, 14, halfD + stage.depth],
        target: [0, 2, 0],
      };
  }
}
