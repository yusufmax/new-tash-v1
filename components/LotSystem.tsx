import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

export const LotSystem: React.FC = () => {
    const lots = useStore((state) => state.lots);
    const activeLot = useStore((state) => state.activeLot);
    const setActiveLot = useStore((state) => state.setActiveLot);
    const [hovered, setHovered] = useState<string | null>(null);

    return (
        <group>
            {lots.map((lot) => {
                const isActive = activeLot === lot.id;
                const isHovered = hovered === lot.id;

                // Color based on status
                let baseColor = "#3b82f6"; // Blue (Available default)
                if (lot.status === 'sold') baseColor = "#ef4444"; // Red
                if (lot.status === 'reserved') baseColor = "#eab308"; // Yellow

                // Visual feedback
                const color = isActive ? "#2dd4bf" : (isHovered ? "#60a5fa" : baseColor);
                const opacity = isActive ? 0.6 : (isHovered ? 0.4 : 0.2);

                return (
                    <group
                        key={lot.id}
                        position={new THREE.Vector3(...lot.position)}
                    >
                        {/* The Lot Plane */}
                        <mesh
                            rotation={[-Math.PI / 2, 0, 0]}
                            onClick={(e) => { e.stopPropagation(); setActiveLot(lot.id); }}
                            onPointerOver={(e) => { e.stopPropagation(); setHovered(lot.id); document.body.style.cursor = 'pointer'; }}
                            onPointerOut={(e) => { e.stopPropagation(); setHovered(null); document.body.style.cursor = 'auto'; }}
                        >
                            <planeGeometry args={lot.size} />
                            <meshBasicMaterial
                                color={color}
                                transparent
                                opacity={opacity}
                                side={THREE.DoubleSide}
                                depthWrite={false}
                            />
                        </mesh>

                        {/* Outline */}
                        <lineSegments rotation={[-Math.PI / 2, 0, 0]}>
                            <edgesGeometry args={[new THREE.PlaneGeometry(lot.size[0], lot.size[1])]} />
                            <lineBasicMaterial color={color} opacity={0.8} transparent />
                        </lineSegments>

                        {/* Simple Price Label on Hover/Active */}
                        {(isHovered || isActive) && (
                            <Html position={[0, 2, 0]} center distanceFactor={15}>
                                <div className="bg-black/80 text-white text-xs px-2 py-1 rounded backdrop-blur-sm whitespace-nowrap">
                                    {lot.price}
                                </div>
                            </Html>
                        )}
                    </group>
                );
            })}
        </group>
    );
};
