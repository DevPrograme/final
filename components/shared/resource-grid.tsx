import { ResourceCard } from "@/components/shared/resource-card";
import type { Resource } from "@/lib/types";

/** Standard responsive grid of resource cards, reused across list pages. */
export function ResourceGrid({ resources }: { resources: Resource[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {resources.map((resource) => (
        <ResourceCard key={resource.id} {...resource} />
      ))}
    </div>
  );
}
