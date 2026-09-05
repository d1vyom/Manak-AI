// src/app/api/standards/route.ts
import { NextResponse } from "next/server";
import { getStandardsList } from "@/lib/db/queries";

export async function GET() {
  try {
    const data = await getStandardsList();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch standards list", details: error.message },
      { status: 500 }
    );
  }
}
