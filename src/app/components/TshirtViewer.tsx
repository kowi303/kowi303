"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useLayoutEffect } from "react";
import * as THREE from "three";

function TshirtModel() {
  const { scene } = useGLTF("/tshirt.glb");

  useLayoutEffect(() => {
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxSize = 1;
    const targetSize = 0.08;

    scene.position.sub(center);
    if (Number.isFinite(maxSize) && maxSize > 0) {
      scene.scale.setScalar(targetSize / maxSize);
    }

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        materials.forEach((material) => {
          if (!material) return;
          material.side = THREE.DoubleSide;
          if ("roughness" in material) material.roughness = 0.75;
          if ("metalness" in material) material.metalness = 0.1;
          material.needsUpdate = true;
        });
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
}

export default function TshirtViewer() {
  return (
    <div className="tshirt-viewer" aria-label="Anteprima 3D maglia">
      <Canvas
        camera={{ position: [0, 0, 2.6], fov: 45, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.2} color="#fff2dd" />
        <hemisphereLight intensity={0.7} color="#ffe2b3" groundColor="#2f2a24" />
        <directionalLight position={[2, 2, 2]} intensity={1.6} color="#ffb25a" />
        <directionalLight position={[-2, 1, -2]} intensity={1.1} color="#ff7a2f" />
        <pointLight position={[0, 1.4, 1.4]} intensity={1.2} color="#ff9c45" />
        <pointLight position={[0, -1.2, 1.2]} intensity={0.8} color="#ff6b2c" />
        <Suspense fallback={null}>
          <TshirtModel />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={1.2}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          rotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/tshirt.glb");
