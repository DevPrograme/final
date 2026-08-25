"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, type LucideIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { navGroups } from "@/lib/nav-config";
import { createClient } from "@/lib/supabase/client";

interface SearchResult {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

const navResults: SearchResult[] = navGroups.flatMap((group) =>
  group.items.map((item) => ({
    id: item.href,
    label: item.label,
    description: `Go to ${item.label}`,
    href: item.href,
    icon: item.icon,
  })),
);

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [resourceResults, setResourceResults] = useState<SearchResult[]>([]);
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResourceResults([]);
    }
  }, [open]);

  // Debounced live search of the resource table.
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResourceResults([]);
      return;
    }
    const supabase = createClient();
    const handle = setTimeout(async () => {
      const { data } = await supabase
        .from("resources")
        .select("id, title, category, author_name")
        .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
        .limit(6);
      setResourceResults(
        (data ?? []).map((r) => ({
          id: r.id,
          label: r.title,
          description: `${r.category} · ${r.author_name}`,
          href: "/explore",
          icon: FileText,
        })),
      );
    }, 200);
    return () => clearTimeout(handle);
  }, [query]);

  const navMatches = useMemo(() => {
    if (!query.trim()) return navResults;
    const q = query.toLowerCase();
    return navResults.filter(
      (result) =>
        result.label.toLowerCase().includes(q) ||
        result.description.toLowerCase().includes(q),
    );
  }, [query]);

  const results = query.trim()
    ? [...navMatches, ...resourceResults]
    : navResults;

  function handleSelect(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-10 w-full items-center gap-2 rounded-full border border-input bg-background px-4 text-sm text-muted-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="flex-1 truncate text-left">
          Search projects, research, people...
        </span>
        <kbd className="hidden shrink-0 items-center gap-0.5 rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-flex">
          &#8984;K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent hideClose className="top-32 max-w-xl gap-0 overflow-hidden p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Search knowvault</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2 border-b border-border px-4">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search projects, research, people..."
              className="h-12 rounded-none border-none px-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            {results.length === 0 && (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                No matches for &ldquo;{query}&rdquo;.
              </p>
            )}
            {results.map((result) => (
              <button
                key={result.id}
                type="button"
                onClick={() => handleSelect(result.href)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                  "hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:outline-none",
                )}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <result.icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium text-foreground">
                    {result.label}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {result.description}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
