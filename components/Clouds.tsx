import React, { useRef } from 'react';
import { Clouds, Cloud } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store/useStore';

export const DynamicClouds: React.FC = () => {
    const ref = useRef<THREE.Group>(null);
    const isNight = useStore(state => state.isNight);

    useFrame((state, delta) => {
        if (ref.current) {
            // Slow drift
            ref.current.rotation.y += delta * 0.02;
        }
    });

    // Cloud colors based on time of day
    const cloudColor = isNight ? "#1e293b" : "#ffffff";
    const sunColor = isNight ? "#0f172a" : "#ffffff";

    return (
        <group position={[0, 40, 0]}>
            <Clouds material={THREE.MeshStandardMaterial} limit={400} range={200}>
                <Cloud ref={ref} seed={1} bounds={60} volume={20} color={cloudColor} fade={30} speed={0.1} opacity={isNight ? 0.3 : 0.8} />
                <Cloud seed={2} bounds={60} volume={15} color={sunColor} fade={30} position={[0, 10, 0]} speed={0.1} opacity={0.5} />
            </Clouds>
        </group>
    );
};
