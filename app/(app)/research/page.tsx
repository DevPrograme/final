import { BookOpen } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";

export default function ResearchPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Research
        </h1>
        <p className="text-muted-foreground">
          Papers, datasets, and lab notes, organized by department.
        </p>
      </div>
      <EmptyState
        icon={BookOpen}
        title="The research library is still empty"
        description="Papers, datasets, and lab notes will show up here as soon as your department starts sharing them."
        actionLabel="View on dashboard"
        actionHref="/dashboard"
      />
    </div>
  );
}
