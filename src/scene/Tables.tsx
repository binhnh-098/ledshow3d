import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { TableSeat } from "../types/layout";

/**
 * Hàng trăm bàn/ghế giống hệt nhau -> PHẢI dùng InstancedMesh thay vì tạo
 * từng <mesh> riêng, nếu không scene sẽ rất nặng (mỗi mesh là 1 draw call).
 * InstancedMesh gom tất cả lại thành 1 draw call duy nhất cho mỗi loại object.
 */
export function Tables({ tables }: { tables: TableSeat[] }) {
  const tableTopRef = useRef<THREE.InstancedMesh>(null);
  const chairRef = useRef<THREE.InstancedMesh>(null);

  const chairInstances = useMemo(() => {
    const list: { position: THREE.Vector3; rotationY: number }[] = [];
    for (const t of tables) {
      for (let i = 0; i < t.chairCount; i++) {
        const angle = (i / t.chairCount) * Math.PI * 2;
        const r = t.tableRadius + 0.5;
        list.push({
          position: new THREE.Vector3(
            t.tableCenter.x + Math.cos(angle) * r,
            0.45,
            t.tableCenter.z + Math.sin(angle) * r
          ),
          rotationY: -angle + Math.PI / 2,
        });
      }
    }
    return list;
  }, [tables]);

  useLayoutEffect(() => {
    if (!tableTopRef.current) return;
    const m = new THREE.Matrix4();
    tables.forEach((t, i) => {
      m.compose(
        new THREE.Vector3(t.tableCenter.x, 0.75, t.tableCenter.z),
        new THREE.Quaternion(),
        new THREE.Vector3(t.tableRadius, 1, t.tableRadius)
      );
      tableTopRef.current!.setMatrixAt(i, m);
    });
    tableTopRef.current.instanceMatrix.needsUpdate = true;
  }, [tables]);

  useLayoutEffect(() => {
    if (!chairRef.current) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    chairInstances.forEach((c, i) => {
      q.setFromEuler(new THREE.Euler(0, c.rotationY, 0));
      m.compose(c.position, q, new THREE.Vector3(1, 1, 1));
      chairRef.current!.setMatrixAt(i, m);
    });
    chairRef.current.instanceMatrix.needsUpdate = true;
  }, [chairInstances]);

  return (
    <group>
      <instancedMesh ref={tableTopRef} args={[undefined, undefined, tables.length]} castShadow>
        <cylinderGeometry args={[1, 1, 0.05, 24]} />
        <meshStandardMaterial color="#f2ede2" />
      </instancedMesh>
      <instancedMesh
        ref={chairRef}
        args={[undefined, undefined, chairInstances.length]}
        castShadow
      >
        <boxGeometry args={[0.45, 0.9, 0.45]} />
        <meshStandardMaterial color="#e8e2d4" />
      </instancedMesh>
    </group>
  );
}
