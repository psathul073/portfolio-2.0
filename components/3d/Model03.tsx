"use client";

import { useGLTF, useAnimations } from "@react-three/drei";
import { memo, useCallback, useEffect, useRef } from "react";
import useActions from "@/hooks/useActions";
import * as THREE from "three";


interface Model03PropType {
    onNavigate: () => void,
}

const Model03 = memo(({ onNavigate }: Model03PropType) => {

    const groupRef = useRef<THREE.Group>(null);
    const { scene, animations } = useGLTF("/models/ContactOP.glb");
    const { actions, names } = useAnimations(animations, groupRef);
    const { playAction, stopAction } = useActions(actions);

    console.log("model03 rendering");


    // Play animation on initial mount
    useEffect(() => {
        if (!actions || !names || names.length === 0) return;

        // Animation["Looking"]
        const a = playAction(names[0], 0.5, true);
        // cleanup when unmount...
        return () => {
            stopAction(a, 0.1);
        };
    }, [actions, names, playAction, stopAction]);


    const handleClick = useCallback((e: Event) => {
        e.stopPropagation();
        onNavigate();
    }, [onNavigate])

    return (
        <group position={[-6.5, -5, 0]} rotation={[-0.15, 0.5, 0]} >
            {/* stage */}
            <mesh position={[0, 0, 0]} receiveShadow>
                <cylinderGeometry args={[0.8, 1.2, 7, 30]} />
                <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* model */}
            <primitive
                ref={groupRef}
                object={scene}
                position={[0, 4, 0]}
                onPointerEnter={() => document.body.style.cursor = 'pointer'}
                onPointerLeave={() => document.body.style.cursor = 'auto'}
                onClick={handleClick}
                frustumCulled
            />
        </group>
    )
}
)

Model03.displayName = "Model03";

export default Model03
