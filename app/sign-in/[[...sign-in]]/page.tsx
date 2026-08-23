import { SignIn } from "@clerk/nextjs";

import { Logo } from "@/components/shared/logo";

export default function SignInPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 bg-muted/40 px-4 py-12">
      <Logo href="/" />
      <SignIn
        appearance={{
          elements: {
            rootBox: "w-full max-w-sm",
            card: "shadow-card rounded-2xl border border-border/60",
          },
        }}
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/dashboard"
      />
    </div>
  );
}
