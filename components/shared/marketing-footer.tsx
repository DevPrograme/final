import Link from "next/link";

import { Logo } from "@/components/shared/logo";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/70">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 sm:flex-row">
        <Logo href="/" />
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} knowvault. Built by students, for students.
        </p>
        <div className="flex items-center gap-5 text-sm text-muted-foreground">
          <Link href="#" className="transition-colors hover:text-foreground">
            Privacy
          </Link>
          <Link href="#" className="transition-colors hover:text-foreground">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
