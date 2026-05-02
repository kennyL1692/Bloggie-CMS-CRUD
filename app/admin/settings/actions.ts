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

export async function updateProfile(formData: FormData) {
  const { supabase, user } = await requireAuth()

  const name       = formData.get("name") as string
  const bio        = formData.get("bio") as string
  const avatarUrl  = formData.get("avatar_url") as string

  const { error } = await supabase
    .from("profiles")
    .update({
      name:       name || "",
      bio:        bio  || null,
      avatar_url: avatarUrl || null,
    })
    .eq("id", user.id)

  if (error) return { error: error.message }

  revalidatePath("/admin/settings")
  return { success: true }
}

export async function changePassword(formData: FormData) {
  const { supabase } = await requireAuth()

  const newPassword     = formData.get("new_password") as string
  const confirmPassword = formData.get("confirm_password") as string

  if (!newPassword || newPassword.length < 6) {
    return { error: "Password must be at least 6 characters" }
  }
  if (newPassword !== confirmPassword) {
    return { error: "Passwords do not match" }
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) return { error: error.message }

  return { success: true }
}
