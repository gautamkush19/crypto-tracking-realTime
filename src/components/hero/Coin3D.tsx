import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Coin3D = ({ color = "#e2b96b" }) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002;
      meshRef.current.rotation.y += 0.008;
      meshRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Main coin disc */}
      <mesh>
        <cylinderGeometry args={[2, 2, 0.2, 64]} />
        <meshStandardMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Edge rim */}
      <mesh position={[0, 0.15, 0]}>
        <torusGeometry args={[2, 0.1, 32, 100]} />
        <meshStandardMaterial
          color={"#f4ce7b"}
          metalness={0.9}
          roughness={0.1}
          emissive={"#f4ce7b"}
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Inner pattern */}
      <mesh>
        <cylinderGeometry args={[1.8, 1.8, 0.15, 64]} />
        <meshStandardMaterial
          color={"#d4a855"}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[2.3, 32, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.1}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
    </group>
  );
};

export { Coin3D };
