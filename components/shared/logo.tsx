import Link from "next/link";
import { Zap } from "lucide-react";

import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  className?: string;
  iconOnly?: boolean;
}

/**
 * The knowvault wordmark + mark. Used in the topbar, the landing page,
 * and the auth screens so the brand stays consistent everywhere.
 */
export function Logo({ href = "/dashboard", className, iconOnly = false }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-vault-ink text-vault-lime">
        <Zap className="h-4 w-4 fill-current" strokeWidth={2.5} />
      </span>
      {!iconOnly && (
        <span className="text-lg font-semibold tracking-tight text-primary">
          knowvault
        </span>
      )}
    </Link>
  );
}
