import {
  LayoutGrid,
  Compass,
  Target,
  BookOpen,
  Users,
  Sparkles,
  UploadCloud,
  Bookmark,
  History,
} from "lucide-react";
import type { NavGroup } from "@/lib/types";

export const navGroups: NavGroup[] = [
  {
    title: "Workspace",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
      { label: "Explore", href: "/explore", icon: Compass },
      { label: "Projects", href: "/projects", icon: Target },
      { label: "Research", href: "/research", icon: BookOpen },
    ],
  },
  {
    title: "Connect",
    items: [
      { label: "Mentorship", href: "/mentorship", icon: Users },
      { label: "VaultAI", href: "/vault-ai", icon: Sparkles, badge: "NEW" },
    ],
  },
  {
    title: "Your vault",
    items: [
      { label: "My contributions", href: "/contributions", icon: UploadCloud },
      { label: "Saved", href: "/saved", icon: Bookmark },
      { label: "Knowledge timeline", href: "/timeline", icon: History },
    ],
  },
];
