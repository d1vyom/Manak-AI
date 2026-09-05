// src/app/api/compliance/pathway/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateCompliancePathway } from "@/lib/compliance/pathway";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = typeof body.query === "string" ? body.query.trim() : "";
    const language = body.language as "en" | "hi" | undefined;

    if (!query) {
      return NextResponse.json(
        { error: "Product query or description is required" },
        { status: 400 }
      );
    }

    const pathway = await generateCompliancePathway(query, language);

    return NextResponse.json(pathway, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error: any) {
    console.error("Compliance Pathway API error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate compliance pathway",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
