import type { EventConfig } from "../types/config";
import type { StageLayout, TableSeat, TrussBeam } from "../types/layout";
import { generateLighting } from "./generateLighting";
import { generateTruss } from "./trussGenerators";
import { computeLedSpecs } from "../data/ledPresets";

const TABLE_RADIUS = 1.1;

/**
 * Hàm thuần (pure function): cùng input luôn ra cùng output.
 * Đây là "rule engine" — nơi duy nhất chứa quy tắc sinh hình học.
 * Sau này thêm quy tắc mới (vd khung mái, layer truss khác) chỉ sửa ở đây,
 * không đụng vào code render 3D.
 */
export function generateLayout(config: EventConfig): StageLayout {
  const { chieuNgang, chieuDai, soKhach } = config;

  // --- Sân khấu: rộng tối đa 60% mặt bằng ngang, tối đa 18m ---
  const stageWidth = Math.min(chieuNgang * 0.6, 18);
  const stageDepth = Math.min(chieuDai * 0.25, 10);
  const stageHeight = 0.8;

  const stage = {
    width: stageWidth,
    depth: stageDepth,
    height: stageHeight,
    center: { x: 0, y: stageHeight / 2, z: -chieuDai / 2 + stageDepth / 2 },
  };
  const zBack = stage.center.z;

  // --- Truss: lấy từ thư viện mẫu theo kết cấu đã chọn ---
  const trussResult = generateTruss(config.ketCauChinh, {
    stageWidth,
    stageDepth,
    stageHeight,
    zBack,
  });
  const trussBeams: TrussBeam[] = trussResult.beams;

  // --- Màn hình LED: tỉ lệ 16:9, rộng 70% sân khấu, đặt sát phía sau ---
  const ledWidth = stageWidth * 0.7;
  const ledHeight = ledWidth * (9 / 16);
  const ledSpecs = computeLedSpecs(ledWidth, ledHeight, config.ledPresetId);
  const ledScreen = {
    width: ledWidth,
    height: ledHeight,
    position: { x: 0, y: stageHeight + ledHeight / 2, z: zBack - 0.1 },
    resolutionW: ledSpecs.resolutionW,
    resolutionH: ledSpecs.resolutionH,
    pitchMm: ledSpecs.pitchMm,
  };

  // --- Bàn ghế: xếp 2 khối trái/phải, chừa lối đi giữa, lùi dần về phía khán giả ---
  const { khachMoiBan, khoangCachBan, loiDiGiua } = config;
  const tableCount = Math.ceil(soKhach / khachMoiBan);
  const usableDepth = chieuDai - stageDepth - 6; // chừa khoảng cách an toàn với sân khấu
  const colsPerSide = Math.max(
    1,
    Math.floor((chieuNgang / 2 - loiDiGiua / 2) / khoangCachBan)
  );
  const rows = Math.max(1, Math.floor(usableDepth / khoangCachBan));

  const tables: TableSeat[] = [];
  let placed = 0;
  const zStart = stage.center.z + stageDepth / 2 + 5;

  for (let row = 0; row < rows && placed < tableCount; row++) {
    for (let side = -1; side <= 1; side += 2) {
      for (let col = 0; col < colsPerSide && placed < tableCount; col++) {
        const x = side * (loiDiGiua / 2 + khoangCachBan * (col + 0.5));
        const z = zStart + row * khoangCachBan;
        tables.push({
          id: `table-${row}-${side}-${col}`,
          tableCenter: { x, y: 0, z },
          tableRadius: TABLE_RADIUS,
          chairCount: khachMoiBan,
        });
        placed++;
      }
    }
  }

  // --- Đèn: gắn vào đà cao nhất của truss; nếu kết cấu không có khung treo
  // (vd "Không dựng khung") thì dùng 1 đà ảo ngang mức ngọn chân đứng để
  // tái dùng được logic rải đèn có sẵn, mô phỏng đèn đặt trên chân đứng. ---
  const riggingBeam: TrussBeam =
    trussResult.riggingBeam ?? {
      id: "virtual-stand-beam",
      from: { x: -stageWidth * 0.35, y: trussResult.topHeight, z: zBack },
      to: { x: stageWidth * 0.35, y: trussResult.topHeight, z: zBack },
      thickness: 0.1,
    };
  const lights = generateLighting(riggingBeam, config);

  return {
    stage,
    trussBeams,
    ledScreen,
    tables,
    lights,
    ground: { width: chieuNgang, depth: chieuDai },
  };
}
