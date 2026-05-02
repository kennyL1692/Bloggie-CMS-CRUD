import { createClient } from "@/lib/supabase/server"
import { PostForm } from "@/components/admin/post-form"
import { updatePost } from "@/app/admin/posts/actions"
import { notFound } from "next/navigation"

export const metadata = { title: "Edit Post" }

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: post }, { data: categories }, { data: postCategories }, { data: postTags }] =
    await Promise.all([
      supabase.from("posts").select("*").eq("id", id).single(),
      supabase.from("categories").select("id, name, slug").order("name"),
      supabase.from("post_categories").select("category_id").eq("post_id", id),
      supabase.from("post_tags").select("tags(id, name, slug)").eq("post_id", id),
    ])

  if (!post) notFound()

  const postWithRelations = {
    ...post,
    categories: postCategories?.map((pc: any) => ({ id: pc.category_id })) ?? [],
    tags: postTags?.flatMap((pt: any) => pt.tags ?? []) ?? [],
  }

  return (
    <PostForm
      post={postWithRelations}
      categories={categories ?? []}
      action={updatePost.bind(null, id)}
      mode="edit"
    />
  )
}
