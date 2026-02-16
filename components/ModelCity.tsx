import React, { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useStore } from '../store/useStore';
import * as THREE from 'three';

export const ModelCity: React.FC = () => {
    // Ensure the path is correct for production (relative to root)
    const modelPath = '/city.glb';
    console.log("Attempting to load GLTF from:", modelPath);

    const { scene } = useGLTF(modelPath, true, true, (loader) => {
        console.log("GLTF Loader initialized");
    });
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
