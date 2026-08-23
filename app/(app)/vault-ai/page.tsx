import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";

export default function VaultAiPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            VaultAI
          </h1>
          <Badge variant="rose">NEW</Badge>
        </div>
        <p className="text-muted-foreground">
          Describe what you&rsquo;re stuck on, get pointed to who already
          solved it.
        </p>
      </div>
      <EmptyState
        icon={Sparkles}
        title="VaultAI is still warming up"
        description="Describe what you're stuck on and VaultAI will surface the closest prior work from across your campus."
        actionLabel="Back to dashboard"
        actionHref="/dashboard"
      />
    </div>
  );
}
