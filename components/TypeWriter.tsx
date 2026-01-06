"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface TypeWriterType {
    text: string,
    textSpeed?: number,
    loading: Dispatch<SetStateAction<boolean>>,
    scrollContainerRef?: React.RefObject<HTMLDivElement | null>,
    userScrolledUpRef?: React.RefObject<boolean> 
};


const TypeWriter = ({ text, textSpeed = 50, loading, scrollContainerRef, userScrolledUpRef }: TypeWriterType) => {
    const [displayedText, setDisplayedText] = useState<string>("");
    const [index, setIndex] = useState<number>(0);
    const [showCursor, setShowCursor] = useState<boolean>(true);

    useEffect(() => {
        if (index < text.length) {
            loading(true);
            const timeoutId = setTimeout(() => {
                setDisplayedText(prev => prev + text.charAt(index));
                setIndex(prev => prev + 1);
            }, textSpeed);
            return () => clearTimeout(timeoutId);
        } else {
            loading(false);
            const timeout = setTimeout(() => setShowCursor(false), 0);
            return () => clearTimeout(timeout);
        }

    }, [text, textSpeed, index, loading]);


    useEffect(() => {
        const el = scrollContainerRef?.current;
        if (!el) return;

        requestAnimationFrame(() => {
            if (!userScrolledUpRef?.current) {
                el.scrollTop = el.scrollHeight;
            }
        });
    }, [displayedText]);


    return <p className=" text-sm/6 font-fira-code whitespace-pre-line text-orange-100">{displayedText}{showCursor && <span className=" relative animate-pulse after:absolute after:bottom-0 after:-right-3 after:content-[''] after:w-1.5 after:h-full after:bg-amber-500"></span>}</p>;
};

export default TypeWriter;