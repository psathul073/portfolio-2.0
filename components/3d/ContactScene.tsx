"use client"
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { lazy, Suspense } from 'react';


const Model04 = lazy(() => import('./Model04'));


function ContactScene() {


    return (
        <Canvas
            camera={{ position: [0, 3, 12], fov: 30 }}
            gl={{
                antialias: false,
                powerPreference: "high-performance",
                alpha: true
            }}
            frameloop="always"
        >
            {/* <color attach="background" args={['#1a1a1a']} /> */}

            <Suspense fallback={null}>
                <Model04 />
            </Suspense>

            <OrbitControls
                enablePan={false}
                enableZoom={false}
                enableRotate={false}
                minDistance={5}
                maxDistance={20}
            />
            {/* <fog attach="fog" args={['e6e9ea', 3, 60]} /> */}
            <Environment preset="sunset" background={false} environmentIntensity={0.3} />

        </Canvas>
    )
}

export default ContactScene