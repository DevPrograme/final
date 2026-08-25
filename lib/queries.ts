import { createClient } from "@/lib/supabase/server";
import type {
  Contributor,
  Resource,
  ResourceFilters,
  TimelineEntry,
} from "@/lib/types";
import type {
  ProfileRow,
  ResourceFileRow,
  ResourceRow,
} from "@/lib/supabase/types";

const BUCKET = "resource-files";

type SupabaseServerClient = ReturnType<typeof createClient>;
type ResourceRowWithFiles = ResourceRow & { resource_files: ResourceFileRow[] };

function mapResource(
  row: ResourceRowWithFiles,
  client: SupabaseServerClient,
  savedIds: Set<string>,
): Resource {
  return {
    id: row.id,
    category: row.category,
    year: row.year,
    department: row.department,
    title: row.title,
    description: row.description,
    tags: row.tags ?? [],
    authorName: row.author_name,
    authorId: row.author_id,
    reusedCount: row.reused_count,
    externalUrl: row.external_url,
    createdAt: row.created_at,
    saved: savedIds.has(row.id),
    files: (row.resource_files ?? []).map((file) => ({
      id: file.id,
      name: file.file_name,
      size: file.file_size,
      url: client.storage.from(BUCKET).getPublicUrl(file.storage_path).data
        .publicUrl,
    })),
  };
}

/** Current authenticated Supabase user, or null. */
export async function getCurrentUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Profile row for the current user (contains full_name, department, avatar). */
export async function getCurrentProfile(): Promise<ProfileRow | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  return data ?? null;
}

/** Set of resource ids the current user has saved (empty when signed out). */
async function getSavedResourceIds(
  supabase: SupabaseServerClient,
): Promise<Set<string>> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data } = await supabase
    .from("saves")
    .select("resource_id")
    .eq("user_id", user.id);
  return new Set((data ?? []).map((row) => row.resource_id));
}

/** List resources with optional filters. Ordered newest first. */
export async function getResources(
  filters: ResourceFilters = {},
  limit?: number,
): Promise<Resource[]> {
  const supabase = createClient();

  let query = supabase
    .from("resources")
    .select("*, resource_files(*)")
    .order("created_at", { ascending: false });

  if (filters.category) query = query.eq("category", filters.category);
  if (filters.department) query = query.eq("department", filters.department);
  if (filters.year) query = query.eq("year", filters.year);
  if (filters.tag) query = query.contains("tags", [filters.tag]);
  if (filters.query) {
    query = query.or(
      `title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`,
    );
  }
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;

  const savedIds = await getSavedResourceIds(supabase);
  return ((data ?? []) as ResourceRowWithFiles[]).map((row) =>
    mapResource(row, supabase, savedIds),
  );
}

/** Resources authored by the current user. */
export async function getContributions(): Promise<Resource[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("resources")
    .select("*, resource_files(*)")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });
  if (error) throw error;

  const savedIds = await getSavedResourceIds(supabase);
  return ((data ?? []) as ResourceRowWithFiles[]).map((row) =>
    mapResource(row, supabase, savedIds),
  );
}

