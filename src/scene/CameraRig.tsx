import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useViewStore } from "../store/useViewStore";
import { getCameraPreset } from "./cameraPresets";
import type { StageLayout } from "../types/layout";

interface Props {
  layout: StageLayout;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}

/**
 * Không đổi camera đột ngột — mỗi khi người dùng bấm góc nhìn khác,
 * component này lerp (nội suy) vị trí camera + target mỗi frame cho tới khi
 * tới đúng điểm, giống hiệu ứng "bay camera" trong các app dựng sân khấu.
 * "Mặt bằng" dùng góc nhìn từ rất cao + FOV hẹp để gần giống chiếu đứng,
 * thay vì đổi hẳn sang OrthographicCamera (đơn giản hoá, đủ dùng cho bản vẽ nhanh).
 */
export function CameraRig({ layout, controlsRef }: Props) {
  const { camera } = useThree();
  const view = useViewStore((s) => s.activeView);

  const presetRef = useRef(getCameraPreset(view, layout));

  useEffect(() => {
    presetRef.current = getCameraPreset(view, layout);
    if (controlsRef.current) {
      controlsRef.current.enabled = view === "free";
    }
    const persp = camera as THREE.PerspectiveCamera;
    if (persp.isPerspectiveCamera) {
      const targetFov = view === "mat-bang" ? 18 : 45;
      persp.fov = targetFov;
      persp.updateProjectionMatrix();
    }
  }, [view, layout, camera, controlsRef]);

  useFrame(() => {
    const preset = presetRef.current;
    camera.position.lerp(
      new THREE.Vector3(...preset.position),
      0.08
    );
    if (controlsRef.current) {
      controlsRef.current.target.lerp(
        new THREE.Vector3(...preset.target),
        0.08
      );
      controlsRef.current.update();
    }
  });

  return null;
}
