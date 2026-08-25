import { Users, Zap } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getContributors } from "@/lib/queries";
import { getInitials } from "@/lib/utils";

export default async function MentorshipPage() {
  const contributors = await getContributors();

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

      {contributors.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No contributors yet"
          description="Once people start sharing resources, the contributors you can reach out to will appear here."
          actionLabel="Back to dashboard"
          actionHref="/dashboard"
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {contributors.map((contributor) => (
            <div
              key={contributor.id}
              className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-card"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(contributor.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">
                    {contributor.name}
                  </p>
                  {contributor.department && (
                    <p className="truncate text-sm text-muted-foreground">
                      {contributor.department}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {contributor.contributionCount}{" "}
                  {contributor.contributionCount === 1
                    ? "resource"
                    : "resources"}
                </span>
                <span className="inline-flex items-center gap-1 font-medium text-vault-positive">
                  <Zap className="h-3.5 w-3.5" />
                  {contributor.reuseImpact} reused
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
