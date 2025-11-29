"use client";

import { createContext, useContext, useState, useEffect, useRef } from 'react';

interface LoadingContextType {
    progress: number;
    isLoaded: boolean;
    isMobile: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const [progress, setProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isMobile] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.innerWidth <= 768;
    });

    const hasInitialized = useRef(false);

    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        console.log("🚀 LoadingProvider initializing - [1]");

        const startTime = Date.now();
        const MIN_LOAD_TIME = isMobile ? 3000 : 4000;

        const models = isMobile ? [
            '/models/AvatarMainOP.glb',
        ] : [
            '/models/AvatarMainOP.glb',
            '/models/Robo.glb',
            '/models/ContactOP.glb',
        ];

        let loadedCount = 0;
        const total = models.length;

        const progressInterval = setInterval(() => {
            setProgress(prev => Math.min(prev + Math.random() * 15, 90));
        }, 300);

        models.forEach(model => {
            fetch(model, { cache: 'force-cache' })
                .then(() => {
                    loadedCount++;
                    setProgress((loadedCount / total) * 100);
                    if (loadedCount === total) {
                        clearInterval(progressInterval);
                        completeLoading();
                    }
                })
                .catch(() => {
                    loadedCount++;
                    if (loadedCount === total) {
                        clearInterval(progressInterval);
                        completeLoading();
                    }
                });
        });

        const completeLoading = () => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, MIN_LOAD_TIME - elapsed);
            setTimeout(() => {
                setProgress(100);
                setTimeout(() => {
                    console.log("✅ LoadingProvider - loading complete");
                    setIsLoaded(true);
                }, 500);
            }, remaining);
        };

        return () => clearInterval(progressInterval);
    }, [isMobile]);

    return (
        <LoadingContext.Provider value={{ progress, isLoaded, isMobile }}>
            {children}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    const context = useContext(LoadingContext);
    if (context === undefined) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
}