import type { KetCauChinh } from "../types/config";
import type { TrussBeam, Vec3 } from "../types/layout";

export interface TrussParams {
  stageWidth: number;
  stageDepth: number;
  stageHeight: number;
  zBack: number; // toạ độ z của mép sau sân khấu (nơi đặt truss/màn LED)
}

export interface TrussResult {
  beams: TrussBeam[];
  // Đà cao nhất để treo đèn — null nghĩa là không có khung treo (đèn phải đặt chân đứng)
  riggingBeam: TrussBeam | null;
  topHeight: number;
}

let uid = 0;
function beam(from: Vec3, to: Vec3, thickness: number): TrussBeam {
  uid++;
  return { id: `beam-${uid}`, from, to, thickness };
}

/**
 * Thư viện mẫu kết cấu truss. Mỗi "mẫu" (preset) là 1 hàm sinh danh sách
 * beam khác nhau theo đúng kiểu kết cấu thật ngoài hiện trường. Tách khỏi
 * generateLayout để thêm/sửa mẫu không ảnh hưởng tới phần còn lại.
 */
export function generateTruss(
  type: KetCauChinh,
  p: TrussParams
): TrussResult {
  switch (type) {
    case "khong-dung-khung":
      return khongDungKhung(p);
    case "khung-hop-ground-support":
      return groundSupport(p);
    case "truss-khung-hop-co-mai":
      return khungHopCoMai(p);
    case "layer-truss-gian-khong-gian":
      return layerTrussGianKhongGian(p);
    case "cong-chu-u":
    case "tu-chon":
    default:
      return congChuU(p);
  }
}

// --- Không dựng khung: LED tự đứng trên chân, không có truss treo phía trên ---
function khongDungKhung(p: TrussParams): TrussResult {
  const halfW = p.stageWidth * 0.35;
  const legHeight = p.stageHeight + 5.5;
  const thickness = 0.18;
  const beams: TrussBeam[] = [
    beam(
      { x: -halfW, y: 0, z: p.zBack },
      { x: -halfW, y: legHeight, z: p.zBack },
      thickness
    ),
    beam(
      { x: halfW, y: 0, z: p.zBack },
      { x: halfW, y: legHeight, z: p.zBack },
      thickness
    ),
  ];
  return { beams, riggingBeam: null, topHeight: legHeight };
}

// --- Truss cổng chữ U: 2 chân + 1 đà ngang trên nóc (mẫu cơ bản, phổ biến nhất) ---
function congChuU(p: TrussParams): TrussResult {
  const trussWidth = p.stageWidth + 2;
  const height = 7;
  const legX = trussWidth / 2;
  const thickness = 0.3;

  const legLeft = beam(
    { x: -legX, y: 0, z: p.zBack },
    { x: -legX, y: height, z: p.zBack },
    thickness
  );
  const legRight = beam(
    { x: legX, y: 0, z: p.zBack },
    { x: legX, y: height, z: p.zBack },
    thickness
  );
  const top = beam(
    { x: -legX, y: height, z: p.zBack },
    { x: legX, y: height, z: p.zBack },
    thickness
  );

  return { beams: [legLeft, legRight, top], riggingBeam: top, topHeight: height };
}

