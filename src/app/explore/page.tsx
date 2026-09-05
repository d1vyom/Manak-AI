import { BookOpen, Sparkles } from "lucide-react";

export default function ExplorePage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 border-b border-navy-100 pb-4 dark:border-navy-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-800 text-white">
            <BookOpen className="h-5 w-5 text-saffron-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-navy-900 dark:text-white">
              Standards Explorer
            </h1>
            <p className="text-xs text-muted-foreground">
              Search and filter indexed Indian Standards (IS), mandatory status, sectors, and revision years.
            </p>
          </div>
        </div>

        <div className="flex min-h-[450px] items-center justify-center rounded-2xl border border-dashed border-navy-200 bg-white p-12 text-center dark:border-navy-800 dark:bg-navy-950">
          <div className="max-w-md">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-saffron-50 text-saffron-600 dark:bg-saffron-950/40">
              <Sparkles className="h-6 w-6 text-saffron-500" />
            </div>
            <h2 className="mt-4 text-base font-bold text-navy-900 dark:text-white">
              Standards Indexing Module
            </h2>
            <p className="mt-2 text-xs text-muted-foreground">
              Explore page initialized. Will display filterable tables of BIS standards, QCO linkages, and document metadata.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
