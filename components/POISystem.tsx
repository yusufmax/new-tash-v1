import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import { useStore } from '../store/useStore';
import { CameraMode } from '../types';
import * as THREE from 'three';

// Data for Points of Interest
export const POI_DATA = [
    {
        id: 'business-center',
        title: 'Деловой Центр',
        description: 'Международный хаб для бизнеса и инноваций.',
        position: [0, 5, 0], // Center
    },
    {
        id: 'eco-park',
        title: 'Эко Парк',
        description: 'Огромная зеленая зона для отдыха и спорта.',
        position: [20, 2, 10], // Slightly offset
    },
    {
        id: 'smart-transit',
        title: 'Умный Транспорт',
        description: 'Интегрированная сеть метро и электробусов.',
        position: [-10, 2, 20],
    },
    {
        id: 'cultural-hub',
        title: 'Культурный Хаб',
        description: 'Музеи, театры и выставочные залы нового поколения.',
        position: [10, 2, -10],
    }
];

export const POISystem: React.FC = () => {
    const setActivePOI = useStore((state) => state.setActivePOI);
    const activePOI = useStore((state) => state.activePOI);
    const isNight = useStore((state) => state.isNight);
    const mode = useStore((state) => state.mode);

    // Only visible in EXPLORE mode
    if (mode !== CameraMode.EXPLORE) return null;

    return (
        <group>
            {POI_DATA.map((poi) => (
                <group key={poi.id} position={new THREE.Vector3(...poi.position)}>
                    <Html
                        position={[0, 4, 0]} // Float higher
                        center
                        distanceFactor={20} // Larger distance factor
                        occlude
                        scale={1.5} // 50% larger
                        zIndexRange={[100, 0]}
                    >
                        <div
                            className={`cursor-pointer group relative flex flex-col items-center justify-center transition-all duration-300 ${activePOI === poi.id ? 'opacity-0 pointer-events-none' : 'opacity-100'
                                }`}
                            onClick={(e) => { e.stopPropagation(); setActivePOI(poi.id); }}
                        >
                            {/* Outer Glow Ring - Larger */}
                            <div className="absolute w-12 h-12 rounded-full border-2 border-teal-400 opacity-50 animate-ping"></div>

                            {/* Core Dot - Larger */}
                            <div className={`w-6 h-6 rounded-full shadow-[0_0_15px_currentColor] transition-colors duration-300 ${isNight ? 'bg-teal-400 text-teal-400' : 'bg-teal-600 text-teal-600'} hover:scale-110`}></div>

                            {/* Label (Always visible in Explore mode or on Hover? User said "better buttons", let's keep hover/always check) */}
                            {/* Let's make label always visible but subtle, pops on hover */}
                            <div className={`absolute top-8 whitespace-nowrap text-xs font-bold tracking-widest uppercase transition-all duration-300 ${isNight ? 'text-teal-400' : 'text-teal-600'} bg-black/50 backdrop-blur-sm px-2 py-1 rounded opacity-100`}>
                                {poi.title}
                            </div>
                        </div>
                    </Html>

                    {/* Vertical line connector */}
                    <mesh position={[0, 2, 0]}>
                        <cylinderGeometry args={[0.08, 0.08, 4]} />
                        <meshBasicMaterial color={isNight ? "#2dd4bf" : "#0d9488"} transparent opacity={0.3} />
                    </mesh>
                </group>
            ))}
        </group>
    );
};
