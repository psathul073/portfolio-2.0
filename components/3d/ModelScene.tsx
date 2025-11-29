"use client";

import Model01 from "./Model01";
import Model02 from "./Model02";
import Model03 from "./Model03";
import { useLoading } from "@/app/context/LoadingContext";


interface ModelScenePropType {
    onNavigate: () => void,
    onClick: () => void
}


const ModelScene = ({ onNavigate, onClick }: ModelScenePropType) => {

    const { isMobile } = useLoading();

    console.log(" ModelScene component rendering");

    return (
        <group>

            <Model01 />
            {!isMobile && (
                <>
                    <Model02 onClick={onClick} />
                    <Model03 onNavigate={onNavigate} />
                </>
            )}
        </group>
    );
}

export default ModelScene;
