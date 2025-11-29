import { useCallback, useRef } from "react";
import * as THREE from "three";

type actionsType = {
    [x: string]: THREE.AnimationAction | null;
}

const useActions = (actions: actionsType) => {

    // Current playing action...
    const currentAction = useRef<THREE.AnimationAction | null>(null);

    // // Fade to an action by name.
    const playAction = useCallback((name: string, fade = 0.25, loop = true) => {
        if (!actions) return null;
        const action = actions[name] as THREE.AnimationAction | undefined;
        if (!action) return null;
        action.reset();
        action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
        action.fadeIn(fade).play();
        if (currentAction.current && currentAction.current !== action) {
            currentAction.current.fadeOut(fade);
        }
        currentAction.current = action;
        return action;
    }, [actions]);

    // Stop action.
    const stopAction = useCallback((action: THREE.AnimationAction | null, fade = 0.15) => {
        if (!action) return;
        action.fadeOut(fade);
        if (currentAction.current === action) currentAction.current = null;
    }, []);

    return { playAction, stopAction }
};

export default useActions

