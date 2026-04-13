'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Creates a soccer ball using IcosahedronGeometry.
 * The icosahedron naturally has pentagonal faces (12 pentagons)
 * which resembles a real soccer ball pattern.
 * We color pentagonal center faces black and the rest white.
 */
function createSoccerBall(): { geometry: THREE.BufferGeometry; material: THREE.Material } {
  const geo = new THREE.IcosahedronGeometry(1, 1);
  const positions = geo.attributes.position;
  const faceCount = positions.count / 3;

  // Assign colors per vertex: faces near icosahedron vertices = black (pentagons)
  const colors = new Float32Array(positions.count * 3);

  // Original icosahedron vertices (12 vertices of a regular icosahedron)
  const phi = (1 + Math.sqrt(5)) / 2;
  const icoVerts = [
    [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
    [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
    [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
  ].map(v => new THREE.Vector3(v[0], v[1], v[2]).normalize());

  for (let f = 0; f < faceCount; f++) {
    // Get face center
    const i0 = f * 3, i1 = f * 3 + 1, i2 = f * 3 + 2;
    const cx = (positions.getX(i0) + positions.getX(i1) + positions.getX(i2)) / 3;
    const cy = (positions.getY(i0) + positions.getY(i1) + positions.getY(i2)) / 3;
    const cz = (positions.getZ(i0) + positions.getZ(i1) + positions.getZ(i2)) / 3;
    const center = new THREE.Vector3(cx, cy, cz);

    // Check if this face is near an original icosahedron vertex (= pentagon center)
    let isPentagon = false;
    for (const v of icoVerts) {
      if (center.distanceTo(v) < 0.35) {
        isPentagon = true;
        break;
      }
    }

    const r = isPentagon ? 0.06 : 1.0;
    const g = isPentagon ? 0.06 : 1.0;
    const b = isPentagon ? 0.06 : 1.0;

    for (let v = 0; v < 3; v++) {
      colors[(f * 3 + v) * 3] = r;
      colors[(f * 3 + v) * 3 + 1] = g;
      colors[(f * 3 + v) * 3 + 2] = b;
    }
  }

  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.3,
    metalness: 0.05,
    flatShading: true,
  });

  return { geometry: geo, material: mat };
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

  const { geometry, material } = useMemo(() => createSoccerBall(), []);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.visible = visible;
    if (!visible) return;

    const x3d = (screenX - 0.5) * 8;
    const y3d = -(screenY - 0.5) * 6;
    meshRef.current.position.set(x3d, y3d, 0);

    const scale = size * 3;
    meshRef.current.scale.setScalar(Math.max(0.05, scale));

    meshRef.current.rotation.x += 0.04;
    meshRef.current.rotation.y += 0.02;
    meshRef.current.rotation.z = (rotation * Math.PI) / 180 * 0.3;
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
