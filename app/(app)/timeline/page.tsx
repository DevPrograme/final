import { History } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";

export default function TimelinePage() {
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
      <EmptyState
        icon={History}
        title="The chain starts with your first share"
        description="Every time a resource gets reused or built upon, it'll show up here as a connected timeline."
        actionLabel="Back to dashboard"
        actionHref="/dashboard"
      />
    </div>
  );
}
