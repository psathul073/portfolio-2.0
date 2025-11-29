
import { type RefObject, useEffect, useCallback } from "react";

function useOutsideClick<T extends HTMLElement>(
    ref: RefObject<T | null>,
    callback: () => void
) {
    const handleClick = useCallback((e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
            callback();
        }
    }, [ref, callback]);

    useEffect(() => {
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [handleClick]);
}

export default useOutsideClick