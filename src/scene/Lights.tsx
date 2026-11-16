import { useMemo } from "react";
import * as THREE from "three";
import type { LightFixture } from "../types/layout";

function Beam({ fixture }: { fixture: LightFixture }) {
  const { midpoint, quaternion, length } = useMemo(() => {
    const from = new THREE.Vector3(
      fixture.position.x,
      fixture.position.y,
      fixture.position.z
    );
    const to = new THREE.Vector3(
      fixture.target.x,
      fixture.target.y,
      fixture.target.z
    );
    const dir = new THREE.Vector3().subVectors(to, from);
    const len = dir.length();
    const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize()
    );
    return { midpoint: mid, quaternion: q, length: len };
  }, [fixture]);

  return (
    <group position={midpoint} quaternion={quaternion}>
      {/* Thân đèn: khối nhỏ gắn trên truss */}
      <mesh position={[0, length / 2, 0]}>
        <boxGeometry args={[0.25, 0.2, 0.25]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* Tia sáng: hình nón trong suốt, additive blending để trông như ánh sáng thật */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[0.55, length, 16, 1, true]} />
        <meshBasicMaterial
          color={fixture.color}
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export function Lights({ fixtures }: { fixtures: LightFixture[] }) {
  return (
    <group>
      {fixtures.map((f) => (
        <Beam key={f.id} fixture={f} />
      ))}
    </group>
  );
}
