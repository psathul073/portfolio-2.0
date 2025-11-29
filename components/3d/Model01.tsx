"use client";

import useActions from "@/hooks/useActions";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

// Types
interface GLTFResult extends THREE.Object3D {
    scene: THREE.Group;
    animations: THREE.AnimationClip[];
}

interface AvatarMesh extends THREE.Mesh {
    morphTargetDictionary?: MorphTargetDict;
    morphTargetInfluences?: number[];
}

type MorphTargetDict = Record<string, number>;

type MouthCue = { start: number; end: number; value: string };

const phonemeMap: Record<string, string> = {
    AI: "viseme_aa",
    E: "viseme_E",
    O: "viseme_O",
    U: "viseme_U",
    B: "viseme_PP",
    C: "viseme_CH",
    F: "viseme_FF",
    L: "viseme_RR",
    WQ: "viseme_U",
    rest: "viseme_sil",
};

function Model01() {
    const group = useRef<THREE.Group | null>(null);
    const { scene, animations } = useGLTF("/models/AvatarMainOP.glb") as unknown as GLTFResult;
    const { actions, names } = useAnimations(animations, group);
    const { playAction, stopAction} = useActions(actions)

    console.log("model01 rendering");

    // state
    const [mouthCues, setMouthCues] = useState<MouthCue[]>([]);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [isRotate, setIsRote] = useState<boolean>(false);
    const [disabled, setDisabled] = useState<boolean>(false);

    // audio element ref
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // collected meshes that have morph targets...
    const mouthMeshes = useRef<AvatarMesh[]>([]);

    // currently playing THREE action refs.
    const currentAction = useRef<THREE.AnimationAction | null>(null);
    const idleAction = useRef<THREE.AnimationAction | null>(null);


    // find morph-target meshes once.
    useEffect(() => {
        const meshes: AvatarMesh[] = [];
        scene.traverse((obj) => {
            if ((obj as AvatarMesh).morphTargetDictionary) meshes.push(obj as AvatarMesh);
        });
        mouthMeshes.current = meshes;
    }, [scene]);


    // start idle animation on mount (if an animation exists)...
    useEffect(() => {
        if (!actions || !names || names.length === 0) return;

        // Animation["Looking"]
        const a = playAction(names[1], 0.5, true);
        idleAction.current = a ?? null;
        // cleanup when unmount..
        return () => {
            stopAction(a, 0.1);
        };
    }, [actions, names, playAction, stopAction]);

    // Load mouth cues & audio.
    const loadMouthData = useCallback(async () => {
        try {
            const jsonPath = "/audio/voice.json";
            const audioPath = "/audio/voice.wav";

            const res = await fetch(jsonPath);
            if (!res.ok) {
                throw new Error(`Failed to load JSON: ${res.status}`);
            }

            const data = await res.json();
            setMouthCues(data.mouthCues ?? []);

            const audio = new Audio(audioPath);
            audioRef.current = audio;
            return audio;
        } catch (error) {
            console.error("Error loading mouth data:", error);
            throw error;
        }
    }, []);

    // when playing audio, animate visemes synchronized to audio.currentTime...
    // 👄 Animate mouth by phoneme timing...
    // useEffect(() => {
    //     if (!isPlayingAudio || !mouthCues.length) return;

    //     let raf = 0;

    //     const animate = () => {
    //         const audio = audioRef.current;
    //         const currentTime = audio ? audio.currentTime : 0;

    //         const cue = mouthCues.find(
    //             (c) => currentTime >= c.start && currentTime <= c.end
    //         );

    //         mouthMeshes.current.forEach((mesh) => {
    //             const d = mesh.morphTargetDictionary!;
    //             const i = mesh.morphTargetInfluences!;

    //             // reset all
    //             Object.keys(d).forEach((k) => {
    //                 const idx = d[k];
    //                 i[idx] = i[idx] * 0.7; // smooth fade-out
    //             });

    //             if (!cue) return;

    //             const viseme = phonemeMap[cue.value];
    //             if (viseme && d[viseme] !== undefined) {
    //                 const idx = d[viseme];
    //                 i[idx] += (0.6 - i[idx]) * 0.4; // smooth fade in
    //             }
    //         });

    //         raf = requestAnimationFrame(animate);
    //     };

    //     raf = requestAnimationFrame(animate);

    //     return () => cancelAnimationFrame(raf);
    // }, [isPlayingAudio, mouthCues]);

    // ⬇️ REPLACED: manual requestAnimationFrame with useFrame
    // This runs efficiently inside the React Three Fiber render loop
    useFrame(() => {
        if (!isPlayingAudio || !audioRef.current || mouthCues.length === 0) return;

        const currentTime = audioRef.current.currentTime;

        // Optimization: Don't use .find() every frame if cues are sorted. 
        // But for short arrays, .find is acceptable.
        const cue = mouthCues.find(
            (c) => currentTime >= c.start && currentTime <= c.end
        );

        // Smoothly interpolate morph targets
        for (let i = 0; i < mouthMeshes.current.length; i++) {
            const mesh = mouthMeshes.current[i];
            const dict = mesh.morphTargetDictionary!;
            const influences = mesh.morphTargetInfluences!;

            // We iterate manually to avoid garbage collection from Object.keys inside a loop
            for (const key in dict) {
                const idx = dict[key];
                // Smooth fade out for everything
                influences[idx] = THREE.MathUtils.lerp(influences[idx], 0, 0.1);
            }

            if (cue) {
                const viseme = phonemeMap[cue.value];
                if (viseme && dict[viseme] !== undefined) {
                    const idx = dict[viseme];
                    // Stronger fade in for active viseme
                    influences[idx] = THREE.MathUtils.lerp(influences[idx], 1, 0.4);
                }
            }
        }
    });

    // Play sequence: stop first animation -> play second animation -> play audio + visemes -> resume second animation
    const handleClick = useCallback(async () => {

        setDisabled(true);
        // Stop first animation smoothly.
        if (idleAction.current) {
            idleAction.current.fadeOut(0.25);
            currentAction.current = null;
        }

        // Play a  animation.
        let handAction: THREE.AnimationAction | null = null;
        if (actions && names) {
            // Animation ["idle"]
            if (names[0]) {
                handAction = playAction(names[0], 0.15, true);
            }
        }

        // Load data and play audio.
        setIsRote(true); // change model angle..
        const audio = await loadMouthData();
        // Audio is start from 0...
        audio.currentTime = 0;

        // Start playing audio and lipsync..
        audio.play();
        setIsPlayingAudio(true);

        // Stop handAction when audio finishes (or resume idle)
        const onEnd = () => {
            setDisabled(false);
            setIsPlayingAudio(false);
            setIsRote(false);
            // fade out the hand action gracefully
            if (handAction) stopAction(handAction, 0.2);
            // resume idle ["Looking"]
            if (idleAction.current) {
                idleAction.current.reset().fadeIn(0.25).play();
                currentAction.current = idleAction.current;
            } else if (names && names.length > 0) {
                // fallback to first animation
                const fallback = playAction(names[0], 0.25, true);
                idleAction.current = fallback ?? null;
            }
            audio.removeEventListener("ended", onEnd);
        };

        audio.addEventListener("ended", onEnd);
    }, [actions, names, loadMouthData, playAction, stopAction]);


    return (
        <group position={[0, -5, 0]} rotation={[0, 0, 0]} >
            {/* stage */}
            <mesh position={[0, 0, 0]} rotation={[0, 0, 0]} >
                <cylinderGeometry args={[2, 10, 4, 30]} />
                <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* model */}
            <primitive
                ref={group}
                object={scene}
                rotation={[0, isRotate ? 0.5 : 0, 0]}
                position={[0, 2, 0]}
                scale={3.5}
                onPointerEnter={() => document.body.style.cursor = 'pointer'}
                onPointerLeave={() => document.body.style.cursor = 'auto'}
                onClick={!disabled && handleClick}
                frustumCulled
            />
        </group>
    );
}

export default Model01;