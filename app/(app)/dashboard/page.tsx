import { Flame } from "lucide-react";

import { DashboardHero } from "@/components/shared/dashboard-hero";
import { StatCard } from "@/components/shared/stat-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { ResourceCard } from "@/components/shared/resource-card";
import { KnowledgePulseChart } from "@/components/shared/knowledge-pulse-chart";
import { EffectBanner } from "@/components/shared/effect-banner";
import { getGreeting, formatLongDate, formatCompactNumber } from "@/lib/utils";
import { statCards, effectStats } from "@/lib/data";
import {
  getCurrentProfile,
  getResources,
  getStats,
  getWeeklyPulse,
} from "@/lib/queries";
import type { StatCardData } from "@/lib/types";

export default async function DashboardPage() {
  const [profile, resources, stats, pulse] = await Promise.all([
    getCurrentProfile(),
    getResources({}, 3),
    getStats(),
    getWeeklyPulse(),
  ]);

  const firstName = profile?.full_name?.split(" ")[0] ?? null;

  // Keep the designed icons/styles, fill in live values from the database.
  const cards: StatCardData[] = statCards.map((card) => {
    switch (card.id) {
      case "projects-preserved":
        return { ...card, value: formatCompactNumber(stats.projectsPreserved) };
      case "active-contributors":
        return {
          ...card,
          value: formatCompactNumber(stats.activeContributors),
        };
      case "knowledge-reused":
        return { ...card, value: formatCompactNumber(stats.knowledgeReused) };
      default:
        return card;
    }
  });

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10">
      <DashboardHero
        greeting={getGreeting()}
        dateLabel={formatLongDate()}
        firstName={firstName}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      <div className="space-y-5">
        <SectionHeading
          eyebrow="Picked for you"
          eyebrowIcon={Flame}
          title="Resources with momentum"
          actionLabel="See all"
          actionHref="/explore"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} {...resource} />
          ))}
          <KnowledgePulseChart data={pulse.points} deltaLabel={pulse.delta} />
        </div>
      </div>

      <EffectBanner stats={effectStats} />
    </div>
  );
}
