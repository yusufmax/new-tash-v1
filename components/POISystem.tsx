import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import { useStore } from '../store/useStore';
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

    return (
        <group>
            {POI_DATA.map((poi) => (
                <group key={poi.id} position={new THREE.Vector3(...poi.position)}>
                    <Html
                        position={[0, 2, 0]} // Float slightly above the point
                        center
                        distanceFactor={15}
                        occlude
                        scale={1}
                    >
                        <div
                            className={`cursor-pointer group relative flex flex-col items-center justify-center transition-all duration-300 ${activePOI === poi.id ? 'opacity-0 pointer-events-none' : 'opacity-100'
                                }`}
                            onClick={() => setActivePOI(poi.id)}
                        >
                            {/* Outer Glow Ring */}
                            <div className="absolute w-8 h-8 rounded-full border border-teal-400 opacity-50 animate-ping"></div>

                            {/* Core Dot */}
                            <div className={`w-4 h-4 rounded-full shadow-[0_0_10px_currentColor] transition-colors duration-300 ${isNight ? 'bg-teal-400 text-teal-400' : 'bg-teal-600 text-teal-600'}`}></div>

                            {/* Label (Hover only) */}
                            <div className={`absolute top-6 whitespace-nowrap text-[10px] font-bold tracking-widest uppercase transition-all duration-300 opacity-0 group-hover:opacity-100 ${isNight ? 'text-teal-400' : 'text-teal-600'}`}>
                                {poi.title}
                            </div>
                        </div>
                    </Html>

                    {/* Vertical line connector */}
                    <mesh position={[0, 1, 0]}>
                        <cylinderGeometry args={[0.05, 0.05, 2]} />
                        <meshBasicMaterial color={isNight ? "#2dd4bf" : "#0d9488"} transparent opacity={0.5} />
                    </mesh>
                </group>
            ))}
        </group>
    );
};
