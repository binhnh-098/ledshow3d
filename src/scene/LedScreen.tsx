import { Html } from "@react-three/drei";
import type { LedScreen as LedScreenType } from "../types/layout";

export function LedScreen({ screen }: { screen: LedScreenType }) {
  return (
    <group position={[screen.position.x, screen.position.y, screen.position.z]}>
      <mesh castShadow>
        <boxGeometry args={[screen.width, screen.height, 0.15]} />
        <meshStandardMaterial color="#05070a" />
      </mesh>
      {/* Mặt hiển thị: phát sáng nhẹ để trông giống màn LED đang bật */}
      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[screen.width * 0.97, screen.height * 0.95]} />
        <meshStandardMaterial
          color="#0b63d1"
          emissive="#1f7ae0"
          emissiveIntensity={0.6}
        />
      </mesh>
      {/* Nhãn thông số kỹ thuật màn LED, giống cách các app dựng sân khấu thật hay ghi chú */}
      <Html position={[0, 0, 0.1]} center transform distanceFactor={14} occlude>
        <div className="ledLabel">
          <b>MÀN CHÍNH</b>
          <span>
            {screen.resolutionW} × {screen.resolutionH} px
          </span>
          <small>P{screen.pitchMm}</small>
        </div>
      </Html>
    </group>
  );
}
