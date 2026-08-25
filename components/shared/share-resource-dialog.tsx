"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { createResource } from "@/lib/actions/resources";
import { RESOURCE_CATEGORIES } from "@/lib/types";

const fieldClass =
  "flex w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

interface ShareResourceDialogProps {
  triggerVariant?: "default" | "outline";
  triggerSize?: "default" | "sm" | "lg";
  triggerClassName?: string;
  fullWidthTrigger?: boolean;
}

export function ShareResourceDialog({
  triggerVariant = "default",
  triggerSize = "lg",
  triggerClassName,
}: ShareResourceDialogProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await createResource(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      formRef.current?.reset();
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={triggerVariant}
          size={triggerSize}
          className={cn("w-fit shrink-0", triggerClassName)}
        >
          <Upload />
          Share knowledge
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Share knowledge</DialogTitle>
          <DialogDescription>
            Preserve a project, research note, or placement playbook for the
            next person.
          </DialogDescription>
        </DialogHeader>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="max-h-[70vh] space-y-4 overflow-y-auto p-6 pt-2"
        >
          <Label text="Title">
            <input
              name="title"
              required
              placeholder="MediRoute: AI triage for rural clinics"
              className={fieldClass}
            />
          </Label>

          <div className="grid grid-cols-2 gap-3">
            <Label text="Category">
              <select name="category" required defaultValue="Projects" className={fieldClass}>
                {RESOURCE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </Label>
            <Label text="Year">
              <input
                name="year"
                type="number"
                required
                defaultValue={new Date().getFullYear()}
                min={1900}
                max={2100}
                className={fieldClass}
              />
            </Label>
          </div>

          <Label text="Department">
            <input
              name="department"
              required
              placeholder="Computer Science"
              className={fieldClass}
            />
          </Label>

          <Label text="Tags (comma separated)">
            <input
              name="tags"
              placeholder="Python, ML, FastAPI"
              className={fieldClass}
            />
          </Label>

          <Label text="Description">
            <textarea
              name="description"
              rows={3}
              placeholder="What it does, what worked, what to reuse."
              className={cn(fieldClass, "resize-none")}
            />
          </Label>

          <Label text="External link (optional)">
            <Input name="externalUrl" type="url" placeholder="https://github.com/..." />
          </Label>

          <Label text="Attach files (optional)">
            <input
              name="files"
              type="file"
              multiple
              className={cn(fieldClass, "cursor-pointer py-2")}
            />
          </Label>

          {error && (
            <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Share
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-foreground">{text}</span>
      {children}
    </label>
  );
}
