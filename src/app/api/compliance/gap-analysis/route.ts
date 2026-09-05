// src/app/api/compliance/gap-analysis/route.ts
import { NextRequest, NextResponse } from "next/server";
import { performGapAnalysis } from "@/lib/compliance/gap-analysis";
import { GapAnalysisInput } from "@/types/compliance";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.product || typeof body.product !== "string") {
      return NextResponse.json(
        { error: "Product name is required for gap analysis" },
        { status: 400 }
      );
    }

    const input: GapAnalysisInput = {
      product: body.product.trim(),
      material: typeof body.material === "string" ? body.material.trim() : "",
      capacity: typeof body.capacity === "string" ? body.capacity.trim() : undefined,
      currentTests: Array.isArray(body.currentTests) ? body.currentTests : [],
      currentCertifications: Array.isArray(body.currentCertifications)
        ? body.currentCertifications
        : [],
      manufacturingProcess:
        typeof body.manufacturingProcess === "string"
          ? body.manufacturingProcess.trim()
          : undefined,
      additionalInfo:
        typeof body.additionalInfo === "string" ? body.additionalInfo.trim() : undefined,
    };

    const language = body.language as "en" | "hi" | undefined;
    const result = await performGapAnalysis(input, language);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error: any) {
    console.error("Compliance Gap Analysis API error:", error);
    return NextResponse.json(
      {
        error: "Failed to perform gap analysis",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
