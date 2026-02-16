import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../store/useStore';
import * as THREE from 'three';

export const WeatherSystem: React.FC = () => {
    const weather = useStore((state) => state.weather);
    const pointsRef = useRef<THREE.Points>(null);

    // Create particles based on weather type
    const particleCount = weather === 'rain' ? 3000 : (weather === 'snow' ? 1500 : 0);

    const particles = useMemo(() => {
        if (weather === 'sunny') return null;

        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount); // Fall speed

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100; // x: -50 to 50
            positions[i * 3 + 1] = Math.random() * 60;      // y: 0 to 60
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100; // z: -50 to 50

            // Random fall speed
            velocities[i] = weather === 'rain' ? 0.5 + Math.random() * 0.5 : 0.05 + Math.random() * 0.1;
        }

        return { positions, velocities };
    }, [weather, particleCount]);

    useFrame(() => {
        if (!pointsRef.current || !particles || weather === 'sunny') return;

        const positionAttribute = pointsRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
        const positions = positionAttribute.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
            // Update Y
            positions[i * 3 + 1] -= particles.velocities[i];

            // Reset if below ground
            if (positions[i * 3 + 1] < 0) {
                positions[i * 3 + 1] = 60;
                // Randomize X/Z slightly for variation
                positions[i * 3] = (Math.random() - 0.5) * 100;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
            }

            // Drift for snow
            if (weather === 'snow') {
                positions[i * 3] += Math.sin(Date.now() * 0.001 + i) * 0.02;
            }
        }

        positionAttribute.needsUpdate = true;
    });

    if (weather === 'sunny' || !particles) return null;

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.positions.length / 3}
                    array={particles.positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={weather === 'rain' ? 0.2 : 0.4}
                color={weather === 'rain' ? "#a5f3fc" : "#ffffff"}
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    );
};
