import { Suspense } from "react";

import { Logo } from "@/components/shared/logo";
import { AuthForm } from "@/components/shared/auth-form";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-8 bg-muted/40 px-4 py-12">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <Logo href="/" />
      <Suspense>
        <AuthForm mode="sign-up" />
      </Suspense>
    </div>
  );
}
