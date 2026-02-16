import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store/useStore';

export const TrafficSystem: React.FC = () => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const layers = useStore((state) => state.layers);

    // Check if transport layer is active (id: 'transport')
    const isTransportActive = layers.find(l => l.id === 'transport')?.active;

    const count = 50; // Number of cars

    // Define simple roads (loops)
    const curves = useMemo(() => [
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(-40, 0.5, -40),
            new THREE.Vector3(40, 0.5, -40),
            new THREE.Vector3(40, 0.5, 40),
            new THREE.Vector3(-40, 0.5, 40),
        ], true), // Closed loop outer
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(-20, 0.5, -20),
            new THREE.Vector3(-20, 0.5, 20),
            new THREE.Vector3(20, 0.5, 20),
            new THREE.Vector3(20, 0.5, -20),
        ], true), // Closed loop inner
    ], []);

    // Initialize car data
    const cars = useMemo(() => {
        return Array.from({ length: count }).map((_, i) => ({
            curveIndex: i % curves.length,
            speed: 0.0005 + Math.random() * 0.0005,
            offset: Math.random(), // 0 to 1 position on curve
            color: new THREE.Color().setHSL(Math.random(), 0.8, 0.5),
        }));
    }, [curves]);

    // Temp objects for updating instances
    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame(() => {
        if (!meshRef.current || !isTransportActive) return;

        cars.forEach((car, i) => {
            // Update position
            car.offset += car.speed;
            if (car.offset > 1) car.offset -= 1;

            // Get point on curve
            const curve = curves[car.curveIndex];
            const position = curve.getPointAt(car.offset);
            const tangent = curve.getTangentAt(car.offset);

            // orient car
            dummy.position.copy(position);
            dummy.lookAt(position.clone().add(tangent));
            dummy.updateMatrix();

            meshRef.current!.setMatrixAt(i, dummy.matrix);
            meshRef.current!.setColorAt(i, car.color);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    });

    // If layer is not active, we still render the mesh but could hide it.
    // Returning null completely removes it from scene, which is fine.
    if (!isTransportActive) return null;

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <boxGeometry args={[2, 1, 4]} /> {/* Car shape */}
            <meshStandardMaterial />
        </instancedMesh>
    );
};
