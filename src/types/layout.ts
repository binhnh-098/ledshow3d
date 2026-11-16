// Mô tả hình học đã được "tính toán sẵn" (layout), sinh ra từ EventConfig.
// Các component 3D chỉ việc đọc layout này và render, không tự tính toán gì thêm.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface TrussBeam {
  id: string;
  from: Vec3;
  to: Vec3;
  thickness: number; // cạnh tiết diện truss, m (vd 0.3 = truss 30cm)
}

export interface StagePlatform {
  width: number;
  depth: number;
  height: number;
  center: Vec3;
}

export interface LedScreen {
  width: number;
  height: number;
  position: Vec3;
  resolutionW: number;
  resolutionH: number;
  pitchMm: number;
}

export interface TableSeat {
  id: string;
  tableCenter: Vec3;
  tableRadius: number;
  chairCount: number;
}

export type LightType = "spot" | "wash";

export interface LightFixture {
  id: string;
  position: Vec3;
  target: Vec3;
  type: LightType;
  color: string;
  powerW: number;
}

export interface StageLayout {
  stage: StagePlatform;
  trussBeams: TrussBeam[];
  ledScreen: LedScreen;
  tables: TableSeat[];
  lights: LightFixture[];
  ground: { width: number; depth: number };
}
