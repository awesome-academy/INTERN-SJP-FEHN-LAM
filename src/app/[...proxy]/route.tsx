import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const url = request.url;
    const path = url.split('/api/')[1];
    const apiUrl = `http://localhost:3001/${path}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            const errorText = await response.text();
            return new Response(
                `Error fetching data from ${apiUrl}: ${errorText}`,
                { status: response.status }
            );

        }
        const data = await response.json();
        return Response.json(data);
    } catch (error) {
        return new Response(
            `Error fetching data from ${apiUrl}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            { status: 500 }
        );
    }
}
