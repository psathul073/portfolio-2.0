import Projects from "@/components/sections/Projects";

// SSR
async function getProjects() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/projects`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!res.ok) {
      throw new Error('Failed to fetch projects');
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { success: false, data: [] };
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
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249, 115, 22, 0.25), transparent 70%), #000000",
        }}
      />
      <section className="absolute inset-0 z-10 flex justify-center">
        <Projects initialData={projectsData} />
      </section>
    </main>
  )
}