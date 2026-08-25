import { UploadCloud } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { ResourceGrid } from "@/components/shared/resource-grid";
import { ShareResourceDialog } from "@/components/shared/share-resource-dialog";
import { getContributions } from "@/lib/queries";

export default async function ContributionsPage() {
  const resources = await getContributions();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            My contributions
          </h1>
          <p className="text-muted-foreground">
            Everything you&rsquo;ve shared, and how many times it&rsquo;s been
            reused.
          </p>
        </div>
        <ShareResourceDialog triggerSize="default" />
      </div>

      {resources.length === 0 ? (
        <EmptyState
          icon={UploadCloud}
          title="You haven't shared anything yet"
          description="Projects, research, and playbooks you upload will appear here, along with how many times they've been reused."
          actionLabel="Back to dashboard"
          actionHref="/dashboard"
        />
      ) : (
        <ResourceGrid resources={resources} />
      )}
    </div>
  );
}
