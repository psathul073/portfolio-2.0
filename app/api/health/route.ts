import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  try {
    const res = await fetch(`${process.env.ASSISTANT_API_URL}/`, {
      method: "GET",
    });

    if (!res.ok) throw new Error("Backend API error");

    const data = await res.text();

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
