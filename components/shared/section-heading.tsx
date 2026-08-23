import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

interface SectionHeadingProps {
  title: string;
  eyebrow?: string;
  eyebrowIcon?: LucideIcon;
  actionLabel?: string;
  actionHref?: string;
}

/**
 * The small-caps label + big title + "See all" link pattern repeated
 * above most content sections in the app.
 */
export function SectionHeading({
  title,
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  actionLabel,
  actionHref,
}: SectionHeadingProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="space-y-1.5">
        {eyebrow && (
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {EyebrowIcon && <EyebrowIcon className="h-3.5 w-3.5 text-vault-badge" />}
            {eyebrow}
          </div>
        )}
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
      </div>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="group inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
        >
          {actionLabel}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
