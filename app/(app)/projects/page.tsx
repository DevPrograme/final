import { Target } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { ResourceGrid } from "@/components/shared/resource-grid";
import { getResources } from "@/lib/queries";

export default async function ProjectsPage() {
  const resources = await getResources({ category: "Projects" });

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Projects
        </h1>
        <p className="text-muted-foreground">
          Every preserved build, from final-year projects to weekend hacks.
        </p>
      </div>

      {resources.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No projects yet"
          description="Once projects like MediRoute or Placement OS are shared, they'll show up here."
          actionLabel="View on dashboard"
          actionHref="/dashboard"
        />
      ) : (
        <ResourceGrid resources={resources} />
      )}
    </div>
  );
}
