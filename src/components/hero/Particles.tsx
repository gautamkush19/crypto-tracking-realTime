import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Particles = ({ count = 1000 }) => {
  const meshRef = useRef<THREE.Points>(null);
  const positionAttribute = useRef<Float32Array | null>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

      const color = new THREE.Color();
      color.setHSL(
        (210 + Math.random() * 60) / 360,
        0.4 + Math.random() * 0.3,
        0.5 + Math.random() * 0.2,
      );

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, [count]);

  positionAttribute.current = particles.positions;

  useFrame((state) => {
    if (
      meshRef.current &&
      meshRef.current.geometry.attributes.position.array instanceof Float32Array
    ) {
      const positions = meshRef.current.geometry.attributes.position.array;

      for (let i = 0; i < positions.length; i += 3) {
        const index = i / 3;
        const velocity = 0.0005;
        positions[i + 1] -= velocity;

        if (positions[i + 1] < -10) {
          positions[i + 1] = 10;
        }
      }

      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach='attributes-color'
          count={count}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.6}
        fog={false}
      />
    </points>
  );
};

export { Particles };
