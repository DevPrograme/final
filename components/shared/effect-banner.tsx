import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { EffectStat } from "@/lib/types";

interface EffectBannerProps {
  stats: EffectStat[];
}

const NODE_COUNT = 8;
const nodes = Array.from({ length: NODE_COUNT }, (_, i) => {
  const angle = (i / NODE_COUNT) * Math.PI * 2 - Math.PI / 2;
  return {
    cx: 120 + 92 * Math.cos(angle),
    cy: 120 + 92 * Math.sin(angle),
  };
});

/**
 * A decorative "chain" ring: a dashed circle with evenly spaced nodes,
 * standing in for the idea that one shared project links to the next.
 */
function ChainRing() {
  return (
    <svg
      viewBox="0 0 240 240"
      className="h-56 w-56 shrink-0 sm:h-64 sm:w-64"
      aria-hidden="true"
    >
      <circle
        cx="120"
        cy="120"
        r="92"
        fill="none"
        stroke="hsl(var(--vault-lime) / 0.25)"
        strokeWidth="1.5"
        strokeDasharray="2 10"
        strokeLinecap="round"
      />
      <circle cx="120" cy="120" r="60" fill="hsl(var(--vault-lime) / 0.06)" />
      {nodes.map((node, i) => (
        <circle
          key={i}
          cx={node.cx}
          cy={node.cy}
          r={i === 0 ? 5 : 3}
          fill={i === 0 ? "hsl(var(--vault-lime))" : "hsl(var(--vault-lime) / 0.45)"}
        />
      ))}
    </svg>
  );
}

export function EffectBanner({ stats }: EffectBannerProps) {
  return (
    <Card className="overflow-hidden border-none bg-vault-ink text-vault-ink-foreground shadow-card-hover">
      <div className="grid gap-10 p-8 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-6">
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-vault-ink-foreground/50">
            The knowvault effect
          </p>
          <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Knowledge compounds
            <br />
            <span className="text-vault-lime">when it is shared.</span>
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-vault-ink-foreground/60">
            One project becomes a starting point. One lesson learned saves
            someone else a week.
          </p>
          <Link
            href="/timeline"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-vault-lime"
          >
            See the chain
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="relative flex items-center justify-center gap-6 lg:justify-end">
          <div className="pointer-events-none absolute right-0 hidden opacity-90 sm:right-10 lg:block">
            <ChainRing />
          </div>
          <div className="relative z-10 grid grid-cols-3 gap-6 lg:gap-10">
            {stats.map((stat) => (
              <div key={stat.id} className="space-y-1 text-center lg:text-left">
                <p className="text-2xl font-semibold tracking-tight text-vault-lime sm:text-3xl">
                  {stat.value}
                </p>
                <p className="text-xs leading-snug text-vault-ink-foreground/55">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
