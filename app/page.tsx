import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/public/navbar"
import { Footer } from "@/components/public/footer"
import { PostCard } from "@/components/public/post-card"
import Image from "next/image"
import Link from "next/link"
import { Clock } from "lucide-react"
import { formatDate, getReadingTime, stripHtml, truncate } from "@/lib/utils"

async function getPosts() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from("posts")
    .select(`
      id, title, slug, excerpt, content, featured_image,
      published_at, created_at,
      profiles ( name, avatar_url ),
      post_categories ( categories ( id, name, slug ) )
    `)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(13)

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name")

  return { posts: posts ?? [], categories: categories ?? [] }
}

function normalizePost(raw: any) {
  return {
    ...raw,
    categories: raw.post_categories
      ?.map((pc: any) => pc.categories)
      .filter(Boolean) ?? [],
  }
}

/* ── Editorial featured card — horizontal split ───────────────── */
function FeaturedCard({ post }: { post: any }) {
  const readTime    = getReadingTime(stripHtml(post.content))
  const dateStr     = formatDate(post.published_at ?? post.created_at)
  const category    = post.categories?.[0]
  const authorName  = post.profiles?.name ?? "Author"
  const initial     = authorName.slice(0, 1).toUpperCase()
  const excerpt     = post.excerpt
    ? truncate(post.excerpt, 180)
    : truncate(stripHtml(post.content), 180)

  return (
    <article className="group grid grid-cols-1 md:grid-cols-[1.1fr_1fr] rounded-2xl overflow-hidden border border-[#e8e6dc] dark:border-[#2a2926] bg-white dark:bg-[#1e1d1b] shadow-warm-sm hover:shadow-warm-orange hover:border-[#d97757]/30 transition-all duration-300">

      {/* Image */}
      <Link href={`/posts/${post.slug}`} className="relative block min-h-[260px] md:min-h-[340px] overflow-hidden">
        {post.featured_image ? (
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover motion-safe:group-hover:scale-[1.02] transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 55vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#f5d5c3] to-[#e8e6dc] dark:from-[#2a2926] dark:to-[#1e1d1b] flex items-center justify-center">
            <span className="text-7xl font-bold text-[#d97757]/20" style={{ fontFamily: "var(--font-heading)" }}>
              {post.title.slice(0, 1)}
            </span>
          </div>
        )}
        {/* bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* Content */}
      <div className="flex flex-col justify-center p-8 md:p-10">
        {/* Category + reading time */}
        <div className="flex items-center gap-3 mb-4">
          {category && (
            <span className="text-xs font-semibold text-[#d97757] uppercase tracking-widest">
              {category.name}
            </span>
          )}
          <span className="text-[#e8e6dc] dark:text-[#2a2926]">·</span>
          <span className="flex items-center gap-1 text-xs text-[#b0aea5]">
            <Clock size={11} /> {readTime}
          </span>
        </div>

        {/* Title */}
        <Link href={`/posts/${post.slug}`}>
          <h2
            className="text-2xl sm:text-3xl font-bold text-[#141413] dark:text-[#faf9f5] leading-[1.15] tracking-tight group-hover:text-[#d97757] transition-colors mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-[15px] text-[#6b6966] dark:text-[#8a8880] leading-relaxed mb-6">
          {excerpt}
        </p>

        {/* Author */}
        <div className="flex items-center gap-3 pt-5 border-t border-[#f0ede6] dark:border-[#2a2926]">
          <div className="w-8 h-8 rounded-full bg-[#d97757] flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">{initial}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-[#141413] dark:text-[#faf9f5] leading-none">{authorName}</p>
            <p className="text-xs text-[#b0aea5] mt-1">{dateStr}</p>
          </div>
          <Link
            href={`/posts/${post.slug}`}
            className="ml-auto text-xs font-semibold text-[#d97757] hover:underline underline-offset-2"
          >
            Read article →
          </Link>
        </div>
      </div>
    </article>
  )
}

/* ── Section label ───────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-1 h-4 rounded-full bg-[#d97757]" />
      <h2 className="text-[11px] font-semibold text-[#b0aea5] uppercase tracking-[0.15em]">
        {children}
      </h2>
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────────── */
export default async function HomePage() {
  const { posts: rawPosts, categories } = await getPosts()
  const posts = rawPosts.map(normalizePost)
  const [featured, ...rest] = posts

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f5] dark:bg-[#141413]">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative grid grid-cols-1 lg:grid-cols-2 min-h-[580px] border-b border-[#e8e6dc] dark:border-[#2a2926] overflow-hidden">

        {/* Mobile: photo as background */}
        <div className="absolute inset-0 lg:hidden">
          <Image
            src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=900&q=80"
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-[#141413]/85" />
        </div>

        {/* Left — text panel */}
        <div className="relative z-10 flex flex-col justify-center py-16 sm:py-20 px-8 sm:px-14 bg-transparent lg:bg-[#141413] dark:bg-[#0e0e0d]">
          {/* Inner content — max-width contained, pushed right toward the photo on desktop */}
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-[400px] lg:ml-auto lg:mr-10">

            <div className="w-6 h-[1.5px] bg-[#d97757] mb-7" />

            <p className="text-[10px] font-semibold text-[#d97757] uppercase tracking-[0.25em] mb-5">
              A place for ideas
            </p>

            <h1
              className="text-[2rem] sm:text-[2.6rem] lg:text-[2.9rem] font-bold text-[#faf9f5] leading-[1.07] tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Ideas worth<br />
              reading,<br />
              <em className="not-italic text-[#d97757]">stories</em><br />
              worth telling.
            </h1>

            <p className="mt-5 text-[14px] text-[#8a8880] leading-relaxed">
              Thoughtful writing on technology, design, and the ideas that shape how we work and live.
            </p>

            {/* CTAs — understated for premium feel */}
            <div className="flex items-center gap-4 mt-7">
              <Link
                href="/search"
                className="text-sm font-medium text-[#faf9f5] hover:text-[#d97757] transition-colors border-b border-[#faf9f5]/30 hover:border-[#d97757] pb-0.5"
              >
                Read Latest →
              </Link>
              <span className="text-[#ffffff]/15">|</span>
              <Link
                href="/search"
                className="text-sm font-medium text-[#6b6966] hover:text-[#8a8880] transition-colors"
              >
                Browse all
              </Link>
            </div>

            {categories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-9 pt-7 border-t border-[#ffffff]/8">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="px-2.5 py-1 text-[10px] font-medium text-[#5a5855] bg-[#ffffff]/4 border border-[#ffffff]/8 rounded-full hover:border-[#d97757]/40 hover:text-[#d97757] transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — photo (desktop only) */}
        <div className="relative hidden lg:block">
          <Image
            src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=900&q=85"
            alt="Writing desk with laptop and coffee"
            fill
            className="object-cover object-center"
            sizes="50vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141413] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
        </div>
      </section>

      {/* ── Content ── */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-14 sm:py-16 space-y-16">

        {posts.length === 0 ? (
          <div className="text-center py-28">
            <h2
              className="text-2xl font-bold text-[#141413] dark:text-[#faf9f5] mb-3"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Nothing published yet
            </h2>
            <p className="text-[#6b6966] mb-6">
              Check back soon, or head to the admin to write your first post.
            </p>
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-2 bg-[#141413] hover:bg-[#d97757] text-white text-sm px-5 py-2.5 rounded-xl transition-colors"
            >
              Write your first post →
            </Link>
          </div>
        ) : (
          <>
            {/* Featured — horizontal editorial card */}
            {featured && (
              <section>
                <SectionLabel>Featured</SectionLabel>
                <FeaturedCard post={featured} />
              </section>
            )}

            {/* Latest posts — 3-col grid */}
            {rest.length > 0 && (
              <section>
                <SectionLabel>Latest Posts</SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
