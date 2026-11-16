import * as THREE from "three";
import type { TrussBeam } from "../types/layout";

export interface Segment {
  from: THREE.Vector3;
  to: THREE.Vector3;
}

export interface Joint {
  position: THREE.Vector3;
  radius: number;
}

export interface TrussGeometryResult {
  chordSegments: Segment[];
  webSegments: Segment[];
  joints: Joint[];
}

const MODULE_SIZE = 1.2; // khoảng cách giữa các mắt giằng — gần đúng module truss thật (0,5-2m)

/**
 * Truss thật không phải 1 thanh đặc — là dàn ống tam giác: 3 ống chính (chord)
 * chạy dọc chiều dài + các thanh giằng chéo (web) nối zig-zag giữa 3 ống đó.
 * Hàm này tính ra toạ độ world của từng ống/giằng từ 1 "trục truss" trừu tượng
 * (beam.from -> beam.to) để component chỉ việc render, không cần biết hình học.
 */
export function buildTrussGeometry(
  beams: TrussBeam[]
): TrussGeometryResult {
  const chordSegments: Segment[] = [];
  const webSegments: Segment[] = [];
  // Gom các đầu mút trùng nhau (cùng toạ độ, làm tròn) thành 1 "khớp" —
  // mỗi khớp lưu lại kích thước truss lớn nhất quy tụ về đó, để quả cầu
  // che khớp đủ lớn bao trọn tiết diện tam giác của mọi đoạn gặp nhau.
  const jointMap = new Map<string, { position: THREE.Vector3; maxThickness: number }>();
  function registerJoint(p: THREE.Vector3, thickness: number) {
    const key = `${p.x.toFixed(2)}|${p.y.toFixed(2)}|${p.z.toFixed(2)}`;
    const existing = jointMap.get(key);
    if (existing) {
      existing.maxThickness = Math.max(existing.maxThickness, thickness);
    } else {
      jointMap.set(key, { position: p.clone(), maxThickness: thickness });
    }
  }

  for (const beam of beams) {
    const from = new THREE.Vector3(beam.from.x, beam.from.y, beam.from.z);
    const to = new THREE.Vector3(beam.to.x, beam.to.y, beam.to.z);
    const dir = new THREE.Vector3().subVectors(to, from);
    const length = dir.length();
    if (length < 0.001) continue;
    dir.normalize();

    registerJoint(from, beam.thickness);
    registerJoint(to, beam.thickness);

    const worldUp = new THREE.Vector3(0, 1, 0);
    const helper = Math.abs(dir.dot(worldUp)) > 0.95
      ? new THREE.Vector3(1, 0, 0)
      : worldUp;
    const right = new THREE.Vector3().crossVectors(dir, helper).normalize();
    const up = new THREE.Vector3().crossVectors(right, dir).normalize();

    const s = beam.thickness;
    // 3 đỉnh tam giác tiết diện (trong mặt phẳng right-up), tâm là trục beam gốc.
    const offsets = [
      right.clone().multiplyScalar(-s / 2).add(up.clone().multiplyScalar(-s * 0.29)),
      right.clone().multiplyScalar(s / 2).add(up.clone().multiplyScalar(-s * 0.29)),
      up.clone().multiplyScalar(s * 0.58),
    ];

    const chordPoints = offsets.map(() => [] as THREE.Vector3[]);
    const segCount = Math.max(2, Math.round(length / MODULE_SIZE));

    for (let i = 0; i <= segCount; i++) {
      const t = i / segCount;
      const base = new THREE.Vector3().lerpVectors(from, to, t);
      offsets.forEach((off, idx) => {
        chordPoints[idx].push(base.clone().add(off));
      });
    }

    // 3 ống chính: mỗi ống là 1 đoạn thẳng liên tục từ đầu tới cuối.
    for (let idx = 0; idx < 3; idx++) {
      chordSegments.push({
        from: chordPoints[idx][0],
        to: chordPoints[idx][segCount],
      });
    }

    // Giằng chéo zig-zag giữa từng cặp ống (3 mặt của lăng trụ tam giác).
    const pairs: [number, number][] = [
      [0, 1],
      [1, 2],
      [2, 0],
    ];
    for (const [a, b] of pairs) {
      for (let i = 0; i < segCount; i++) {
        const zig = i % 2 === 0;
        const p1 = zig ? chordPoints[a][i] : chordPoints[b][i];
        const p2 = zig ? chordPoints[b][i + 1] : chordPoints[a][i + 1];
        webSegments.push({ from: p1, to: p2 });
      }
    }
  }

  const joints: Joint[] = Array.from(jointMap.values()).map((j) => ({
    position: j.position,
    // Bán kính ngoại tiếp tam giác tiết diện ≈ 0.58*s — lấy dư 0.68*s để
    // chắc chắn che kín mọi đầu ống dù các đoạn gặp nhau xoay hướng khác nhau.
    radius: j.maxThickness * 0.68,
  }));

  return { chordSegments, webSegments, joints };
}
