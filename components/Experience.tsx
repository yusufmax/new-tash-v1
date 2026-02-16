import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, Environment } from '@react-three/drei';
import { ModelCity } from './ModelCity';
import { CameraController } from './CameraController';
import { DynamicClouds } from './Clouds';
import { useStore } from '../store/useStore';
import * as THREE from 'three';

import { POISystem } from './POISystem';

export const Experience: React.FC = () => {
  const isNight = useStore(state => state.isNight);

  return (
    <Canvas
      shadows
      camera={{ position: [0, 10, 50], fov: 45, near: 0.1, far: 1000 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: isNight ? 0.7 : 1.1, preserveDrawingBuffer: true }}
      className="w-full h-full"
    >
      <fog attach="fog" args={[isNight ? '#050505' : '#e0f2fe', 10, 150]} />
      <color attach="background" args={[isNight ? '#050505' : '#e0f2fe']} />

      <ambientLight intensity={isNight ? 0.2 : 0.6} />
      <directionalLight
        position={[50, 80, 40]}
        intensity={isNight ? 0.8 : 2.5}
        color={isNight ? "#818cf8" : "#fff7ed"} // Indigo tint at night, warm at day
        castShadow
        shadow-mapSize={[2048, 2048]} // High res shadows
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-bias={-0.0005} // Reduce shadow acne
      />

      {/* Fill Light for softness */}
      <directionalLight
        position={[-50, 20, -50]}
        intensity={isNight ? 0.4 : 0.6}
        color={isNight ? "#1e3a8a" : "#93c5fd"}
      />

      {/* City Environment for reflections */}
      <Environment preset={isNight ? "night" : "city"} environmentIntensity={isNight ? 0.5 : 0.6} />

      {/* Content */}
      <Suspense fallback={null}>
        <POISystem />
        <ModelCity />
        <DynamicClouds />
      </Suspense>

      {/* Logic */}
      <CameraController />
    </Canvas>
  );
};