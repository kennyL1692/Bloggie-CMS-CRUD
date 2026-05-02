import { createClient } from "@/lib/supabase/server"
import { Plus } from "lucide-react"
import Link from "next/link"
import { PostsList } from "@/components/admin/posts-list"

export const metadata = { title: "Posts" }

export default async function PostsPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, slug, status, view_count, created_at, published_at")
    .order("created_at", { ascending: false })

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#141413]" style={{ fontFamily: "var(--font-heading)" }}>
            Posts
          </h1>
          <p className="text-sm text-[#b0aea5] mt-1">{posts?.length ?? 0} total posts</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 bg-[#141413] hover:bg-[#d97757] text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} /> New Post
        </Link>
      </div>

      {/* Table + bulk actions — PostsList owns its own card(s) */}
      <PostsList posts={posts ?? []} />
    </div>
  )
}
