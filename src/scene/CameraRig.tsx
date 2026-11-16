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

const ARRIVE_EPSILON = 0.05;

/**
 * Khi bấm 1 góc nhìn (Chính diện/Cạnh/Trên...), camera "bay" mượt tới đúng
 * điểm đó trong ~1 giây — nhưng chuột vẫn LUÔN xoay tự do được (controls
 * không bao giờ bị khoá). Khi camera đã bay tới nơi, việc lerp tự dừng lại
 * để không "kéo" camera về lại giữa lúc người dùng đang tự xoay. Nếu người
 * dùng bắt đầu kéo chuột trong lúc đang bay, chuyến bay bị huỷ ngay để
 * không giành quyền điều khiển với người dùng.
 */
export function CameraRig({ layout, controlsRef }: Props) {
  const { camera } = useThree();
  const view = useViewStore((s) => s.activeView);

  const presetRef = useRef(getCameraPreset(view, layout));
  const flyingRef = useRef(false);

  useEffect(() => {
    presetRef.current = getCameraPreset(view, layout);
    flyingRef.current = true;

    const persp = camera as THREE.PerspectiveCamera;
    if (persp.isPerspectiveCamera) {
      const targetFov = view === "mat-bang" ? 18 : 45;
      persp.fov = targetFov;
      persp.updateProjectionMatrix();
    }
  }, [view, layout, camera]);

  // Người dùng chủ động kéo chuột -> huỷ chuyến bay, nhường toàn quyền điều khiển.
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const onStart = () => {
      flyingRef.current = false;
    };
    controls.addEventListener("start", onStart);
    return () => controls.removeEventListener("start", onStart);
  }, [controlsRef]);

  useFrame(() => {
    if (!flyingRef.current) return;
    const preset = presetRef.current;
    const targetPos = new THREE.Vector3(...preset.position);
    camera.position.lerp(targetPos, 0.08);

    if (controlsRef.current) {
      controlsRef.current.target.lerp(new THREE.Vector3(...preset.target), 0.08);
      controlsRef.current.update();
    }

    if (camera.position.distanceTo(targetPos) < ARRIVE_EPSILON) {
      flyingRef.current = false;
    }
  });

  return null;
}
