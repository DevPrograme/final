import { Target, Users, Zap, Sparkles } from "lucide-react";
import type {
  StatCardData,
  Resource,
  WeeklyPulsePoint,
  EffectStat,
} from "@/lib/types";
import type { LucideIcon } from "lucide-react";

export const statCards: StatCardData[] = [
  {
    id: "projects-preserved",
    label: "Projects preserved",
    icon: Target,
    iconClassName: "bg-primary/10 text-primary",
    value: "1,284",
    delta: "+12.8%",
  },
  {
    id: "active-contributors",
    label: "Active contributors",
    icon: Users,
    iconClassName: "bg-sky-100 text-sky-600",
    value: "3,862",
    delta: "+8.4%",
  },
  {
    id: "knowledge-reused",
    label: "Knowledge reused",
    icon: Zap,
    iconClassName: "bg-lime-100 text-lime-700",
    value: "8,491",
    delta: "+24.6%",
  },
  {
    id: "your-impact",
    label: "Your impact",
    icon: Sparkles,
    iconClassName: "bg-orange-100 text-orange-600",
    value: "Make your mark",
    helper: "Start today",
  },
];

export const resources: Resource[] = [
  {
    id: "mediroute",
    category: "Projects",
    year: 2024,
    department: "Computer Science",
    title: "MediRoute: AI triage for rural clinics",
    description:
      "A practical guide to building a lightweight ML triage assistant with a human-in-the-loop workflow.",
    tags: ["Python", "ML", "FastAPI"],
    authorName: "Aarav Mehta",
    reusedCount: 12,
  },
  {
    id: "placement-os",
    category: "Placement prep",
    year: 2025,
    department: "Information Technology",
    title: "Placement OS: the interview preparation playbook",
    description:
      "What worked, what did not, and a week-by-week system for technical interview preparation.",
    tags: ["DSA", "System Design"],
    authorName: "Diya Shah",
    reusedCount: 28,
  },
  {
    id: "campus-energy",
    category: "Research",
    year: 2023,
    department: "Electrical Engineering",
    title: "Campus energy dashboard research notes",
    description:
      "Research notes and data collection templates from a campus sustainability study.",
    tags: ["Python", "Pandas", "IoT"],
    authorName: "Prof. Neha Rao",
    reusedCount: 7,
  },
];

export const weeklyPulse: WeeklyPulsePoint[] = [
  { label: "M", value: 420 },
  { label: "T", value: 480 },
  { label: "W", value: 610 },
  { label: "T", value: 540 },
  { label: "F", value: 690, isToday: true },
  { label: "S", value: 350 },
  { label: "S", value: 300 },
];

export const weeklyPulseDelta = "+24.6% more reuse than last week";

export const effectStats: EffectStat[] = [
  { id: "hours-saved", value: "12.4k", label: "hours saved by students" },
  { id: "derivative-projects", value: "246", label: "derivative projects" },
  { id: "would-contribute", value: "94%", label: "would contribute again" },
];

export const landingFeatures: {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    id: "preserve",
    icon: Target,
    title: "Preserve what you build",
    description:
      "Projects, research, and placement prep stay documented long after the people who made them graduate.",
  },
  {
    id: "reuse",
    icon: Zap,
    title: "Reuse instead of rebuilding",
    description:
      "Start from what a senior already figured out. Fork a resource, adapt it, and credit where it came from.",
  },
  {
    id: "mentorship",
    icon: Users,
    title: "Learn from people, not just docs",
    description:
      "Every resource is tied to a real contributor you can message for mentorship or a quick sanity check.",
  },
  {
    id: "vault-ai",
    icon: Sparkles,
    title: "VaultAI finds the right match",
    description:
      "Describe what you're stuck on and VaultAI surfaces the closest prior work from every department.",
  },
];