/** Resources the current user has bookmarked. */
export async function getSavedResources(): Promise<Resource[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("saves")
    .select("resource:resources(*, resource_files(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .returns<{ resource: ResourceRowWithFiles | null }[]>();
  if (error) throw error;

  const savedIds = new Set(
    (data ?? [])
      .map((row) => row.resource?.id)
      .filter(Boolean) as string[],
  );

  return (data ?? [])
    .map((row) => row.resource)
    .filter((row): row is ResourceRowWithFiles => Boolean(row))
    .map((row) => mapResource(row, supabase, savedIds));
}

export interface DashboardStats {
  projectsPreserved: number;
  activeContributors: number;
  knowledgeReused: number;
}

/** Aggregate counts for the dashboard stat cards. */
export async function getStats(): Promise<DashboardStats> {
  const supabase = createClient();

  const [resources, contributors, reuses] = await Promise.all([
    supabase.from("resources").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("reuses").select("*", { count: "exact", head: true }),
  ]);

  return {
    projectsPreserved: resources.count ?? 0,
    activeContributors: contributors.count ?? 0,
    knowledgeReused: reuses.count ?? 0,
  };
}

export interface WeeklyPulseResult {
  points: { label: string; value: number; isToday?: boolean }[];
  delta: string;
}

const DAY_INITIALS = ["S", "M", "T", "W", "T", "F", "S"];

/** Reuse activity for the last 7 days, bucketed per day, for the pulse chart. */
export async function getWeeklyPulse(): Promise<WeeklyPulseResult> {
  const supabase = createClient();

  const now = new Date();
  const startThisWeek = new Date(now);
  startThisWeek.setHours(0, 0, 0, 0);
  startThisWeek.setDate(startThisWeek.getDate() - 6);

  const startLastWeek = new Date(startThisWeek);
  startLastWeek.setDate(startLastWeek.getDate() - 7);

  const { data } = await supabase
    .from("reuses")
    .select("created_at")
    .gte("created_at", startLastWeek.toISOString());

  const rows = data ?? [];

  const points = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startThisWeek);
    day.setDate(day.getDate() + i);
    const value = rows.filter((r) => {
      const d = new Date(r.created_at);
      return (
        d.getFullYear() === day.getFullYear() &&
        d.getMonth() === day.getMonth() &&
        d.getDate() === day.getDate()
      );
    }).length;
    return {
      label: DAY_INITIALS[day.getDay()],
      value,
      isToday: i === 6,
    };
  });

  const thisWeek = rows.filter(
    (r) => new Date(r.created_at) >= startThisWeek,
  ).length;
  const lastWeek = rows.length - thisWeek;

  let delta: string;
  if (lastWeek === 0) {
    delta =
      thisWeek > 0
        ? `${thisWeek} reuses this week`
        : "No reuse activity yet this week";
  } else {
    const pct = Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
    delta = `${pct >= 0 ? "+" : ""}${pct}% ${
      pct >= 0 ? "more" : "less"
    } reuse than last week`;
  }

  return { points, delta };
}

/** Reuse events across the vault, newest first, for the knowledge timeline. */
export async function getTimeline(limit = 50): Promise<TimelineEntry[]> {
  const supabase = createClient();

  type TimelineRow = {
    id: string;
    note: string | null;
    created_at: string;
    resource: {
      id: string;
      title: string;
      category: Resource["category"];
    } | null;
    reuser: { full_name: string | null } | null;
  };

  const { data, error } = await supabase
    .from("reuses")
    .select(
      "id, note, created_at, resource:resources(id, title, category), reuser:profiles(full_name)",
    )
    .order("created_at", { ascending: false })
    .limit(limit)
    .returns<TimelineRow[]>();
  if (error) throw error;

  return (data ?? [])
    .map((row) => {
      const resource = row.resource;
      const reuser = row.reuser;
      if (!resource) return null;
      return {
        id: row.id,
        resourceId: resource.id,
        resourceTitle: resource.title,
        category: resource.category,
        reuserName: reuser?.full_name ?? "Someone",
        note: row.note,
        createdAt: row.created_at,
      } satisfies TimelineEntry;
    })
    .filter((entry): entry is TimelineEntry => entry !== null);
}

/** Contributors with at least one shared resource, for mentorship discovery. */
export async function getContributors(): Promise<Contributor[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("resources")
    .select("author_id, author_name, department, reused_count");
  if (error) throw error;

  const byAuthor = new Map<string, Contributor>();
  for (const row of data ?? []) {
    if (!row.author_id) continue;
    const existing = byAuthor.get(row.author_id);
    if (existing) {
      existing.contributionCount += 1;
      existing.reuseImpact += row.reused_count ?? 0;
    } else {
      byAuthor.set(row.author_id, {
        id: row.author_id,
        name: row.author_name,
        department: row.department,
        avatarUrl: null,
        contributionCount: 1,
        reuseImpact: row.reused_count ?? 0,
      });
    }
  }

  return Array.from(byAuthor.values()).sort(
    (a, b) => b.reuseImpact - a.reuseImpact,
  );
}
