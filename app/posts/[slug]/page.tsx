import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/public/navbar"
import { Footer } from "@/components/public/footer"
import { ReadingProgress } from "@/components/public/reading-progress"
import { PostCard } from "@/components/public/post-card"
import { formatDate, getReadingTime, stripHtml } from "@/lib/utils"
import { Clock, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { ShareButtons } from "@/components/public/share-buttons"

interface Props {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from("posts")
    .select(`
      id, title, slug, content, excerpt, featured_image,
      published_at, created_at, view_count,
      meta_title, meta_description,
      profiles ( name, bio, avatar_url ),
      post_categories ( categories ( id, name, slug ) ),
      post_tags ( tags ( id, name, slug ) )
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  return data
}

async function getRelated(postId: string, categoryIds: string[]) {
  if (!categoryIds.length) return []
  const supabase = await createClient()

  const { data } = await supabase
    .from("posts")
    .select(`
      id, title, slug, excerpt, content, featured_image,
      published_at, created_at,
      profiles ( name, avatar_url ),
      post_categories ( categories ( id, name, slug ) )
    `)
    .eq("status", "published")
    .neq("id", postId)
    .limit(3)

  return (data ?? []).map((p: any) => ({
    ...p,
    categories: p.post_categories?.map((pc: any) => pc.categories).filter(Boolean) ?? [],
  }))
}

async function incrementViewCount(id: string) {
  try {
    const supabase = await createClient()
    const { data: current } = await supabase
      .from("posts")
      .select("view_count")
      .eq("id", id)
      .single()
    if (current) {
      await supabase
        .from("posts")
        .update({ view_count: (current.view_count ?? 0) + 1 })
        .eq("id", id)
    }
  } catch {
    // Non-critical — silently ignore
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: "Post not found" }

  return {
    title:       post.meta_title || post.title,
    description: post.meta_description || post.excerpt || stripHtml(post.content).slice(0, 160),
    openGraph: {
      title:       post.meta_title || post.title,
      description: post.meta_description || post.excerpt || undefined,
      images:      post.featured_image ? [post.featured_image] : [],
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  // Increment view count (fire-and-forget, don't block render)
  incrementViewCount(post.id)

  const categories = post.post_categories?.map((pc: any) => pc.categories).filter(Boolean) ?? []
  const tags       = post.post_tags?.map((pt: any) => pt.tags).filter(Boolean) ?? []
  const related    = await getRelated(post.id, categories.map((c: any) => c.id))

  const readTime   = getReadingTime(stripHtml(post.content))
  const dateStr    = formatDate(post.published_at ?? post.created_at)
  const author     = post.profiles as unknown as { name: string; bio: string | null; avatar_url: string | null } | null
  const authorInitials = (author?.name ?? "A").slice(0, 2).toUpperCase()

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f5] dark:bg-[#141413]">
      <ReadingProgress />
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-6">
          {/* Category */}
          {categories[0] && (
            <Link
              href={`/categories/${categories[0].slug}`}
              className="inline-block text-xs font-semibold text-[#d97757] uppercase tracking-wide mb-4 hover:underline"
            >
              {categories[0].name}
            </Link>
          )}

          {/* Title */}
          <h1
            className="text-3xl sm:text-4xl font-bold text-[#141413] dark:text-[#faf9f5] leading-tight mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {post.title}
          </h1>

          {/* Excerpt / lead */}
          {post.excerpt && (
            <p className="text-lg text-[#6b6966] dark:text-[#8a8880] leading-relaxed mb-6" style={{ fontFamily: "var(--font-body)" }}>
              {post.excerpt}
            </p>
          )}

          {/* Meta bar */}
          <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-[#e8e6dc] dark:border-[#2a2926]">
            {/* Author avatar */}
            <div className="flex items-center gap-2.5">
              {author?.avatar_url ? (
                <div className="h-9 w-9 rounded-full overflow-hidden shrink-0">
                  <Image
                    src={author.avatar_url}
                    alt={author.name}
                    width={36}
                    height={36}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="h-9 w-9 rounded-full bg-[#d97757] flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">{authorInitials}</span>
                </div>
              )}
              <span className="text-sm font-medium text-[#141413] dark:text-[#faf9f5]">{author?.name ?? "Author"}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#b0aea5]">
              <span>·</span>
              <span>{dateStr}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock size={11} />{readTime}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Eye size={11} />{post.view_count} views</span>
            </div>
          </div>
        </div>

        {/* Featured image */}
        {post.featured_image && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-8">
            <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: "16/7" }}>
              <Image
                src={post.featured_image}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 900px"
                priority
              />
            </div>
          </div>
        )}

        {/* Post content */}
        <article className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Tags + Share row */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[#e8e6dc] dark:border-[#2a2926] pt-6">
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: any) => (
                <Link
                  key={tag.id}
                  href={`/tags/${tag.slug}`}
                  className="px-3 py-1 text-xs font-medium text-[#6b6966] dark:text-[#8a8880] bg-white dark:bg-[#1e1d1b] border border-[#e8e6dc] dark:border-[#2a2926] rounded-full hover:border-[#d97757] hover:text-[#d97757] dark:hover:text-[#d97757] dark:hover:border-[#d97757] transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          ) : <div />}
          <ShareButtons
            title={post.title}
            url={`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/posts/${post.slug}`}
          />
        </div>

        {/* Author bio */}
        {author && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
            <div className="bg-white dark:bg-[#1e1d1b] rounded-2xl border border-[#e8e6dc] dark:border-[#2a2926] p-6 flex gap-4">
              {author.avatar_url ? (
                <div className="h-14 w-14 rounded-full overflow-hidden shrink-0">
                  <Image
                    src={author.avatar_url}
                    alt={author.name}
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="h-14 w-14 rounded-full bg-[#d97757] flex items-center justify-center shrink-0">
                  <span className="text-white text-lg font-bold">{authorInitials}</span>
                </div>
              )}
              <div>
                <p className="font-semibold text-[#141413] dark:text-[#faf9f5]">{author.name}</p>
                {author.bio && (
                  <p className="text-sm text-[#6b6966] dark:text-[#8a8880] mt-1 leading-relaxed">{author.bio}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Related posts */}
        {related.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-14">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-4 rounded-full bg-[#d97757]" />
              <h2 className="text-[11px] font-semibold text-[#b0aea5] uppercase tracking-[0.15em]">
                More to Read
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((rp: any) => (
                <PostCard key={rp.id} post={rp} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
