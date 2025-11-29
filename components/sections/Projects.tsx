"use client";

import { useEffect, useRef, useState } from "react";
import ProjectCard from "../ui/ProjectCard";
import ProjectCardSkeleton from "../ui/ProjectCardSkeleton";


interface Project {
    id: string;
    title: string;
    picture: string;
    pictureID: string;
    description: string;
    demoURL: string;
    liveURL: string;
    usedTec: Array<{
        value: string;
        label: string;
    }>;
}

interface ProjectsProps {
    initialData?: {
        success: boolean;
        data: Project[];
    };
}

const INITIAL_LOAD = 4;
const LOAD_MORE_COUNT = 4;

function Projects({ initialData }: ProjectsProps) {
    const [allProjects, setAllProjects] = useState<Project[]>(initialData?.data || []);
    const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD);
    const [loading, setLoading] = useState(!initialData);
    const [error, setError] = useState<string | null>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Only fetch if no initial data (client-side fallback)..
    useEffect(() => {
        if (initialData?.data) return;

        const fetchProjects = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/projects');

                if (!res.ok) throw new Error('Failed to fetch');

                const data = await res.json();
                if (data.success) setAllProjects(data.data);
                else throw new Error("Invalid response");

            } catch (error) {
                setError(error instanceof Error ? error.message : "Error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [initialData]);

    // Infinite scroll
    useEffect(() => {
        if (visibleCount >= allProjects.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleCount(prev => prev + LOAD_MORE_COUNT);
                }
            },
            { rootMargin: '400px' }
        );

        if (loadMoreRef.current) observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [visibleCount, allProjects.length]);

    const visibleProjects = allProjects.slice(0, visibleCount);

    // Loading stage..
    if (loading) {
        return (
            <div className="w-full px-2 pt-15 pb-5 max-w-[1540px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Array.from({ length: INITIAL_LOAD }, (_, i) => (
                    <ProjectCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (error && allProjects.length === 0) {
        return (
            <div className="w-full flex flex-col items-center justify-center min-h-64 p-4">
                <div className="text-center max-w-md">
                    <p className="text-red-500 mb-4">⚠️ {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-orange-500/30 text-white px-6 py-2 rounded-lg hover:bg-orange-600/40 transition-colors cursor-pointer"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full px-2 pt-15 pb-5 max-w-[1540px] overflow-y-auto ">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {visibleProjects.map((item, index) => (
                    <div key={`${item.id}-${index}`}
                        className="project-card-animate">
                        <ProjectCard
                            url={item.picture}
                            title={item.title}
                            description={item.description}
                            labels={item.usedTec}
                            liveLink={item.liveURL}
                            repoLink={item.demoURL}
                            priority={index < 2}
                        />
                    </div>
                ))}
            </div>

            {visibleCount < allProjects.length && (
                <div ref={loadMoreRef} className="h-20 flex justify-center items-center">
                    <div className="text-orange-500/80 text-sm">Scroll to load more...</div>
                </div>
            )}
        </div>
    );
}

export default Projects;