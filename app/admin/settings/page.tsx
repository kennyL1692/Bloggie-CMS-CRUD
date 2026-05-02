import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/admin/profile-form"
import type { Profile } from "@/types"

export const metadata = { title: "Settings" }

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // If no profile row yet, use defaults
  const safeProfile: Profile = profile ?? {
    id:         user.id,
    name:       user.email ?? "",
    bio:        null,
    avatar_url: null,
    updated_at: new Date().toISOString(),
  }

  return (
    <ProfileForm
      profile={safeProfile}
      email={user.email ?? ""}
    />
  )
}
