"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

/**
 * Animated day/night pill toggle (sun ↔ moon) that flips the color theme.
 * Renders a same-size placeholder until mounted to avoid a hydration mismatch.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <span
        aria-hidden
        className={cn(
          "inline-block h-8 w-16 shrink-0 rounded-full border border-border bg-muted/50",
          className,
        )}
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex h-8 w-16 shrink-0 items-center rounded-full border transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isDark
          ? "border-indigo-300/20 bg-gradient-to-b from-indigo-950 to-slate-900"
          : "border-sky-500/30 bg-gradient-to-b from-sky-400 to-sky-300",
        className,
      )}
    >
      {/* Stars — fade in only in dark mode (left side, opposite the knob) */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity duration-500",
          isDark ? "opacity-100" : "opacity-0",
        )}
      >
        <span className="absolute left-2 top-2 h-[3px] w-[3px] rounded-full bg-white/90" />
        <span className="absolute left-3.5 top-4 h-1 w-1 rounded-full bg-white/70" />
        <span className="absolute left-2.5 top-[22px] h-[2px] w-[2px] rounded-full bg-white/60" />
      </span>

      {/* Knob with a sun that morphs into a moon */}
      <span
        className={cn(
          "relative z-10 flex h-6 w-6 translate-x-1 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-500 ease-out",
          isDark && "translate-x-9",
        )}
      >
        <Sun
          className={cn(
            "absolute h-4 w-4 text-amber-500 transition-all duration-500",
            isDark
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100",
          )}
        />
        <Moon
          className={cn(
            "absolute h-4 w-4 text-indigo-500 transition-all duration-500",
            isDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0",
          )}
        />
      </span>
    </button>
  );
}
