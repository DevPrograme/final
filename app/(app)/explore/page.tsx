import { Compass } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { ResourceExplorer } from "@/components/shared/resource-explorer";
import { getResources } from "@/lib/queries";

export default async function ExplorePage() {
  const resources = await getResources({});

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

      {resources.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="The vault is empty"
          description="Nothing has been shared yet. Be the first to preserve a project, research note, or placement playbook."
          actionLabel="Back to dashboard"
          actionHref="/dashboard"
        />
      ) : (
        <ResourceExplorer resources={resources} />
      )}
    </div>
  );
}
