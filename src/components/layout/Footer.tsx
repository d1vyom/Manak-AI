import Link from "next/link";
import { ShieldCheck, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-navy-700/10 bg-white dark:bg-navy-950 dark:border-navy-900 py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-5 w-5 text-saffron-500" />
            <span>
              Built for <strong>Smart India Hackathon 2026</strong> (Problem Statement SIH26107).
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link
              href="https://www.bis.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-navy-900 dark:hover:text-white flex items-center gap-1"
            >
              BIS Official Portal <ExternalLink className="h-3 w-3" />
            </Link>
            <span>•</span>
            <Link
              href="https://services.bis.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-navy-900 dark:hover:text-white flex items-center gap-1"
            >
              e-BIS Services <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="mt-6 border-t border-border/50 pt-4 text-center text-xs text-muted-foreground">
          <p>
            <strong>Disclaimer:</strong> Manak AI is an AI-powered informational tool for reference purposes only.
            It does not constitute official BIS certification or legal advice. Verify all requirements directly with the
            Bureau of Indian Standards (<a href="https://bis.gov.in" target="_blank" rel="noreferrer" className="underline hover:text-navy-800">bis.gov.in</a>).
          </p>
        </div>
      </div>
    </footer>
  );
}
