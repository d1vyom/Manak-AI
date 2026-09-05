// src/app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { searchStandards } from "@/lib/db/queries";
 
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = typeof body.query === "string" ? body.query.trim() : "";

    if (!query) {
      return NextResponse.json({ error: "Query string is required" }, { status: 400 });
    }

    const results = await searchStandards({
      queryText: query,
      filterStandard: body.standard,
      filterDocType: body.documentType,
      matchCount: body.matchCount || 10,
    });

    return NextResponse.json({
      query,
      results,
      total: results.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Search execution failed", details: error.message },
      { status: 500 }
    );
  }
}
