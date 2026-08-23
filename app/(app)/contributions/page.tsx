import { UploadCloud } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";

export default function ContributionsPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          My contributions
        </h1>
        <p className="text-muted-foreground">
          Everything you&rsquo;ve shared, and how many times it&rsquo;s been
          reused.
        </p>
      </div>
      <EmptyState
        icon={UploadCloud}
        title="You haven't shared anything yet"
        description="Projects, research, and playbooks you upload will appear here, along with how many times they've been reused."
        actionLabel="Share knowledge"
        actionHref="/dashboard"
      />
    </div>
  );
}
