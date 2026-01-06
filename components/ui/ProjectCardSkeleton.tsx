"use client";

const ProjectCardSkeleton = () => {
    return (
        <div className="relative h-[520px] max-sm:w-[310px] max-w-[350px] mx-auto flex flex-col overflow-hidden rounded-xl bg-[#0B0B0E]/95 border max-sm:border-[#C89B3C]/20 border-[#C89B3C]/10 shadow-[0_0_40px_rgba(200,155,60,0.15)]
         text-orange-100 animate-pulse">

            {/* Shimmer overlay */}
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-gray-900/30 to-transparent"></div>

            {/* Project image */}
            <div className="max-sm:w-[310px] max-w-[350px] h-[400px] p-2 overflow-hidden rounded-xl aspect-[1.6]">
                <div className="h-full w-full rounded-md bg-gray-900/20"></div>
            </div>

            {/* Project details */}
            <div className="h-full p-2">
                <div className="h-5 w-60 rounded-md mb-4 bggray-900/20"></div>

                {/* labels */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {Array.from({ length: 5 }, (_, i) => (
                        <div className="h-4 w-16 mb-1 rounded-xl bg-orange-700/20 " key={i}></div>
                    ))}
                </div>

                {/* description */}
                <div className="flex flex-col gap-4">
                    {Array.from({ length: 5 }, (_, i) => (
                        <div className="h-5 rounded-md bg-gray-900/20" key={i}></div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="px-2 py-3 w-full inline-flex items-center gap-2.5">
                <div className="h-9 w-14 rounded-xl bg-orange-300/15"></div>
                <div className="w-full h-9 p-2.5 rounded-xl bg-orange-900/40"></div>
            </div>
        </div>
    )
}

export default ProjectCardSkeleton;