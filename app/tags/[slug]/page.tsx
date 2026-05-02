import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/public/navbar"
import { Footer } from "@/components/public/footer"
import { PostCard } from "@/components/public/post-card"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

async function getTagWithPosts(slug: string) {
  const supabase = await createClient()

  const { data: tag } = await supabase
    .from("tags")
    .select("id, name, slug")
    .eq("slug", slug)
    .single()

  if (!tag) return null

  const { data: postLinks } = await supabase
    .from("post_tags")
    .select(`
      posts (
        id, title, slug, excerpt, content, featured_image,
        published_at, created_at,
        profiles ( name, avatar_url ),
        post_categories ( categories ( id, name, slug ) )
      )
    `)
    .eq("tag_id", tag.id)

  const posts = (postLinks ?? [])
    .map((pl: any) => pl.posts)
    .filter(Boolean)
    .map((p: any) => ({
      ...p,
      categories: p.post_categories?.map((pc: any) => pc.categories).filter(Boolean) ?? [],
    }))
    .sort((a: any, b: any) =>
      new Date(b.published_at ?? b.created_at).getTime() -
      new Date(a.published_at ?? a.created_at).getTime()
    )

  return { tag, posts }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const result = await getTagWithPosts(slug)
  if (!result) return { title: "Tag not found" }
  return { title: `#${result.tag.name}` }
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params
  const result = await getTagWithPosts(slug)
  if (!result) notFound()

  const { tag, posts } = result

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f5] dark:bg-[#141413]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 space-y-8">
        <div className="border-b border-[#e8e6dc] dark:border-[#2a2926] pb-6">
          <p className="text-xs font-semibold text-[#d97757] uppercase tracking-widest mb-2">Tag</p>
          <h1
            className="text-3xl font-bold text-[#141413] dark:text-[#faf9f5]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            #{tag.name}
          </h1>
          <p className="text-sm text-[#b0aea5] mt-2">{posts.length} post{posts.length !== 1 ? "s" : ""}</p>
        </div>

        {posts.length === 0 ? (
          <p className="text-center py-16 text-sm text-[#b0aea5]">No posts with this tag yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
