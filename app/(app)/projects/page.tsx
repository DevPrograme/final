import { Target } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";

export default function ProjectsPage() {
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
      <EmptyState
        icon={Target}
        title="Project filters aren't live yet"
        description="Once this is wired up, you'll see every preserved project, like MediRoute or Placement OS, in one filterable list."
        actionLabel="View on dashboard"
        actionHref="/dashboard"
      />
    </div>
  );
}
