// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { runRagPipeline } from "@/lib/rag/pipeline";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawQuery = body.query ?? body.message;
    const query = typeof rawQuery === "string" ? rawQuery.trim() : "";
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
      isAbstention,
      responseStream,
      finalize,
    } = await runRagPipeline(query, requestedLang);

    // Build Server-Sent Events stream
    const encoder = new TextEncoder();

    let isClosed = false;

    const stream = new ReadableStream({
      async start(controller) {
        const safeEnqueue = (payload: string) => {
          if (!isClosed) {
            try {
              controller.enqueue(encoder.encode(payload));
            } catch {
              isClosed = true;
            }
          }
        };

        // 1. Send metadata event first
        const metadataData = {
          type: "metadata",
          language,
          confidence,
          extractedEntities: entities,
          retrievedDocuments: evidenceBlocks.length,
          mandatoryStatus,
          isAbstention,
        };
        safeEnqueue(`event: metadata\ndata: ${JSON.stringify(metadataData)}\n\n`);

        // 2. Stream generation tokens
        let fullGeneratedText = "";
        try {
          for await (const chunk of responseStream) {
            if (isClosed) break;
            const textChunk = chunk.text || "";
            if (textChunk) {
              fullGeneratedText += textChunk;
              const contentData = {
                type: "content",
                text: textChunk,
                data: textChunk,
              };
              safeEnqueue(`event: content\ndata: ${JSON.stringify(contentData)}\n\n`);
            }
          }
        } catch (streamError) {
          if (!isClosed) {
            console.error("Error during content generation streaming:", streamError);
          }
        }

        if (isClosed) return;

        // 3. Extract and send validated citations with rich verification metadata
        const finalResult = finalize(fullGeneratedText);
        const citationsData = {
          type: "citations",
          citations: finalResult.validCitations,
          data: finalResult.validCitations,
          hasHallucinations: finalResult.hasHallucinations,
          hallucinatedStandards: finalResult.hallucinatedStandards,
          invalidCitationRefs: finalResult.invalidCitationRefs,
          groundingScore: finalResult.groundingScore,
          relatedStandards: finalResult.relatedStandards,
          isAbstention: finalResult.isAbstention,
          abstentionReason: finalResult.abstentionReason,
        };
        safeEnqueue(`event: citations\ndata: ${JSON.stringify(citationsData)}\n\n`);

        // 4. Send done event
        const doneData = {
          type: "done",
          completedAt: new Date().toISOString(),
        };
        safeEnqueue(`event: done\ndata: ${JSON.stringify(doneData)}\n\n`);

        if (!isClosed) {
          try {
            controller.close();
          } catch {
            isClosed = true;
          }
        }
      },
      cancel() {
        isClosed = true;
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
