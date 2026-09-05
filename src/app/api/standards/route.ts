// src/app/api/standards/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getStandardsList, getStandardDetails } from "@/lib/db/queries";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const details = await getStandardDetails(id);
      if (!details) {
        return NextResponse.json({ error: "Standard not found" }, { status: 404 });
      }
      return NextResponse.json(details);
    }

    const data = await getStandardsList();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch standards list", details: error.message },
      { status: 500 }
    );
  }
}

