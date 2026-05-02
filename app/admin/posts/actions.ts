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

export async function createPost(formData: FormData) {
  const { supabase, user } = await requireAuth()

  const title         = formData.get("title") as string
  const content       = formData.get("content") as string
  const excerpt       = formData.get("excerpt") as string
  const status        = formData.get("status") as string
  const slug          = (formData.get("slug") as string) || slugify(title)
  const metaTitle     = formData.get("meta_title") as string
  const metaDesc      = formData.get("meta_description") as string
  const scheduledAt   = formData.get("scheduled_at") as string
  const featuredImage = formData.get("featured_image") as string
  const tagNames      = ((formData.get("tags") as string) ?? "")
    .split(",").map((t) => t.trim()).filter(Boolean)

  const { data, error } = await supabase
    .from("posts")
    .insert({
      title,
      content,
      excerpt:          excerpt  || null,
      status,
      slug,
      meta_title:       metaTitle || null,
      meta_description: metaDesc  || null,
      scheduled_at:     scheduledAt || null,
      featured_image:   featuredImage || null,
      author_id:        user.id,
      published_at:     status === "published" ? new Date().toISOString() : null,
    })
    .select("id")
    .single()

  if (error) return { error: error.message }

  // Categories
  const categoryIds = formData.getAll("categories") as string[]
  if (categoryIds.length > 0) {
    await supabase.from("post_categories").insert(
      categoryIds.map((category_id) => ({ post_id: data.id, category_id }))
    )
  }

  // Tags
  for (const name of tagNames) {
    const tagSlug = slugify(name)
    const { data: tag } = await supabase
      .from("tags")
      .upsert({ name, slug: tagSlug }, { onConflict: "slug" })
      .select("id")
      .single()
    if (tag) {
      await supabase.from("post_tags").insert({ post_id: data.id, tag_id: tag.id })
    }
  }

  revalidatePath("/admin/posts")
  revalidatePath("/")
  redirect(`/admin/posts/${data.id}`)
}

export async function updatePost(id: string, formData: FormData) {
  const { supabase } = await requireAuth()

  const title         = formData.get("title") as string
  const content       = formData.get("content") as string
  const excerpt       = formData.get("excerpt") as string
  const status        = formData.get("status") as string
  const slug          = formData.get("slug") as string
  const metaTitle     = formData.get("meta_title") as string
  const metaDesc      = formData.get("meta_description") as string
  const scheduledAt   = formData.get("scheduled_at") as string
  const featuredImage = formData.get("featured_image") as string
  const tagNames      = ((formData.get("tags") as string) ?? "")
    .split(",").map((t) => t.trim()).filter(Boolean)

  const { data: existing } = await supabase
    .from("posts")
    .select("status, published_at, slug")
    .eq("id", id)
    .single()

  const published_at =
    status === "published" && existing?.status !== "published"
      ? new Date().toISOString()
      : existing?.published_at ?? null

  const { error } = await supabase
    .from("posts")
    .update({
      title,
      content,
      excerpt:          excerpt  || null,
      status,
      slug,
      meta_title:       metaTitle || null,
      meta_description: metaDesc  || null,
      scheduled_at:     scheduledAt || null,
      featured_image:   featuredImage || null,
      published_at,
    })
    .eq("id", id)

  if (error) return { error: error.message }

  // Refresh categories
  await supabase.from("post_categories").delete().eq("post_id", id)
  const categoryIds = formData.getAll("categories") as string[]
  if (categoryIds.length > 0) {
    await supabase.from("post_categories").insert(
      categoryIds.map((category_id) => ({ post_id: id, category_id }))
    )
  }

  // Refresh tags
  await supabase.from("post_tags").delete().eq("post_id", id)
  for (const name of tagNames) {
    const tagSlug = slugify(name)
    const { data: tag } = await supabase
      .from("tags")
      .upsert({ name, slug: tagSlug }, { onConflict: "slug" })
      .select("id")
      .single()
    if (tag) {
      await supabase.from("post_tags").insert({ post_id: id, tag_id: tag.id })
    }
  }

  // Revalidate both admin and public paths
  revalidatePath("/admin/posts")
  revalidatePath(`/admin/posts/${id}`)
  revalidatePath("/")
  revalidatePath(`/posts/${slug}`)
  if (existing?.slug && existing.slug !== slug) {
    revalidatePath(`/posts/${existing.slug}`)
  }

  return { success: true }
}

export async function bulkUpdatePosts(ids: string[], action: "publish" | "draft" | "delete") {
  const { supabase } = await requireAuth()

  if (action === "delete") {
    const { error } = await supabase.from("posts").delete().in("id", ids)
    if (error) return { error: error.message }
  } else {
    const status = action === "publish" ? "published" : "draft"
    const updates: Record<string, unknown> = { status }
    if (status === "published") updates.published_at = new Date().toISOString()
    const { error } = await supabase.from("posts").update(updates).in("id", ids)
    if (error) return { error: error.message }
  }

  revalidatePath("/admin/posts")
  revalidatePath("/")
  return { success: true }
}

export async function deletePost(id: string) {
  const { supabase } = await requireAuth()

  const { data: post } = await supabase
    .from("posts")
    .select("slug")
    .eq("id", id)
    .single()

  const { error } = await supabase.from("posts").delete().eq("id", id)
  if (error) return { error: error.message }

  revalidatePath("/admin/posts")
  revalidatePath("/")
  if (post?.slug) revalidatePath(`/posts/${post.slug}`)

  redirect("/admin/posts")
}
