import type { LucideIcon } from "lucide-react";

export type ResourceCategory = "Projects" | "Placement prep" | "Research";

export interface Resource {
  id: string;
  category: ResourceCategory;
  year: number;
  department: string;
  title: string;
  description: string;
  tags: string[];
  authorName: string;
  reusedCount: number;
  saved?: boolean;
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
