// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { runRagPipeline } from "@/lib/rag/pipeline";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = typeof body.query === "string" ? body.query.trim() : "";
    const requestedLang = body.language as "en" | "hi" | "auto" | undefined;

    if (!query) {
      return NextResponse.json({ error: "Query string is required" }, { status: 400 });
    }

    const {
      language,
      confidence,
      entities,
      evidenceBlocks,
      mandatoryStatus,
      responseStream,
      finalize,
    } = await runRagPipeline(query, requestedLang);

    // Build Server-Sent Events stream
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        // 1. Send metadata event first
        const metadataPayload = {
          type: "metadata",
          data: {
            language,
            confidence: confidence.level,
            confidenceExplanation: confidence.explanation,
            confidenceScore: confidence.score,
            entities,
            retrievedDocuments: evidenceBlocks.length,
            mandatoryStatus,
          },
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(metadataPayload)}\n\n`));

        // 2. Stream generation tokens
        let fullGeneratedText = "";
        try {
          for await (const chunk of responseStream) {
            const textChunk = chunk.text || "";
            if (textChunk) {
              fullGeneratedText += textChunk;
              const contentPayload = {
                type: "content",
                data: textChunk,
              };
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(contentPayload)}\n\n`));
            }
          }
        } catch (streamError) {
          console.error("Error during content generation streaming:", streamError);
        }

        // 3. Extract and send validated citations
        const finalResult = finalize(fullGeneratedText);
        const citationsPayload = {
          type: "citations",
          data: finalResult.citations,
          hasHallucinations: finalResult.hasHallucinations,
          relatedStandards: finalResult.relatedStandards,
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(citationsPayload)}\n\n`));

        // 4. Send done event
        const donePayload = {
          type: "done",
          data: {
            completedAt: new Date().toISOString(),
          },
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(donePayload)}\n\n`));

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "RAG pipeline execution failed", details: error.message },
      { status: 500 }
    );
  }
}
