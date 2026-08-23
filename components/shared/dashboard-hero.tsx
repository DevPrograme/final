import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

interface DashboardHeroProps {
  greeting: string;
  dateLabel: string;
  firstName?: string | null;
}

export function DashboardHero({ greeting, dateLabel, firstName }: DashboardHeroProps) {
  return (
    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{dateLabel}</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {greeting}
          {firstName ? `, ${firstName}` : ""}.{" "}
          <span className="text-primary">Keep building.</span>
        </h1>
        <p className="text-base text-muted-foreground">
          Your college&rsquo;s collective intelligence, in one place.
        </p>
      </div>
      <Button size="lg" className="w-fit shrink-0">
        <Upload />
        Share knowledge
      </Button>
    </div>
  );
}
