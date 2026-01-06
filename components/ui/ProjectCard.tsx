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
    priority = false,
}: ProjectCardPropType) {
    const handleAction = useCallback((url: string) => {
        window.open(url, "_blank", "noopener,noreferrer");
    }, []);

    const handleRepoClick = useCallback(() => {
        handleAction(repoLink);
    }, [handleAction, repoLink]);

    const handleLiveClick = useCallback(() => {
        handleAction(liveLink);
    }, [handleAction, liveLink]);

    return (
        <div className=" group h-[520px] max-sm:w-[310px] max-w-[350px] mx-auto flex flex-col rounded-2xl 
         bg-[#0B0B0E]/95 border max-sm:border-[#C89B3C]/20 border-[#C89B3C]/10 shadow-[0_0_40px_rgba(200,155,60,0.15)]
         text-orange-100 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(234,124,20,0.25)] cursor-pointer " >
            {/* badge */}
            <span className=" z-10 absolute top-3 left-3 text-xs font-semibold bg-orange-500/90 text-black px-2 py-1 rounded-md " >
                FEATURED
            </span>

            {/* Project image */}
            <div className="relative min-h-[200px] p-2 overflow-hidden rounded-2xl aspect-[1.6]">
                <Image
                    src={url}
                    alt={title + " project image"}
                    width={315}
                    height={200}
                    loading={priority ? "eager" : "lazy"}
                    priority={priority}
                    quality={75}
                    placeholder="blur"
                    decoding="async"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R"
                    className=" w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105 "
                    sizes="(max-width: 640px) 310px, 350px" />
                {/* Overlay */}
                <div className=" pointer-events-none absolute inset-0 rounded-xl bg-linear-to-t from-black/40 via-black/10 to-transparent " />
            </div>

            {/* Project details */}
            <div className="h-full overflow-hidden p-2 font-fira-code ">
                <h2 className="text-xl font-semibold mb-2 tracking-wide">{title}</h2>

                {/* labels */}
                <div className="flex flex-wrap gap-1.5 my-4">
                    {labels.slice(0, 4).map((item, i) => (
                        <span className="bg-orange-400/15 border border-orange-400/20 px-2 py-0.5 rounded-lg text-xs text-orange-200/80" key={item.value + i} >
                            {item.label}
                        </span>
                    ))}
                    {labels.length > 4 && (
                        <span className="bg-orange-400/15 border border-orange-400/20 px-2 py-0.5 rounded-lg text-xs text-orange-200/80 " >
                            +{labels.length - 4}
                        </span>
                    )}
                </div>

                {/* description */}
                <p className="text-sm text-orange-100/75 leading-relaxed line-clamp-3">
                    {description}
                </p>
            </div>

            {/* Actions */}
            <div className="px-2 py-3 w-full inline-flex items-center gap-2.5">
                <button
                    onClick={handleRepoClick}
                    aria-label="Repo view button"
                    className=" p-2.5 rounded-xl bg-orange-300/15 hover:bg-orange-300/30 transition-colors cursor-pointer ">
                    <CodeXml size={28} />
                </button>
                <button
                    onClick={handleLiveClick}
                    className=" w-full p-2.5 rounded-xl bg-linear-to-r from-orange-500/80 to-orange-400/80 hover:from-orange-500 hover:to-orange-400 font-semibold inline-flex justify-center items-center gap-3 transition-all cursor-pointer ">
                    Live View
                </button>
            </div>
        </div>
    );
});

export default ProjectCard;
