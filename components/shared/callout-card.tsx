import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

interface CalloutCardProps {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}

export function CalloutCard({
  title,
  description,
  actionLabel,
  actionHref,
}: CalloutCardProps) {
  return (
    <div className="rounded-2xl bg-vault-ink p-4 text-vault-ink-foreground">
      <Sparkles className="h-4 w-4 text-vault-lime" />
      <p className="mt-2 text-sm font-semibold">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-vault-ink-foreground/60">
        {description}
      </p>
      <Link
        href={actionHref}
        className="group mt-3 inline-flex items-center gap-1 text-xs font-medium text-vault-lime"
      >
        {actionLabel}
        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
