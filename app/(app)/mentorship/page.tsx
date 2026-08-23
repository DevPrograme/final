import { Users } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";

export default function MentorshipPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Mentorship
        </h1>
        <p className="text-muted-foreground">
          Reach the people behind a resource, not just the document.
        </p>
      </div>
      <EmptyState
        icon={Users}
        title="Mentor matching isn't live yet"
        description="Soon you'll be able to message the contributor behind any resource directly from here."
        actionLabel="Back to dashboard"
        actionHref="/dashboard"
      />
    </div>
  );
}
