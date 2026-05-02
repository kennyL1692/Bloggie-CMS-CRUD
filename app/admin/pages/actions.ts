"use server"

import { createClient } from "@/lib/supabase/server"
import { slugify } from "@/lib/utils"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  return { supabase, user }
}

export async function createPage(formData: FormData) {
  const { supabase } = await requireAuth()

  const title    = formData.get("title") as string
  const content  = formData.get("content") as string
  const status   = formData.get("status") as string
  const slug     = (formData.get("slug") as string) || slugify(title)
  const metaTitle = formData.get("meta_title") as string
  const metaDesc  = formData.get("meta_description") as string

  const { data, error } = await supabase
    .from("pages")
    .insert({
      title,
      content,
      status,
      slug,
      meta_title:       metaTitle || null,
      meta_description: metaDesc  || null,
    })
    .select("id")
    .single()

  if (error) return { error: error.message }

  revalidatePath("/admin/pages")
  revalidatePath(`/${slug}`)
  redirect(`/admin/pages/${data.id}`)
}

export async function updatePage(id: string, formData: FormData) {
  const { supabase } = await requireAuth()

  const title    = formData.get("title") as string
  const content  = formData.get("content") as string
  const status   = formData.get("status") as string
  const slug     = formData.get("slug") as string
  const metaTitle = formData.get("meta_title") as string
  const metaDesc  = formData.get("meta_description") as string

  const { data: existing } = await supabase
    .from("pages")
    .select("slug")
    .eq("id", id)
    .single()

  const { error } = await supabase
    .from("pages")
    .update({
      title,
      content,
      status,
      slug,
      meta_title:       metaTitle || null,
      meta_description: metaDesc  || null,
    })
    .eq("id", id)

  if (error) return { error: error.message }

  revalidatePath("/admin/pages")
  revalidatePath(`/admin/pages/${id}`)
  revalidatePath(`/${slug}`)
  if (existing?.slug && existing.slug !== slug) revalidatePath(`/${existing.slug}`)

  return { success: true }
}

export async function deletePage(id: string) {
  const { supabase } = await requireAuth()

  const { data: page } = await supabase
    .from("pages")
    .select("slug")
    .eq("id", id)
    .single()

  const { error } = await supabase.from("pages").delete().eq("id", id)
  if (error) return { error: error.message }

  revalidatePath("/admin/pages")
  if (page?.slug) revalidatePath(`/${page.slug}`)

  redirect("/admin/pages")
}
