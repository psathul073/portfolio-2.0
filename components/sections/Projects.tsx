"use client";

import { useEffect, useRef, useState } from "react";
import ProjectCard from "../ui/ProjectCard";
import ProjectCardSkeleton from "../ui/ProjectCardSkeleton";


export interface Project {
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
    badge: Array<{
        value: string;
        label: string;
    }>;
}

interface ProjectsProps {
    initialData?: {
        type: string;
        data: Project[];
    };
}

const INITIAL_LOAD = 4;
const LOAD_MORE_COUNT = 4;

function Projects({ initialData }: ProjectsProps) {

    const [projects, setProjects] = useState(initialData?.data ?? []);
    const [isLoading, setIsLoading] = useState(!initialData?.data?.length);
    const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD);
    const loadMoreRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        if (initialData?.data?.length) return;

        const controller = new AbortController();

        const fetchDemoProjects = async () => {
            try {
                setIsLoading(true);

                const result = await fetch("/api/projects", {
                    signal: controller.signal,
                });
                if (!result.ok) throw new Error('Failed to fetch');

                const data = await result.json();
                setProjects(data.projects);
            } catch (error) {
                console.error('Project fetch failed', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDemoProjects();

        return () => controller.abort();

    }, [initialData?.data?.length]);

    // Infinite scroll
    useEffect(() => {
        if (!loadMoreRef.current) return;
        if (visibleCount >= projects.length) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
                }
            },
            { rootMargin: "400px" }
        );

        observer.observe(loadMoreRef.current);

        return () => observer.disconnect();

    }, [visibleCount, projects.length]);

    const visibleProjects = projects.slice(0, visibleCount);

    // Loading stage..
    if (isLoading) {
        return (
            <div className="w-full px-2 pt-15 pb-5 max-w-385 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Array.from({ length: INITIAL_LOAD }, (_, i) => (
                    <ProjectCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (!projects.length) {
        return (
            <div className="w-full flex justify-center items-center min-h-64 text-orange-400">
                No projects found 🚧
            </div>
        );
    }

    return (
        <div className="w-full px-2 pt-15 pb-5 max-w-385 overflow-y-auto ">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {visibleProjects.map((item, index) => {
                        
                    const badge = (item.badge[0] !== undefined && item.badge[0] !== null) ? item.badge[0] : {
                        value: 'badge1',
                        label: 'FEATURED',
                    };
                    return (
                        <div key={item.id}
                            className="project-card-animate">
                            <ProjectCard
                                url={item.picture}
                                title={item.title}
                                badge={badge}
                                description={item.description}
                                labels={item.usedTec}
                                liveLink={item.liveURL}
                                repoLink={item.demoURL}
                                priority={index < 2}
                            />
                        </div>
                    )
                })}
            </div>

            {visibleCount < projects.length && (
                <div ref={loadMoreRef} className="h-20 flex justify-center items-center">
                    <div className="text-orange-500/80 text-sm">Scroll to load more...</div>
                </div>
            )}
        </div>
    );
}

export default Projects;