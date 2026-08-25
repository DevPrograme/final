import { History, Zap } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { getTimeline } from "@/lib/queries";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function TimelinePage() {
  const entries = await getTimeline();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Knowledge timeline
        </h1>
        <p className="text-muted-foreground">
          Watch one shared project turn into the next person&rsquo;s starting
          point.
        </p>
      </div>

      {entries.length === 0 ? (
        <EmptyState
          icon={History}
          title="The chain starts with your first share"
          description="Every time a resource gets reused or built upon, it'll show up here as a connected timeline."
          actionLabel="Back to dashboard"
          actionHref="/dashboard"
        />
      ) : (
        <ol className="relative ml-3 space-y-6 border-l border-border pl-8">
          {entries.map((entry) => (
            <li key={entry.id} className="relative">
              <span className="absolute -left-[2.55rem] flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Zap className="h-3.5 w-3.5" />
              </span>
              <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-card">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">{entry.reuserName}</span>{" "}
                  reused{" "}
                  <span className="font-semibold">{entry.resourceTitle}</span>
                </p>
                {entry.note && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    &ldquo;{entry.note}&rdquo;
                  </p>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="muted">{entry.category}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(entry.createdAt)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
