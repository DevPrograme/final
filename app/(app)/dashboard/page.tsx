import { currentUser } from "@clerk/nextjs/server";
import { Flame } from "lucide-react";

import { DashboardHero } from "@/components/shared/dashboard-hero";
import { StatCard } from "@/components/shared/stat-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { ResourceCard } from "@/components/shared/resource-card";
import { KnowledgePulseChart } from "@/components/shared/knowledge-pulse-chart";
import { EffectBanner } from "@/components/shared/effect-banner";
import { getGreeting, formatLongDate } from "@/lib/utils";
import {
  statCards,
  resources,
  weeklyPulse,
  weeklyPulseDelta,
  effectStats,
} from "@/lib/data";

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10">
      <DashboardHero
        greeting={getGreeting()}
        dateLabel={formatLongDate()}
        firstName={user?.firstName}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
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
          <KnowledgePulseChart data={weeklyPulse} deltaLabel={weeklyPulseDelta} />
        </div>
      </div>

      <EffectBanner stats={effectStats} />
    </div>
  );
}
