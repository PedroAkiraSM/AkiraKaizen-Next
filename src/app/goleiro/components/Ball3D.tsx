'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';

interface BallMeshProps {
  /** Ball position in normalized coords (0-1) mapped to screen */
  screenX: number;
  screenY: number;
  /** Size factor (0 = far, 1 = close) */
  size: number;
  /** Rotation in degrees */
  rotation: number;
  /** Whether ball is visible */
  visible: boolean;
}

function BallMesh({ screenX, screenY, size, rotation, visible }: BallMeshProps) {
  const meshRef = useRef<THREE.Group>(null);
  const gltf = useLoader(GLTFLoader, '/assets/goleiro/ball.glb');

  const scene = useMemo(() => {
    const cloned = gltf.scene.clone();
    // Apply a white soccer ball material if model has no texture
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (!child.material.map) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.3,
            metalness: 0.1,
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

    // Convert normalized screen coords to Three.js coords
    // Three.js camera is at z=5, looking at 0,0,0
    // Map 0-1 screen coords to roughly -4 to 4 in 3D space
    const x3d = (screenX - 0.5) * 8;
    const y3d = -(screenY - 0.5) * 6; // flip Y

    meshRef.current.position.set(x3d, y3d, 0);

    // Scale based on ball size (simulates depth)
    const scale = size * 3;
    meshRef.current.scale.setScalar(Math.max(0.1, scale));

    // Rotation
    const rad = (rotation * Math.PI) / 180;
    meshRef.current.rotation.x = rad * 0.5;
    meshRef.current.rotation.y = rad;
    meshRef.current.rotation.z = rad * 0.3;
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
      style={{ zIndex: 2 }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-3, -2, 4]} intensity={0.4} />
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
