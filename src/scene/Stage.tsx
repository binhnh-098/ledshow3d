import type { StagePlatform } from "../types/layout";

export function Stage({ stage }: { stage: StagePlatform }) {
  return (
    <mesh
      position={[stage.center.x, stage.center.y, stage.center.z]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[stage.width, stage.height, stage.depth]} />
      <meshStandardMaterial color="#1b1f24" />
    </mesh>
  );
}
