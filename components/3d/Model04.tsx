"use client";

import { useGLTF, useAnimations } from "@react-three/drei";
import { memo, useEffect, useRef } from "react";
import useActions from "@/hooks/useActions";
import * as THREE from "three";


const Model04 = memo(() => {

    const groupRef = useRef<THREE.Group>(null);
    const { scene, animations } = useGLTF("/models/AvatarOP.glb");
    const { actions, names } = useAnimations(animations, groupRef);
    const { playAction, stopAction } = useActions(actions);


    console.log("model04 rendering");


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


    return (
        <group rotation={[0, 0, 0]} scale={1}>
            {/* model */}
            <primitive
                ref={groupRef}
                object={scene}
                scale={1.7}
                position={[3, -1, 2]}
                rotation={[-0.2, -0.5, 0]}
                frustumCulled
            />
            <mesh position={[0, -1.8, 2]} rotation={[0, 0, 0]} >
                <boxGeometry args={[16, 1.5, 1, 1]} />
                <meshStandardMaterial color="#000000" metalness={0.8} roughness={0.56} />
            </mesh>

        </group>
    )
}
);

Model04.displayName = "Model04";

export default Model04
