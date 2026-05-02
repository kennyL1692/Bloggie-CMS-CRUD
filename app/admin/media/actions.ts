"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  return { supabase, user }
}

export async function deleteMedia(id: string, filename: string) {
  const { supabase } = await requireAuth()

  // Delete from storage (extract path from filename)
  const storagePath = filename.startsWith("http")
    ? filename.split("/storage/v1/object/public/media/")[1]
    : filename

  await supabase.storage.from("media").remove([storagePath])

  // Delete from media table
  const { error } = await supabase.from("media").delete().eq("id", id)
  if (error) return { error: error.message }

  revalidatePath("/admin/media")
  return { success: true }
}
