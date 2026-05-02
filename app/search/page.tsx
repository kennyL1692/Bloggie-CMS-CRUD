import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/public/navbar"
import { Footer } from "@/components/public/footer"
import { PostCard } from "@/components/public/post-card"
import { Search } from "lucide-react"
import type { Metadata } from "next"

interface Props {
  searchParams: Promise<{ q?: string }>
}

export function generateMetadata(): Metadata {
  return { title: "Search" }
}

function normalizePost(raw: any) {
  return {
    ...raw,
    categories: raw.post_categories?.map((pc: any) => pc.categories).filter(Boolean) ?? [],
  }
}

const POST_FIELDS = `
  id, title, slug, excerpt, content, featured_image,
  published_at, created_at,
  profiles ( name, avatar_url ),
  post_categories ( categories ( id, name, slug ) )
`

async function getData(query: string) {
  const supabase = await createClient()

  // Always fetch recent (used either as fallback or for no-query display)
  const recentPromise = supabase
    .from("posts")
    .select(POST_FIELDS)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(6)

  if (!query) {
    const { data } = await recentPromise
    return { results: [], recent: (data ?? []).map(normalizePost) }
  }

  // Query + recent in parallel — one round trip pair, no double-fetch
  const [searchRes, recentRes] = await Promise.all([
    supabase
      .from("posts")
      .select(POST_FIELDS)
      .eq("status", "published")
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
      .order("published_at", { ascending: false })
      .limit(20),
    recentPromise,
  ])

  return {
    results: (searchRes.data ?? []).map(normalizePost),
    recent:  (recentRes.data  ?? []).map(normalizePost),
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams
  const query = q?.trim() ?? ""
  const { results, recent } = await getData(query)

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f5] dark:bg-[#141413]">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 space-y-8">

        {/* ── Header ── */}
        <div className="border-b border-[#e8e6dc] dark:border-[#2a2926] pb-6">
          <div className="flex items-center gap-3 mb-1">
            <Search size={20} className="text-[#d97757]" />
            <h1
              className="text-2xl font-bold text-[#141413] dark:text-[#faf9f5]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {query ? `Results for "${query}"` : "Search"}
            </h1>
          </div>
          {query && (
            <p className="text-sm text-[#b0aea5] ml-8">
              {results.length} post{results.length !== 1 ? "s" : ""} found
            </p>
          )}
        </div>

        {/* ── No query → show recent posts ── */}
        {!query && (
          recent.length > 0 ? (
            <>
              <SectionLabel>Recent Posts</SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {recent.map((post: any) => <PostCard key={post.id} post={post} />)}
              </div>
            </>
          ) : (
            <EmptyState message="No posts published yet. Check back soon." />
          )
        )}

        {/* ── Query with results ── */}
        {query && results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((post: any) => <PostCard key={post.id} post={post} />)}
          </div>
        )}

        {/* ── Query with no results ── */}
        {query && results.length === 0 && (
          <>
            <EmptyState
              heading="No results found"
              message={`Nothing matched "${query}". Try different keywords.`}
            />
            {recent.length > 0 && (
              <>
                <SectionLabel>You might like</SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {recent.map((post: any) => <PostCard key={post.id} post={post} />)}
                </div>
              </>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

/* ── Helpers ── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-1 h-4 rounded-full bg-[#d97757]" />
      <h2 className="text-xs font-semibold text-[#b0aea5] uppercase tracking-widest">{children}</h2>
    </div>
  )
}

function EmptyState({ heading, message }: { heading?: string; message: string }) {
  return (
    <div className="text-center py-20">
      <Search size={40} className="mx-auto text-[#e8e6dc] mb-4" />
      {heading && (
        <p className="text-lg font-semibold text-[#141413] dark:text-[#faf9f5] mb-2"
           style={{ fontFamily: "var(--font-heading)" }}>
          {heading}
        </p>
      )}
      <p className="text-sm text-[#b0aea5]">{message}</p>
    </div>
  )
}
