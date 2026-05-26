import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import * as THREE from "three";
import { Coin3D } from "./Coin3D";
import { Particles } from "./Particles";

const Scene = () => {
  const { scene, camera } = useThree();

  useEffect(() => {
    // Lighting setup
    const ambientLight = new THREE.AmbientLight("#ffffff", 0.6);
    const directionalLight = new THREE.DirectionalLight("#ffffff", 0.8);
    directionalLight.position.set(10, 10, 10);
    const pointLight1 = new THREE.PointLight("#e2b96b", 0.8, 100);
    pointLight1.position.set(-10, 5, 10);
    const pointLight2 = new THREE.PointLight("#75a7ff", 0.6, 100);
    pointLight2.position.set(10, -5, 10);

    scene.add(ambientLight, directionalLight, pointLight1, pointLight2);
    camera.position.z = 5;

    return () => {
      scene.remove(ambientLight, directionalLight, pointLight1, pointLight2);
    };
  }, [scene, camera]);

  return (
    <>
      <Suspense fallback={null}>
        <Coin3D />
        <Particles count={800} />
      </Suspense>
    </>
  );
};

export function Hero3DCanvas() {
  return (
    <div className='hero-3d-canvas'>
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: false,
        }}
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        <color attach='background' args={["#090c10"]} />
        <Scene />
      </Canvas>
    </div>
  );
}
