import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import ModelScene from './ModelScene';
import { useLoading } from '@/app/context/LoadingContext';

interface ScenePropType {
    onNavigate: () => void,
    onClick: () => void
}


export default function Scene({ onNavigate, onClick }: ScenePropType) {
    const { isMobile } = useLoading();

    return (
        <Canvas
            camera={{ position: [0, 3, 12], fov: 45 }}
            shadows={!isMobile}
            gl={{
                antialias: false,
                powerPreference: "high-performance",
                alpha: true,
            }}

            frameloop="always"

        >
            {/* <color attach="background" args={['#1a1a1a']} /> */}
            {/* <fog attach="fog" args={['e6e9ea', 1, 300]} /> */}
            {/* 
            <ambientLight intensity={0.2} />
            <directionalLight
                position={[5, 8, 5]}
                intensity={0.2}
                castShadow
                shadow-mapSize={[1024, 1024]}
            /> */}

            <ModelScene onNavigate={onNavigate} onClick={onClick} />

            <OrbitControls
                enablePan={false}
                enableZoom={false}
                enableRotate={false}
                minDistance={5}
                maxDistance={20}

            />

            <Environment preset="sunset" background={false} environmentIntensity={0.3} />
        </Canvas>
    )
}

