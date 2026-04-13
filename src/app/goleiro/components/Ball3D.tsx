'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Generate a soccer ball texture procedurally (white with black pentagons)
function createSoccerTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // White base
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  // Draw black pentagon pattern
  ctx.fillStyle = '#222222';
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 3;

  const spots = [
    { x: 128, y: 128, r: 55 },
    { x: 384, y: 128, r: 55 },
    { x: 256, y: 256, r: 60 },
    { x: 128, y: 384, r: 55 },
    { x: 384, y: 384, r: 55 },
    { x: 64, y: 256, r: 45 },
    { x: 448, y: 256, r: 45 },
    { x: 256, y: 64, r: 45 },
    { x: 256, y: 448, r: 45 },
  ];

  for (const spot of spots) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const px = spot.x + spot.r * Math.cos(angle);
      const py = spot.y + spot.r * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // Seam lines between pentagons
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth = 2;
  for (let i = 0; i < spots.length; i++) {
    for (let j = i + 1; j < spots.length; j++) {
      const dx = spots[j].x - spots[i].x;
      const dy = spots[j].y - spots[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        ctx.beginPath();
        ctx.moveTo(spots[i].x, spots[i].y);
        ctx.lineTo(spots[j].x, spots[j].y);
        ctx.stroke();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

interface BallMeshProps {
  screenX: number;
  screenY: number;
  size: number;
  rotation: number;
  visible: boolean;
}

function BallMesh({ screenX, screenY, size, rotation, visible }: BallMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const [geometry, material] = useMemo(() => {
    const geo = new THREE.SphereGeometry(1, 32, 32);
    const tex = createSoccerTexture();
    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.35,
      metalness: 0.05,
      bumpMap: tex,
      bumpScale: 0.02,
    });
    return [geo, mat];
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.visible = visible;
    if (!visible) return;

    const x3d = (screenX - 0.5) * 8;
    const y3d = -(screenY - 0.5) * 6;

    meshRef.current.position.set(x3d, y3d, 0);

    const scale = size * 3;
    meshRef.current.scale.setScalar(Math.max(0.05, scale));

    const rad = (rotation * Math.PI) / 180;
    meshRef.current.rotation.x += 0.03;
    meshRef.current.rotation.y = rad;
    meshRef.current.rotation.z = rad * 0.3;
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} />;
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
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-3, -2, 4]} intensity={0.5} />
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
