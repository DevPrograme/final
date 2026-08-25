import type { LucideIcon } from "lucide-react";

export type ResourceCategory = "Projects" | "Placement prep" | "Research";

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  "Projects",
  "Placement prep",
  "Research",
];

export interface ResourceFile {
  id: string;
  name: string;
  url: string;
  size: number | null;
}

export interface Resource {
  id: string;
  category: ResourceCategory;
  year: number;
  department: string;
  title: string;
  description: string;
  tags: string[];
  authorName: string;
  authorId?: string | null;
  reusedCount: number;
  externalUrl?: string | null;
  files?: ResourceFile[];
  createdAt?: string;
  saved?: boolean;
}

export interface TimelineEntry {
  id: string;
  resourceId: string;
  resourceTitle: string;
  category: ResourceCategory;
  reuserName: string;
  note: string | null;
  createdAt: string;
}

export interface Contributor {
  id: string;
  name: string;
  department: string | null;
  avatarUrl: string | null;
  contributionCount: number;
  reuseImpact: number;
}

export interface ResourceFilters {
  category?: ResourceCategory;
  department?: string;
  year?: number;
  tag?: string;
  query?: string;
}

export interface StatCardData {
  id: string;
  label: string;
  icon: LucideIcon;
  iconClassName: string;
  value?: string;
  delta?: string;
  helper?: string;
}

export interface WeeklyPulsePoint {
  label: string;
  value: number;
  isToday?: boolean;
}

export interface EffectStat {
  id: string;
  value: string;
  label: string;
}

export interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavGroup {
  title: string;
  items: NavLink[];
}