// --- Ground support: tháp đôi 2 bên (2 ống chính + giằng chéo kiểu thang),
// nối nhau bằng nhiều lớp đà ngang — đúng cấu tạo truss tháp ground support
// phổ biến ngoài công trường (không phải thiết kế riêng của ứng dụng nào). ---
function groundSupport(p: TrussParams): TrussResult {
  const trussWidth = p.stageWidth + 2.4;
  const height = 8;
  const legX = trussWidth / 2;
  const towerDepth = 0.8; // khoảng cách 2 ống chính trong 1 tháp (theo trục z)
  const thickness = 0.28;
  const layerCount = 3; // số lớp đà ngang nối 2 tháp (tương ứng "Số thanh ngang")

  const beams: TrussBeam[] = [];

  // Mỗi tháp gồm 2 ống đứng (trước/sau) + giằng chéo zig-zag giữa 2 ống.
  function buildTower(x: number): { front: Vec3; back: Vec3 } {
    const zFront = p.zBack + towerDepth / 2;
    const zBack = p.zBack - towerDepth / 2;
    beams.push(beam({ x, y: 0, z: zFront }, { x, y: height, z: zFront }, thickness));
    beams.push(beam({ x, y: 0, z: zBack }, { x, y: height, z: zBack }, thickness));

    const braceSegments = 6;
    for (let i = 0; i < braceSegments; i++) {
      const y0 = (height / braceSegments) * i;
      const y1 = (height / braceSegments) * (i + 1);
      const from: Vec3 = { x, y: y0, z: i % 2 === 0 ? zFront : zBack };
      const to: Vec3 = { x, y: y1, z: i % 2 === 0 ? zBack : zFront };
      beams.push(beam(from, to, thickness * 0.5));
    }

    return { front: { x, y: height, z: zFront }, back: { x, y: height, z: zBack } };
  }

  buildTower(-legX);
  buildTower(legX);

  // Nhiều lớp đà ngang nối 2 tháp, rải đều từ giữa thân lên đỉnh.
  let topBeam: TrussBeam = beam(
    { x: -legX, y: height, z: p.zBack },
    { x: legX, y: height, z: p.zBack },
    thickness
  );
  for (let i = 0; i < layerCount; i++) {
    const t = layerCount === 1 ? 1 : 0.4 + (0.6 * i) / (layerCount - 1);
    const y = height * t;
    const layerBeam = beam(
      { x: -legX, y, z: p.zBack },
      { x: legX, y, z: p.zBack },
      thickness * (i === layerCount - 1 ? 1 : 0.7)
    );
    beams.push(layerBeam);
    if (i === layerCount - 1) topBeam = layerBeam;
  }

  return { beams, riggingBeam: topBeam, topHeight: height };
}

// --- Khung hộp có mái: 4 chân tạo thành khối hộp có mái che phía trên sân khấu ---
function khungHopCoMai(p: TrussParams): TrussResult {
  const trussWidth = p.stageWidth + 2.4;
  const roofDepth = p.stageDepth + 2;
  const height = 8.2;
  const legX = trussWidth / 2;
  const zFront = p.zBack + roofDepth / 2;
  const zRear = p.zBack - roofDepth / 2;
  const thickness = 0.35;

  const corners: [number, number][] = [
    [-legX, zFront],
    [legX, zFront],
    [-legX, zRear],
    [legX, zRear],
  ];

  const legs = corners.map(([x, z]) =>
    beam({ x, y: 0, z }, { x, y: height, z }, thickness)
  );

  const roofEdges = [
    beam(
      { x: -legX, y: height, z: zFront },
      { x: legX, y: height, z: zFront },
      thickness
    ),
    beam(
      { x: -legX, y: height, z: zRear },
      { x: legX, y: height, z: zRear },
      thickness
    ),
    beam(
      { x: -legX, y: height, z: zFront },
      { x: -legX, y: height, z: zRear },
      thickness
    ),
    beam(
      { x: legX, y: height, z: zFront },
      { x: legX, y: height, z: zRear },
      thickness
    ),
  ];

  const riggingBeam = roofEdges[0];

  return { beams: [...legs, ...roofEdges], riggingBeam, topHeight: height };
}

// --- Layer truss giàn không gian: 2 lớp đà song song nối bằng thanh chống đứng ---
function layerTrussGianKhongGian(p: TrussParams): TrussResult {
  const trussWidth = p.stageWidth + 2;
  const lowerHeight = 7;
  const upperHeight = 8.4;
  const legX = trussWidth / 2;
  const thickness = 0.28;

  const legLeft = beam(
    { x: -legX, y: 0, z: p.zBack },
    { x: -legX, y: upperHeight, z: p.zBack },
    thickness
  );
  const legRight = beam(
    { x: legX, y: 0, z: p.zBack },
    { x: legX, y: upperHeight, z: p.zBack },
    thickness
  );
  const lowerTop = beam(
    { x: -legX, y: lowerHeight, z: p.zBack },
    { x: legX, y: lowerHeight, z: p.zBack },
    thickness
  );
  const upperTop = beam(
    { x: -legX, y: upperHeight, z: p.zBack },
    { x: legX, y: upperHeight, z: p.zBack },
    thickness
  );
  // Thanh chống đứng nối 2 lớp, rải đều theo chiều ngang (giống giàn không gian thật)
  const strutCount = 5;
  const struts: TrussBeam[] = [];
  for (let i = 0; i < strutCount; i++) {
    const t = i / (strutCount - 1);
    const x = -legX + trussWidth * t;
    struts.push(
      beam(
        { x, y: lowerHeight, z: p.zBack },
        { x, y: upperHeight, z: p.zBack },
        thickness * 0.6
      )
    );
  }

  return {
    beams: [legLeft, legRight, lowerTop, upperTop, ...struts],
    riggingBeam: upperTop,
    topHeight: upperHeight,
  };
}
