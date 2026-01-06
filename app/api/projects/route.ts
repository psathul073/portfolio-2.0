import projects from "@/data/projects.json";

export async function GET() {
    return Response.json(projects);
}