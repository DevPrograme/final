"use client";

import { useState } from "react";
import { Bookmark, ArrowUpRight, Zap } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";
import type { Resource, ResourceCategory } from "@/lib/types";

const categoryStyles: Record<ResourceCategory, string> = {
  Projects: "bg-vault-rose text-vault-rose-foreground",
  "Placement prep": "bg-vault-sky text-vault-sky-foreground",
  Research: "bg-vault-moss text-vault-moss-foreground",
};

export function ResourceCard({
  category,
  year,
  department,
  title,
  description,
  tags,
  authorName,
  reusedCount,
  saved,
}: Resource) {
  const [isSaved, setIsSaved] = useState(Boolean(saved));

  return (
    <Card className="group flex flex-col overflow-hidden transition-shadow hover:shadow-card-hover">
      <div
        className={cn(
          "flex items-center justify-between px-5 py-4",
          categoryStyles[category],
        )}
      >
        <span className="text-xs font-semibold">{category}</span>
        <button
          type="button"
          onClick={() => setIsSaved((prev) => !prev)}
          aria-pressed={isSaved}
          aria-label={isSaved ? "Remove from saved" : "Save this resource"}
          className="rounded-full bg-white/70 p-1.5 text-current transition-colors hover:bg-white"
        >
          <Bookmark
            className={cn("h-3.5 w-3.5", isSaved && "fill-current")}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-xs font-medium text-muted-foreground">
          {year} · {department}
        </p>
        <h3 className="text-base font-semibold leading-snug text-foreground">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="font-normal text-muted-foreground">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-primary/10 text-[10px] text-primary">
                {getInitials(authorName)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-foreground">
              {authorName}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-vault-positive">
            <Zap className="h-3.5 w-3.5" />
            {reusedCount} reused
            <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Card>
  );
}
