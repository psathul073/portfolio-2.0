import { NextResponse } from 'next/server';

// Types
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

interface ProjectObject {
    [key: number] : Project;
    type: boolean;
}

interface ApiResponse {
    success: boolean;
    data: Project[];
    cached?: boolean;
    count?: number;
}

// Utility function to convert object to array..
function convertProjectsToArray(obj: ProjectObject): Project[] {
return Object.values(obj).filter(item => (
    typeof item === 'object' && item !== null && 'id' in item
)) as Project[]
}

export async function GET() {
    try {
        const apiKey = process.env.DEV_PROFILE_API_KEY;

        if (!apiKey) {
            console.error('DEV_PROFILE_API_KEY is not set');
            return NextResponse.json(
                {
                    success: false,
                    error: "API key not configured"
                },
                { status: 500 }
            );
        }

        const externalUrl = "https://dev-profile-qd3u.onrender.com/api/projects?limit=12";

        const response = await fetch(externalUrl, {
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
            },
            signal: AbortSignal.timeout(10000),
            next: { revalidate: 3600 } // Cache for 1 hour (3600 seconds)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('External API error:', response.status, errorText);
            throw new Error(`External API error: ${response.status} - ${errorText}`);
        }

        const rawData: ProjectObject = await response.json();

        // Convert the object structure to array..
        const projectsArray: Project[] = convertProjectsToArray(rawData);

        const responseData: ApiResponse = {
            success: true,
            data: projectsArray,
            count: projectsArray.length
        };


        // Add cache headers..
        const headers = {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        };

        return NextResponse.json(responseData, { headers });


    } catch (error: unknown) {
        console.error("Project fetch API error:", error);

        let errorMessage = "Failed to fetch projects";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return NextResponse.json(
            {
                success: false,
                error: errorMessage
            },
            { status: 500 }
        );
    }
}