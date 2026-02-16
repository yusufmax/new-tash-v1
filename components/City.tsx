import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../store/useStore';

const BUILDINGS_COUNT = 450;
const GRID_SIZE = 70;

export const City: React.FC = () => {
  const layers = useStore((state) => state.layers);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const transportRef = useRef<THREE.InstancedMesh>(null);

  // Memoize geometry data generation to avoid recalculating on every render
  const { dummy, buildings, transportPaths } = useMemo(() => {
    const dummy = new THREE.Object3D();
    const buildings = [];
    const transportPaths = [];

    // Generate Buildings
    for (let i = 0; i < BUILDINGS_COUNT; i++) {
      const x = (Math.random() - 0.5) * GRID_SIZE;
      const z = (Math.random() - 0.5) * GRID_SIZE;

      // Avoid center path (river/main road)
      if (Math.abs(x) < 4 && Math.abs(z) < 60) continue;

      // Keep clear area around origin for cinematic start
      if (Math.sqrt(x * x + z * z) < 8) continue;

      const scaleY = Math.random() * Math.random() * 12 + 1; // Random heights
      const scaleX = Math.random() * 1.5 + 1;
      const scaleZ = Math.random() * 1.5 + 1;

      buildings.push({
        position: [x, scaleY / 2, z],
        scale: [scaleX, scaleY, scaleZ],
        isGreen: Math.random() > 0.8 // 20% chance to be a green building
      });
    }

    // Generate Transport nodes
    for (let i = 0; i < 60; i++) {
      const x = (Math.random() - 0.5) * GRID_SIZE;
      const z = (Math.random() - 0.5) * GRID_SIZE;
      if (Math.abs(x) > 5) continue; // Keep mostly to center highway
      transportPaths.push({ position: [x, 5, z], speed: Math.random() * 0.1 + 0.05, offset: Math.random() * 100 });
    }

    return { dummy, buildings, transportPaths };
  }, []);

  const explodedFactor = useRef(0);

  // Update logic for layout and visibility
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // 1. Animate Explosion Factor
    const targetFactor = useStore.getState().isExploded ? 1 : 0;
    explodedFactor.current = THREE.MathUtils.lerp(explodedFactor.current, targetFactor, delta * 3);
    const factor = explodedFactor.current;

    // Buildings
    const buildingsLayer = layers.find(l => l.id === 'buildings');
    const greeneryLayer = layers.find(l => l.id === 'greenery');

    // Store colors for performance
    const buildingColor = new THREE.Color(layers.find(l => l.id === 'buildings')?.color || '#e5e5e5');
    // Teal/Cyan color for green spaces
    const greenColor = new THREE.Color('#2dd4bf');

    buildings.forEach((data, i) => {
      let yOffset = 0;

      let visible = true;
      let color = buildingColor;

      if (data.isGreen) {
        if (!greeneryLayer?.active) visible = false;
        color = greenColor;
        // Greenery goes highest
        yOffset = 20 * factor;
      } else {
        if (!buildingsLayer?.active) visible = false;
        // Buildings stay or move slightly
        yOffset = 0 * factor;
      }

      // Additional general lift for all buildings to separate from ground/water if needed
      // But for now, let's keep buildings grounded and lift greenery/transport

      dummy.position.set(
        data.position[0] as number,
        (data.position[1] as number) + yOffset,
        data.position[2] as number
      );
      dummy.scale.set(data.scale[0] as number, data.scale[1] as number, data.scale[2] as number);
      dummy.updateMatrix();

      if (!visible) {
        dummy.scale.set(0, 0, 0);
        dummy.updateMatrix();
      }

      meshRef.current!.setMatrixAt(i, dummy.matrix);
      meshRef.current!.setColorAt(i, color);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;

    // Transport Animation
    if (transportRef.current) {
      const transportLayer = layers.find(l => l.id === 'transport');
      // Bright Orange/Amber for contrast or Teal for monochrome
      const transportColor = new THREE.Color('#fbbf24');

      transportPaths.forEach((data, i) => {
        const time = state.clock.getElapsedTime();
        // Move along Z
        const z = (data.position[2] + time * 10) % GRID_SIZE - (GRID_SIZE / 2);

        // Transport lifts up the most
        const yOffset = 40 * factor;

        dummy.position.set(data.position[0] as number, (data.position[1] as number) + yOffset, z);
        dummy.scale.set(0.3, 0.1, 0.8); // Long sleek cars
        dummy.updateMatrix();

        if (!transportLayer?.active) {
          dummy.scale.set(0, 0, 0);
          dummy.updateMatrix();
        }

        transportRef.current!.setMatrixAt(i, dummy.matrix);
        transportRef.current!.setColorAt(i, transportColor);
      });
      transportRef.current.instanceMatrix.needsUpdate = true;
      if (transportRef.current.instanceColor) transportRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Floor / Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        {/* Darker ground for night mode contrast */}
        <meshStandardMaterial color="#0f172a" roughness={0.8} metalness={0.4} />
      </mesh>

      {/* Buildings Instanced Mesh */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, buildings.length]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.2} metalness={0.1} />
      </instancedMesh>

      {/* Transport Instanced Mesh */}
      <instancedMesh ref={transportRef} args={[undefined, undefined, transportPaths.length]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
};