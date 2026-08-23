import { Compass } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";

export default function ExplorePage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Explore
        </h1>
        <p className="text-muted-foreground">
          Browse every project, dataset, and playbook the vault holds.
        </p>
      </div>
      <EmptyState
        icon={Compass}
        title="Browsing isn't wired up yet"
        description="This is where you'll filter the whole vault by department, year, and tag. For now, the freshest resources live on your dashboard."
        actionLabel="Back to dashboard"
        actionHref="/dashboard"
      />
    </div>
  );
}
