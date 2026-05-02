import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/public/navbar"
import { Footer } from "@/components/public/footer"
import { PostCard } from "@/components/public/post-card"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

async function getCategoryWithPosts(slug: string) {
  const supabase = await createClient()

  const { data: category } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("slug", slug)
    .single()

  if (!category) return null

  const { data: postLinks } = await supabase
    .from("post_categories")
    .select(`
      posts (
        id, title, slug, excerpt, content, featured_image,
        published_at, created_at,
        profiles ( name, avatar_url ),
        post_categories ( categories ( id, name, slug ) )
      )
    `)
    .eq("category_id", category.id)

  const posts = (postLinks ?? [])
    .map((pl: any) => pl.posts)
    .filter((p: any) => p?.status === "published" || p)
    .map((p: any) => ({
      ...p,
      categories: p.post_categories?.map((pc: any) => pc.categories).filter(Boolean) ?? [],
    }))
    .sort((a: any, b: any) =>
      new Date(b.published_at ?? b.created_at).getTime() -
      new Date(a.published_at ?? a.created_at).getTime()
    )

  return { category, posts }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const result = await getCategoryWithPosts(slug)
  if (!result) return { title: "Category not found" }
  return { title: result.category.name }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const result = await getCategoryWithPosts(slug)
  if (!result) notFound()

  const { category, posts } = result

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f5] dark:bg-[#141413]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 space-y-8">
        {/* Header */}
        <div className="border-b border-[#e8e6dc] dark:border-[#2a2926] pb-6">
          <p className="text-xs font-semibold text-[#d97757] uppercase tracking-widest mb-2">Category</p>
          <h1
            className="text-3xl font-bold text-[#141413] dark:text-[#faf9f5]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {category.name}
          </h1>
          <p className="text-sm text-[#b0aea5] mt-2">{posts.length} post{posts.length !== 1 ? "s" : ""}</p>
        </div>

        {posts.length === 0 ? (
          <p className="text-center py-16 text-sm text-[#b0aea5]">No posts in this category yet.</p>
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
