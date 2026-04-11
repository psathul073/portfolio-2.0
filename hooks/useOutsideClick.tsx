import { type RefObject, useEffect, useCallback } from "react";

function useOutsideClick<T extends HTMLElement>(
  ref: RefObject<T | null>,
  callback: (e: MouseEvent | TouchEvent) => void,
) {
  const handleClick = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      callback(e);
    },
    [ref, callback],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [handleClick]);
}

export default useOutsideClick;
