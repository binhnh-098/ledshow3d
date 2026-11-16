import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useConfigStore } from "../store/useConfigStore";
import { generateLayout } from "../rules/generateLayout";
import { Ground } from "./Ground";
import { Stage } from "./Stage";
import { RealisticTruss } from "./RealisticTruss";
import { LedScreen } from "./LedScreen";
import { Tables } from "./Tables";
import { Lights } from "./Lights";
import { CameraRig } from "./CameraRig";

export function SceneRoot() {
  const config = useConfigStore((s) => s.config);
  // generateLayout là hàm thuần -> chỉ tính lại khi config thay đổi (useMemo)
  const layout = useMemo(() => generateLayout(config), [config]);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  return (
    <Canvas shadows camera={{ position: [0, 14, 28], fov: 45 }}>
      <color attach="background" args={["#0a0a0b"]} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <Environment preset="city" />

      <Ground width={layout.ground.width} depth={layout.ground.depth} />
      <Stage stage={layout.stage} />
      <RealisticTruss beams={layout.trussBeams} />
      <LedScreen screen={layout.ledScreen} />
      <Tables tables={layout.tables} />
      <Lights fixtures={layout.lights} />

      <CameraRig layout={layout} controlsRef={controlsRef} />
      <OrbitControls ref={controlsRef} makeDefault target={[0, 2, 0]} />
    </Canvas>
  );
}
