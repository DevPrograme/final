import { Bookmark } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { ResourceGrid } from "@/components/shared/resource-grid";
import { getSavedResources } from "@/lib/queries";

export default async function SavedPage() {
  const resources = await getSavedResources();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Saved
        </h1>
        <p className="text-muted-foreground">
          Resources you&rsquo;ve bookmarked for later.
        </p>
      </div>

      {resources.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="Nothing saved yet"
          description="Bookmark a project or research note from the dashboard and it'll show up here for quick access."
          actionLabel="Explore resources"
          actionHref="/explore"
        />
      ) : (
        <ResourceGrid resources={resources} />
      )}
    </div>
  );
}
