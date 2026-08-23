import { TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { StatCardData } from "@/lib/types";

export function StatCard({ label, icon: Icon, iconClassName, value, delta, helper }: StatCardData) {
  return (
    <Card className="flex flex-col gap-4 p-5 transition-shadow hover:shadow-card-hover">
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl",
            iconClassName,
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </p>
        {delta && (
          <p className="flex items-center gap-1 text-xs font-medium text-vault-positive">
            <TrendingUp className="h-3.5 w-3.5" />
            {delta}
          </p>
        )}
        {!delta && helper && (
          <p className="text-xs font-medium text-orange-600">{helper}</p>
        )}
      </div>
    </Card>
  );
}
