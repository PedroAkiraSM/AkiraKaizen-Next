'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import * as THREE from 'three';

interface BallMeshProps {
  screenX: number;
  screenY: number;
  size: number;
  rotation: number;
  visible: boolean;
}

function BallMesh({ screenX, screenY, size, rotation, visible }: BallMeshProps) {
  const meshRef = useRef<THREE.Group>(null);
  const gltf = useLoader(GLTFLoader, '/assets/goleiro/ball.glb', (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });

  const scene = useMemo(() => {
    const cloned = gltf.scene.clone();
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshStandardMaterial;
        const brightness = mat.color ? (mat.color.r + mat.color.g + mat.color.b) / 3 : 0.5;
        if (brightness > 0.3) {
          // White panels
          child.material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.25,
            metalness: 0.05,
          });
        } else {
          // Black pentagons
          child.material = new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 0.35,
            metalness: 0.02,
          });
        }
      }
    });
    return cloned;
  }, [gltf]);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.visible = visible;
    if (!visible) return;

    const x3d = (screenX - 0.5) * 8;
    const y3d = -(screenY - 0.5) * 6;
    meshRef.current.position.set(x3d, y3d, 0);

    const scale = size * 3;
    meshRef.current.scale.setScalar(Math.max(0.05, scale));

    // Continuous spin
    meshRef.current.rotation.x += 0.04;
    meshRef.current.rotation.y += 0.02;
    meshRef.current.rotation.z = (rotation * Math.PI) / 180 * 0.3;
  });

  return <primitive ref={meshRef} object={scene} />;
}

interface Ball3DProps {
  screenX: number;
  screenY: number;
  size: number;
  rotation: number;
  visible: boolean;
}

export default function Ball3D({ screenX, screenY, size, rotation, visible }: Ball3DProps) {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <directionalLight position={[-3, -2, 4]} intensity={0.6} />
        <BallMesh
          screenX={screenX}
          screenY={screenY}
          size={size}
          rotation={rotation}
          visible={visible}
        />
      </Canvas>
    </div>
  );
}
