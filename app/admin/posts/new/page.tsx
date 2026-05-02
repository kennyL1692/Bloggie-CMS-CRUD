import { createClient } from "@/lib/supabase/server"
import { PostForm } from "@/components/admin/post-form"
import { createPost } from "@/app/admin/posts/actions"

export const metadata = { title: "New Post" }

export default async function NewPostPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name")

  return (
    <PostForm
      categories={categories ?? []}
      action={createPost}
      mode="create"
    />
  )
}
