"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { WeeklyPulsePoint } from "@/lib/types";

interface KnowledgePulseChartProps {
  data: WeeklyPulsePoint[];
  deltaLabel: string;
}

function PulseTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: WeeklyPulsePoint }[];
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-lg border border-border/60 bg-popover px-2.5 py-1.5 text-xs shadow-popover">
      <span className="font-semibold text-foreground">{point.value}</span>{" "}
      <span className="text-muted-foreground">pieces reused</span>
    </div>
  );
}

export function KnowledgePulseChart({ data, deltaLabel }: KnowledgePulseChartProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          This week
        </p>
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          Knowledge pulse
        </h3>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between gap-4 pt-4">
        <div className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip cursor={{ fill: "hsl(var(--muted))" }} content={<PulseTooltip />} />
              <Bar dataKey="value" radius={[6, 6, 2, 2]} maxBarSize={22}>
                {data.map((point) => (
                  <Cell
                    key={point.label + point.value}
                    fill={
                      point.isToday
                        ? "hsl(var(--chart-bar))"
                        : "hsl(var(--chart-bar-muted))"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="flex items-center gap-1.5 text-xs font-medium text-vault-positive">
          <TrendingUp className="h-3.5 w-3.5" />
          {deltaLabel}
        </p>
      </CardContent>
    </Card>
  );
}
