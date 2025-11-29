"use client";

import { CodeXml } from "lucide-react";
import Image from "next/image";
import { useCallback, memo } from "react";


interface ProjectCardPropType {
    url: string;
    title: string;
    description: string;
    labels: Array<{
        value: string;
        label: string;
    }>;
    liveLink: string;
    repoLink: string;
    priority?: boolean;
}

const ProjectCard = memo(function ProjectCard({
    url,
    title,
    description,
    labels,
    liveLink,
    repoLink,
    priority = false
}: ProjectCardPropType) {

    const handleAction = useCallback((url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    }, []);

    const handleRepoClick = useCallback(() => {
        handleAction(repoLink);
    }, [handleAction, repoLink]);

    const handleLiveClick = useCallback(() => {
        handleAction(liveLink);
    }, [handleAction, liveLink]);

    return (
        <div className="h-[520px] max-sm:w-[310px] max-w-[350px] mx-auto flex flex-col rounded-xl bg-orange-500/10 backdrop-blur-xs ring-1 ring-orange-500/20 shadow-3xl shadow-orange-900/30 text-orange-100">

            {/* Project image */}
            <div className="max-sm:w-[310px] max-w-[350px] min-h-[200px] p-2 overflow-hidden rounded-xl aspect-[1.6]">

                <Image
                    src={url}
                    alt={title + ' project image'}
                    width={315}
                    height={200}
                    loading={priority ? "eager" : "lazy"}
                    priority={priority}
                    quality={75}
                    placeholder="blur"
                    decoding="async"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R"
                    className="w-full h-full object-cover rounded-xl"
                    sizes="(max-width: 640px) 310px, 350px"
                />
            </div>

            {/* Project details */}
            <div className="h-full overflow-hidden p-2 font-fira-code ">
                <h2 className="text-lg font-semibold mb-3">{title}</h2>

                {/* labels */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                    {labels.slice(0, 4).map((item, i) => (
                        <span
                            className="bg-orange-400/20 mb-1 px-2 py-0.5 rounded-xl text-xs"
                            key={item.value + i}
                        >
                            {item.label}
                        </span>
                    ))}
                    {labels.length > 4 && (
                        <span className="bg-orange-400/20 mb-1 px-2 py-0.5 rounded-xl text-xs">
                            +{labels.length - 4}
                        </span>
                    )}
                </div>

                {/* description */}
                <p className="text-sm">{description}</p>
            </div>

            {/* Actions */}
            <div className="px-2 py-3 w-full inline-flex items-center gap-2.5">
                <button
                    onClick={handleRepoClick}
                    aria-label="Repo view button"
                    className="py-2 px-3.5 rounded-xl place-items-center bg-orange-300/20 hover:bg-orange-300/40 cursor-pointer transition-colors"
                >
                    <CodeXml size={28} />
                </button>
                <button
                    onClick={handleLiveClick}
                    className="w-full p-2.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/40 font-semibold inline-flex justify-center items-center gap-3 cursor-pointer transition-colors"
                >
                    Live View
                </button>
            </div>
        </div>
    );
});

export default ProjectCard;