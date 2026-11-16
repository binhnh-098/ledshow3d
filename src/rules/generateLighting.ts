import type { EventConfig, MucDauTu } from "../types/config";
import type { LightFixture, TrussBeam } from "../types/layout";

// Mật độ đèn trên mỗi 1m truss nóc, theo mức đầu tư kỹ thuật.
const FIXTURES_PER_METER: Record<MucDauTu, number> = {
  "co-ban": 0.4,
  "tieu-chuan": 0.7,
  "cao-cap": 1.1,
  "dai-nhac-hoi": 1.6,
};

const POWER_PER_FIXTURE_W: Record<MucDauTu, number> = {
  "co-ban": 250,
  "tieu-chuan": 350,
  "cao-cap": 500,
  "dai-nhac-hoi": 650,
};

const COLORS = ["#ff5e5e", "#5ea8ff", "#ffd15e", "#8aff8a", "#c77dff"];

/**
 * Sinh đèn sân khấu (spotlight) rải đều trên đà ngang (beam-top) của truss.
 * Số lượng tỉ lệ theo chiều dài truss và mức đầu tư kỹ thuật đã chọn.
 */
export function generateLighting(
  topBeam: TrussBeam,
  config: EventConfig
): LightFixture[] {
  const length = Math.abs(topBeam.to.x - topBeam.from.x);
  const density = FIXTURES_PER_METER[config.mucDauTu];
  const count = Math.max(4, Math.round(length * density));
  const powerW = POWER_PER_FIXTURE_W[config.mucDauTu];

  const fixtures: LightFixture[] = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const x = topBeam.from.x + (topBeam.to.x - topBeam.from.x) * t;
    const y = topBeam.from.y - 0.15;
    const z = topBeam.from.z;

    fixtures.push({
      id: `light-${i}`,
      position: { x, y, z },
      target: { x, y: 0, z: z + 6 }, // chiếu chếch về phía khán giả
      type: i % 3 === 0 ? "wash" : "spot",
      color: COLORS[i % COLORS.length],
      powerW,
    });
  }
  return fixtures;
}
