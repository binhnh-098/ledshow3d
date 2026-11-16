import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { TrussBeam } from "../types/layout";
import { buildTrussGeometry, type Joint, type Segment } from "./trussGeometry";

const CHORD_RADIUS = 0.028;
const WEB_RADIUS = 0.016;

/**
 * Render 1 nhóm đoạn thẳng (ống chính hoặc giằng chéo) bằng InstancedMesh —
 * vì truss thật có thể có hàng trăm giằng chéo nhỏ, dùng instancing để chỉ
 * tốn 1 draw call thay vì hàng trăm <mesh>.
 */
function SegmentInstances({
  segments,
  radius,
  color,
}: {
  segments: Segment[];
  radius: number;
  color: string;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);

  const transforms = useMemo(() => {
    return segments.map((seg) => {
      const dir = new THREE.Vector3().subVectors(seg.to, seg.from);
      const length = dir.length();
      const mid = new THREE.Vector3().addVectors(seg.from, seg.to).multiplyScalar(0.5);
      const quat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dir.clone().normalize()
      );
      return { mid, quat, length };
    });
  }, [segments]);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const m = new THREE.Matrix4();
    transforms.forEach((t, i) => {
      m.compose(t.mid, t.quat, new THREE.Vector3(1, t.length, 1));
      ref.current!.setMatrixAt(i, m);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  }, [transforms]);

  if (segments.length === 0) return null;

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, segments.length]} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, 1, 8]} />
      <meshStandardMaterial color={color} metalness={0.85} roughness={0.35} />
    </instancedMesh>
  );
}

/**
 * Quả cầu nhỏ tại mỗi điểm giao (khớp) — che kín chỗ 2-3 đoạn truss gặp
 * nhau, vì mỗi đoạn tự tính hướng tiết diện tam giác riêng nên các ống
 * không bao giờ khớp tuyệt đối về góc xoay tại điểm nối. Đây là cách làm
 * phổ biến khi mô phỏng truss (mô phỏng khớp nối/ắc-co thật ngoài công trường).
 */
function JointInstances({ joints, color }: { joints: Joint[]; color: string }) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    const m = new THREE.Matrix4();
    joints.forEach((j, i) => {
      m.compose(
        j.position,
        new THREE.Quaternion(),
        new THREE.Vector3(j.radius, j.radius, j.radius)
      );
      ref.current!.setMatrixAt(i, m);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  }, [joints]);

  if (joints.length === 0) return null;

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, joints.length]} castShadow receiveShadow>
      <sphereGeometry args={[1, 10, 10]} />
      <meshStandardMaterial color={color} metalness={0.85} roughness={0.3} />
    </instancedMesh>
  );
}

export function RealisticTruss({ beams }: { beams: TrussBeam[] }) {
  const { chordSegments, webSegments, joints } = useMemo(
    () => buildTrussGeometry(beams),
    [beams]
  );

  return (
    <group>
      <SegmentInstances segments={chordSegments} radius={CHORD_RADIUS} color="#d8d8d8" />
      <SegmentInstances segments={webSegments} radius={WEB_RADIUS} color="#9a9a9a" />
      <JointInstances joints={joints} color="#cfcfcf" />
    </group>
  );
}
