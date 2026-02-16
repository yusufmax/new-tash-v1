import React, { useLayoutEffect, useRef, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '../store/useStore';
import { CameraMode } from '../types';
import { MapControls } from '@react-three/drei';
import { POI_DATA } from './POISystem';

gsap.registerPlugin(ScrollTrigger);

// Define a cinematic path through the city
const CURVE_POINTS = [
  new THREE.Vector3(0, 60, 40),    // Bird's eye perspective view
  new THREE.Vector3(0, 40, 40),    // Descent towards the entrance
  new THREE.Vector3(5, 5, 40),     // Swoop down to street level
  new THREE.Vector3(-5, 2, 20),    // Through the district
  new THREE.Vector3(0, 8, 0),      // Center overlook
  new THREE.Vector3(8, 2, -20),    // Street level detail
  new THREE.Vector3(0, 30, -50),   // High exit view
];

const CURVE_LOOKATS = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 2, 20),
  new THREE.Vector3(10, 5, 0),
  new THREE.Vector3(-10, 0, -20),
  new THREE.Vector3(0, 0, -40),
  new THREE.Vector3(0, 0, 0),
];

export const CameraController: React.FC = () => {
  const { camera } = useThree();
  const setScrollProgress = useStore((state) => state.setScrollProgress);
  const mode = useStore((state) => state.mode);

  // Create the curve
  const curve = useMemo(() => new THREE.CatmullRomCurve3(CURVE_POINTS), []);
  const lookAtCurve = useMemo(() => new THREE.CatmullRomCurve3(CURVE_LOOKATS), []);

  // Animation Refs
  const progressRef = useRef({ value: 0 });
  const targetLookAt = useRef(new THREE.Vector3());
  const targetPos = useRef(new THREE.Vector3());

  // Current LookAt state for smoothing (separate from camera.position for independent damping)
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useLayoutEffect(() => {
    // Initialize starting positions to prevent jumping
    const startPos = curve.getPointAt(0);
    const startLook = lookAtCurve.getPointAt(0);

    camera.position.copy(startPos);
    currentLookAt.current.copy(startLook);
    camera.lookAt(startLook);

    // Setup ScrollTrigger
    // We trigger based on the .scroll-container defined in App.tsx
    const trigger = ScrollTrigger.create({
      trigger: ".scroll-container",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5, // Smooth scrubbing from GSAP
      onUpdate: (self) => {
        // Sync GSAP progress to our ref for useFrame to read
        progressRef.current.value = self.progress;
        setScrollProgress(self.progress);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [setScrollProgress, camera, curve, lookAtCurve]);

  const activePOI = useStore((state) => state.activePOI);

  useFrame((state, delta) => {
    // Priority: Active POI > Scroll Mode
    if (activePOI) {
      const targetPOI = POI_DATA.find(p => p.id === activePOI);
      if (targetPOI) {
        // Target position: POI position + offset (e.g., up and back)
        targetPos.current.set(targetPOI.position[0] - 5, targetPOI.position[1] + 5, targetPOI.position[2] + 10);

        // Target lookAt: POI position
        targetLookAt.current.set(targetPOI.position[0], targetPOI.position[1], targetPOI.position[2]);

        // Smoothly interpolate
        const damping = 1 - Math.exp(-2.0 * delta); // Faster move to POI
        camera.position.lerp(targetPos.current, damping);
        currentLookAt.current.lerp(targetLookAt.current, damping);
        camera.lookAt(currentLookAt.current);
        return; // Skip scroll logic
      }
    }

    // Only animate camera if in SCROLL mode
    if (mode === CameraMode.SCROLL) {
      const t = progressRef.current.value;

      // Sample target points on curve
      curve.getPointAt(t, targetPos.current);
      lookAtCurve.getPointAt(t, targetLookAt.current);

      // Cinematic Smoothing (Time-based damping)
      // Using delta ensures consistent speed across frame rates.
      // Adjusted for more stability (lower multiplier = slower/heavier)

      const positionDamping = 1 - Math.exp(-1.0 * delta); // Slower, heavier follow
      const lookAtDamping = 1 - Math.exp(-0.8 * delta); // Very smooth lookAt

      // Interpolate Position
      camera.position.lerp(targetPos.current, positionDamping);

      // Interpolate LookAt
      currentLookAt.current.lerp(targetLookAt.current, lookAtDamping);
      camera.lookAt(currentLookAt.current);
    }
  });

  return (
    <>
      {mode === CameraMode.EXPLORE && (
        <MapControls
          enableDamping
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={100}
          maxPolarAngle={Math.PI / 2 - 0.1}
        />
      )}
    </>
  );
};