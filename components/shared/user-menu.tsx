"use client";

import { useEffect, useRef, useState } from "react";
import { LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getInitials } from "@/lib/utils";
import { signOut } from "@/lib/actions/auth";

interface UserMenuProps {
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export function UserMenu({ name, email, avatarUrl }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Account menu"
        className="rounded-full outline-none ring-offset-2 transition focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Avatar className="h-9 w-9 border border-border/60">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
          <AvatarFallback className="bg-primary/10 text-primary">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border/60 bg-popover p-1 shadow-popover">
          <div className="px-3 py-2">
            <p className="truncate text-sm font-medium text-foreground">
              {name}
            </p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
          <Separator />
          <form action={signOut}>
            <button
              type="submit"
              className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
