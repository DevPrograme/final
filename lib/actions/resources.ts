"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { ResourceCategory } from "@/lib/types";
import { RESOURCE_CATEGORIES } from "@/lib/types";

const BUCKET = "resource-files";

export interface ActionResult {
  error?: string;
  success?: boolean;
  saved?: boolean;
  id?: string;
}

/** Create a resource ("Share knowledge") with optional file attachments. */
export async function createResource(formData: FormData): Promise<ActionResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in to share." };

  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "") as ResourceCategory;
  const department = String(formData.get("department") ?? "").trim();
  const year = Number(formData.get("year"));
  const description = String(formData.get("description") ?? "").trim();
  const externalUrl = String(formData.get("externalUrl") ?? "").trim() || null;
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  if (!title || !RESOURCE_CATEGORIES.includes(category) || !department) {
    return { error: "Title, a valid category, and department are required." };
  }
  if (!Number.isInteger(year) || year < 1900 || year > 2100) {
    return { error: "Enter a valid year." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();
  const authorName =
    profile?.full_name || user.email?.split("@")[0] || "Anonymous";

  const { data: resource, error } = await supabase
    .from("resources")
    .insert({
      author_id: user.id,
      author_name: authorName,
      category,
      department,
      year,
      title,
      description,
      tags,
      external_url: externalUrl,
    })
    .select("id")
    .single();

  if (error || !resource) {
    return { error: error?.message ?? "Could not create the resource." };
  }

  const files = formData
    .getAll("files")
    .filter((file): file is File => file instanceof File && file.size > 0);

  for (const file of files) {
    const path = `${user.id}/${resource.id}/${crypto.randomUUID()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        contentType: file.type || undefined,
        upsert: false,
      });
    if (uploadError) continue;

    await supabase.from("resource_files").insert({
      resource_id: resource.id,
      storage_path: path,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type || null,
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/contributions");
  revalidatePath("/explore");
  revalidatePath("/projects");
  revalidatePath("/research");
  return { success: true, id: resource.id };
}

/** Toggle a bookmark for the current user. */
export async function toggleSave(resourceId: string): Promise<ActionResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in to save." };

  const { data: existing } = await supabase
    .from("saves")
    .select("resource_id")
    .eq("user_id", user.id)
    .eq("resource_id", resourceId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("saves")
      .delete()
      .eq("user_id", user.id)
      .eq("resource_id", resourceId);
    if (error) return { error: error.message };
    revalidatePath("/saved");
    return { saved: false };
  }

  const { error } = await supabase
    .from("saves")
    .insert({ user_id: user.id, resource_id: resourceId });
  if (error) return { error: error.message };
  revalidatePath("/saved");
  return { saved: true };
}

/** Record that the current user reused/forked a resource (powers timeline + count). */
export async function recordReuse(
  resourceId: string,
  note?: string,
): Promise<ActionResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { error } = await supabase.from("reuses").insert({
    resource_id: resourceId,
    user_id: user.id,
    note: note?.trim() || null,
  });
  if (error) return { error: error.message };

  revalidatePath("/timeline");
  revalidatePath("/dashboard");
  return { success: true };
}
