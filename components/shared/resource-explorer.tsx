"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { ResourceCard } from "@/components/shared/resource-card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { RESOURCE_CATEGORIES } from "@/lib/types";
import type { Resource, ResourceCategory } from "@/lib/types";

const selectClass =
  "h-10 rounded-full border border-input bg-background px-4 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

type CategoryFilter = ResourceCategory | "All";

export function ResourceExplorer({ resources }: { resources: Resource[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [department, setDepartment] = useState("All");
  const [year, setYear] = useState("All");

  const departments = useMemo(
    () => Array.from(new Set(resources.map((r) => r.department))).sort(),
    [resources],
  );
  const years = useMemo(
    () =>
      Array.from(new Set(resources.map((r) => r.year))).sort((a, b) => b - a),
    [resources],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return resources.filter((r) => {
      if (category !== "All" && r.category !== category) return false;
      if (department !== "All" && r.department !== department) return false;
      if (year !== "All" && String(r.year) !== year) return false;
      if (
        q &&
        !`${r.title} ${r.description} ${r.tags.join(" ")}`
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [resources, query, category, department, year]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, tag, or keyword..."
            className="pl-10"
          />
        </div>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className={selectClass}
          aria-label="Filter by department"
        >
          <option value="All">All departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className={selectClass}
          aria-label="Filter by year"
        >
          <option value="All">All years</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["All", ...RESOURCE_CATEGORIES] as CategoryFilter[]).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              category === c
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center text-sm text-muted-foreground">
          No resources match these filters yet.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((resource) => (
            <ResourceCard key={resource.id} {...resource} />
          ))}
        </div>
      )}
    </div>
  );
}
