import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarketingHeader } from "@/components/shared/marketing-header";
import { MarketingFooter } from "@/components/shared/marketing-footer";
import { EffectBanner } from "@/components/shared/effect-banner";
import { StatCard } from "@/components/shared/stat-card";
import { ResourceCard } from "@/components/shared/resource-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { statCards, resources, effectStats, landingFeatures } from "@/lib/data";
  
export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <MarketingHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="container grid gap-12 py-16 sm:py-24 lg:grid-cols-2 lg:items-center lg:gap-10">
          <div className="space-y-6">
            <Badge variant="secondary" className="gap-1.5 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-vault-badge" />
              Built for one campus at a time
            </Badge>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
              Your college&rsquo;s collective intelligence,{" "}
              <span className="text-primary">in one place.</span>
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground">
              Every final-year project, research note, and placement war
              story your campus produces &mdash; searchable, reusable, and
              credited to the person who figured it out first.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/sign-up">
                  Get started free
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href="#features">See how it works</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-primary/5 blur-2xl" />
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard {...statCards[0]} />
              <StatCard {...statCards[2]} />
              <div className="sm:col-span-2">
                <ResourceCard {...resources[0]} />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="container space-y-10 py-16 sm:py-20">
          <SectionHeading
            eyebrow="What you get"
            title="Everything a graduating project shouldn't take with it"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {landingFeatures.map((feature) => (
              <div
                key={feature.id}
                className="space-y-3 rounded-2xl border border-border/60 bg-card p-6 shadow-card"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                </span>
                <h3 className="text-base font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Effect */}
        <section id="effect" className="container pb-16 sm:pb-20">
          <EffectBanner stats={effectStats} />
        </section>

        {/* Final CTA */}
        <section className="container pb-24 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Stop rebuilding what a senior already solved.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Join your college&rsquo;s vault and make your own work someone
            else&rsquo;s starting point.
          </p>
          <Button asChild size="lg" className="mt-6">
            <Link href="/sign-up">
              Create your account
              <ArrowRight />
            </Link>
          </Button>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
