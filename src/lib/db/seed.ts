// src/lib/db/seed.ts
import { prisma } from "./prisma";
import { SEED_DOCUMENTS, SEED_QCOS, SEED_CHUNKS } from "../data/seed-data";

export async function seedDatabase() {
  console.log("Seeding Manak AI knowledge base into PostgreSQL...");

  // 1. Seed Documents
  for (const doc of SEED_DOCUMENTS) {
    await prisma.document.upsert({
      where: { id: doc.id },
      update: {
        standardNumber: doc.standardNumber,
        partNumber: doc.partNumber,
        revisionYear: doc.revisionYear,
        fullDesignation: doc.fullDesignation,
        title: doc.title,
        documentType: doc.documentType,
        status: doc.status,
        isMandatory: doc.isMandatory,
        productCategories: doc.productCategories,
        industries: doc.industries,
        language: doc.language,
        sourceUrl: doc.sourceUrl,
        totalPages: doc.totalPages,
        scopeSummary: doc.scopeSummary,
        publicationDate: new Date(doc.publicationDate),
        effectiveDate: new Date(doc.effectiveDate),
      },
      create: {
        id: doc.id,
        standardNumber: doc.standardNumber,
        partNumber: doc.partNumber,
        revisionYear: doc.revisionYear,
        fullDesignation: doc.fullDesignation,
        title: doc.title,
        documentType: doc.documentType,
        status: doc.status,
        isMandatory: doc.isMandatory,
        productCategories: doc.productCategories,
        industries: doc.industries,
        language: doc.language,
        sourceUrl: doc.sourceUrl,
        totalPages: doc.totalPages,
        scopeSummary: doc.scopeSummary,
        publicationDate: new Date(doc.publicationDate),
        effectiveDate: new Date(doc.effectiveDate),
      },
    });
  }
  console.log(`✓ Seeded ${SEED_DOCUMENTS.length} standards documents.`);

  // 2. Seed QCOs
  for (const qco of SEED_QCOS) {
    await prisma.qco.upsert({
      where: { id: qco.id },
      update: {
        qcoNumber: qco.qcoNumber,
        qcoTitle: qco.qcoTitle,
        standardNumber: qco.standardNumber,
        standardDesignation: qco.standardDesignation,
        productDescription: qco.productDescription,
        certificationType: qco.certificationType,
        scopeDescription: qco.scopeDescription,
        sourceUrl: qco.sourceUrl,
        isActive: qco.isActive,
        gazetteDate: new Date(qco.gazetteDate),
        effectiveDate: new Date(qco.effectiveDate),
      },
      create: {
        id: qco.id,
        qcoNumber: qco.qcoNumber,
        qcoTitle: qco.qcoTitle,
        standardNumber: qco.standardNumber,
        standardDesignation: qco.standardDesignation,
        productDescription: qco.productDescription,
        certificationType: qco.certificationType,
        scopeDescription: qco.scopeDescription,
        sourceUrl: qco.sourceUrl,
        isActive: qco.isActive,
        gazetteDate: new Date(qco.gazetteDate),
        effectiveDate: new Date(qco.effectiveDate),
      },
    });
  }
  console.log(`✓ Seeded ${SEED_QCOS.length} Quality Control Orders (QCOs).`);

  // 3. Seed Chunks
  for (const chunk of SEED_CHUNKS) {
    await prisma.documentChunk.upsert({
      where: { id: chunk.id },
      update: {
        documentId: chunk.documentId,
        chunkIndex: chunk.chunkIndex,
        clauseNumber: chunk.clauseNumber,
        clauseTitle: chunk.clauseTitle,
        sectionPath: chunk.sectionPath,
        chunkType: chunk.chunkType,
        pageNumberStart: chunk.pageNumberStart,
        pageNumberEnd: chunk.pageNumberEnd,
        content: chunk.content,
        contentWithContext: chunk.contentWithContext,
      },
      create: {
        id: chunk.id,
        documentId: chunk.documentId,
        chunkIndex: chunk.chunkIndex,
        clauseNumber: chunk.clauseNumber,
        clauseTitle: chunk.clauseTitle,
        sectionPath: chunk.sectionPath,
        chunkType: chunk.chunkType,
        pageNumberStart: chunk.pageNumberStart,
        pageNumberEnd: chunk.pageNumberEnd,
        content: chunk.content,
        contentWithContext: chunk.contentWithContext,
      },
    });
  }
  console.log(`✓ Seeded ${SEED_CHUNKS.length} clause chunks.`);
}

// Allow CLI execution: npx ts-node src/lib/db/seed.ts
if (require.main === module) {
  seedDatabase()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
