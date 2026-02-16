import React, { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useStore } from '../store/useStore';
import * as THREE from 'three';

export const ModelCity: React.FC = () => {
    const { scene } = useGLTF('/city.glb');
    const isExploded = useStore((state) => state.isExploded);

    useEffect(() => {
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;

                // Optional: Material adjustments if needed
                // const mesh = child as THREE.Mesh;
                // if (mesh.material) { ... }
            }
        });
    }, [scene]);

    return (
        <primitive
            object={scene}
            position={[0, -2, 0]}
            scale={[2, 2, 2]} // Adjust scale if needed, usually models come in small
        />
    );
};

useGLTF.preload('/city.glb');
