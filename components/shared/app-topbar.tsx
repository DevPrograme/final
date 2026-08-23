import Link from "next/link";
import { HelpCircle, Upload } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { SearchCommand } from "@/components/shared/search-command";
import { MobileSidebar } from "@/components/shared/mobile-sidebar";

export function AppTopbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/70 bg-sidebar/95 px-4 backdrop-blur sm:px-6">
      <MobileSidebar />
      <Logo className="hidden sm:inline-flex" />
      <Logo iconOnly className="sm:hidden" />

      <div className="mx-auto w-full max-w-md flex-1">
        <SearchCommand />
      </div>

      <nav className="hidden items-center gap-5 text-sm font-medium text-foreground/70 lg:flex">
        <Link href="/explore" className="transition-colors hover:text-foreground">
          Explore
        </Link>
        <Link
          href="/contributions"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
        >
          <Upload className="h-3.5 w-3.5" />
          Share knowledge
        </Link>
      </nav>

      <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Help">
        <HelpCircle className="h-4 w-4" />
      </Button>

      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button variant="outline" size="sm">
            Sign in
          </Button>
        </SignInButton>
      </SignedOut>
    </header>
  );
}
