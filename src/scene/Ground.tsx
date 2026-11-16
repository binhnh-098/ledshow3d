interface Props {
  width: number;
  depth: number;
}

export function Ground({ width, depth }: Props) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#2a2f36" />
      </mesh>
      <gridHelper args={[Math.max(width, depth), Math.max(width, depth)]} />
    </group>
  );
}
