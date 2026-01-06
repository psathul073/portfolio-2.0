import Projects, { Project } from "@/components/sections/Projects";

// SSR
async function getProjects(): Promise<{type: 'success', data: Project[]}> {
  try {
    const res = await fetch(`${process.env.DEV_PROFILE_URL}/api/projects?limit=12`, {

      headers: {
        "x-api-key": process.env.DEV_PROFILE_API_KEY!,
      },
      next: { revalidate: 3600 }, // cache 1 hour

    });

    if (!res.ok) throw new Error('Failed to fetch');

    const rawData = await res.json();
    return { type: "success", data: rawData.projects };
    
  } catch (error) {
    console.error('Project fetch failed', error);
    return {
      type: "success",
      data: [], // SAFE fallback
    };
  }
}

// Hybrid approach... [Projects work client and ssr]
export default async function ProjectPage() {

  const projectsData = await getProjects();

  return (
    <main className="h-screen w-full relative bg-black">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
    radial-gradient(
      ellipse 80% 60% at 50% 10%,
      rgba(255, 159, 28, 0.18),
      transparent 65%
    ),
    radial-gradient(
      ellipse 120% 80% at 50% 0%,
      #1f1b16,
      #0a0a0a 70%
    )
  `
        }}

      />
      <section className="absolute inset-0 z-10 flex justify-center">
        <Projects initialData={projectsData} />
      </section>
    </main>
  )
}