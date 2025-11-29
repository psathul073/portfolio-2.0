"use client";

import { usePathname } from 'next/navigation';
import { LoadingProvider } from './context/LoadingContext';

export default function ConditionalLoading({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Only enable loading on specific pages.
    const loadingPages = ['/', '/home'];
    const isEnabled = loadingPages.includes(pathname);

    if (isEnabled) {
        return <LoadingProvider>{children}</LoadingProvider>;
    }

    return <>{children}</>;
}