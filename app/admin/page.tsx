import { createClient } from "@/lib/supabase/server"
import { FileText, File, Image, Eye, Plus, ArrowRight,
         PenLine, LayoutDashboard, FolderOpen, Settings } from "lucide-react"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

async function getStats() {
  const supabase = await createClient()

  const [posts, pages, media, recentPosts] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase.from("pages").select("id", { count: "exact", head: true }),
    supabase.from("media").select("id", { count: "exact", head: true }),
    supabase
      .from("posts")
      .select("id, title, slug, status, created_at, view_count")
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  return {
    postCount:   posts.count  ?? 0,
    pageCount:   pages.count  ?? 0,
    mediaCount:  media.count  ?? 0,
    recentPosts: recentPosts.data ?? [],
  }
}

// ── Guide cards — shown when the site has no posts yet ──
const guideSteps = [
  {
    step: "01",
    icon: PenLine,
    title: "Write your first post",
    desc: "Go to Posts → New Post. Give it a title and start writing. Use the toolbar to add headings, bold text, images, links, and code blocks. Toggle the status to Published when you're ready to go live.",
    href: "/admin/posts/new",
    cta: "New Post →",
  },
  {
    step: "02",
    icon: LayoutDashboard,
    title: "Create static pages",
    desc: "Go to Pages → New Page for content like About or Contact. Set the slug (e.g. 'about') and it'll be live at yourdomain.com/about automatically.",
    href: "/admin/pages/new",
    cta: "New Page →",
  },
  {
    step: "03",
    icon: FolderOpen,
    title: "Upload images to Media",
    desc: "Go to Media and drag-and-drop images or click to upload. When writing a post, click the image icon (🖼) in the editor toolbar to open the media picker — browse your library and click any image to insert it instantly.",
    href: "/admin/media",
    cta: "Open Media →",
  },
  {
    step: "04",
    icon: Settings,
    title: "Set up your profile",
    desc: "Go to Settings → Profile to set your display name, bio, and avatar. These appear on every post you publish, below the article content.",
    href: "/admin/settings",
    cta: "Open Settings →",
  },
]

// ── Quick-action buttons — always visible at the top ──
const quickActions = [
  { label: "New Post",  href: "/admin/posts/new",  icon: PenLine,    primary: true },
  { label: "New Page",  href: "/admin/pages/new",  icon: File,       primary: false },
  { label: "Upload",    href: "/admin/media",       icon: Image,      primary: false },
  { label: "View Site", href: "/",                  icon: ArrowRight, primary: false, external: true },
]

export default async function DashboardPage() {
  const { postCount, pageCount, mediaCount, recentPosts } = await getStats()
  const isNew = postCount === 0 && pageCount === 0 && mediaCount === 0

  const stats = [
    { label: "Total Posts",  value: postCount,  icon: FileText, href: "/admin/posts" },
    { label: "Pages",        value: pageCount,  icon: File,     href: "/admin/pages" },
    { label: "Media Files",  value: mediaCount, icon: Image,    href: "/admin/media" },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* ── Header + Quick actions ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#141413]" style={{ fontFamily: "var(--font-heading)" }}>
            Dashboard
          </h1>
          <p className="text-sm text-[#b0aea5] mt-1">
            {isNew ? "Welcome to Bloggie — let's get you set up." : "Welcome back. Here's what's going on."}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {quickActions.map(({ label, href, icon: Icon, primary, external }) => (
            <Link
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              className={`flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-xl font-medium transition-colors ${
                primary
                  ? "bg-[#141413] hover:bg-[#d97757] text-white shadow-warm-sm"
                  : "bg-white border border-[#e8e6dc] text-[#141413] hover:border-[#d97757] hover:text-[#d97757]"
              }`}
            >
              <Icon size={13} />
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-2xl border border-[#e8e6dc] p-5 flex items-center gap-4 hover:border-[#d97757]/50 hover:shadow-warm-orange transition-all group shadow-warm-sm"
          >
            <div className="p-2.5 rounded-xl bg-[#faf9f5] group-hover:bg-[#d97757]/10 transition-colors">
              <Icon size={20} className="text-[#d97757]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#141413]">{value}</p>
              <p className="text-xs text-[#b0aea5]">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Getting Started guide — shown when site is fresh ── */}
      {isNew && (
        <div className="bg-white rounded-2xl border border-[#e8e6dc] overflow-hidden shadow-warm-sm">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#e8e6dc] bg-gradient-to-r from-[#faf9f5] to-white">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-[#d97757]" />
              <p className="text-xs font-semibold text-[#d97757] uppercase tracking-widest">Getting Started</p>
            </div>
            <h2 className="text-base font-bold text-[#141413]" style={{ fontFamily: "var(--font-heading)" }}>
              Four steps to your first published post
            </h2>
            <p className="text-sm text-[#b0aea5] mt-1">
              Everything you need to know about Bloggie in under 5 minutes.
            </p>
          </div>

          {/* Steps */}
          <div className="divide-y divide-[#e8e6dc]">
            {guideSteps.map(({ step, icon: Icon, title, desc, href, cta }) => (
              <div key={step} className="px-6 py-5 flex gap-5 group hover:bg-[#faf9f5] transition-colors">
                {/* Step number */}
                <div className="shrink-0 w-8 h-8 rounded-xl bg-[#d97757]/10 flex items-center justify-center mt-0.5">
                  <span className="text-[10px] font-bold text-[#d97757]">{step}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={14} className="text-[#b0aea5] shrink-0" />
                    <h3 className="text-sm font-semibold text-[#141413]">{title}</h3>
                  </div>
                  <p className="text-sm text-[#b0aea5] leading-relaxed">{desc}</p>
                </div>

                <Link
                  href={href}
                  className="shrink-0 self-center text-xs font-semibold text-[#d97757] hover:underline whitespace-nowrap hidden sm:block"
                >
                  {cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Footer tip */}
          <div className="px-6 py-4 bg-[#faf9f5] border-t border-[#e8e6dc]">
            <p className="text-xs text-[#b0aea5]">
              <span className="font-semibold text-[#141413]">Tip:</span>{" "}
              Your public blog is at{" "}
              <Link href="/" target="_blank" className="text-[#d97757] hover:underline">
                yourdomain.com
              </Link>
              . Visitors only see posts and pages with status set to{" "}
              <span className="font-semibold text-[#141413]">Published</span>.
            </p>
          </div>
        </div>
      )}

      {/* ── How-to reference — always visible, collapsed style ── */}
      {!isNew && (
        <details open className="bg-white rounded-2xl border border-[#e8e6dc] overflow-hidden shadow-warm-sm group">
          <summary className="px-6 py-4 flex items-center justify-between cursor-pointer list-none hover:bg-[#faf9f5] transition-colors">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#d97757]" />
              <span className="text-sm font-semibold text-[#141413]">Quick Reference Guide</span>
            </div>
            <span className="text-xs text-[#b0aea5] group-open:hidden">Show</span>
            <span className="text-xs text-[#b0aea5] hidden group-open:block">Hide</span>
          </summary>
          <div className="divide-y divide-[#e8e6dc] border-t border-[#e8e6dc]">
            {guideSteps.map(({ step, icon: Icon, title, desc, href, cta }) => (
              <div key={step} className="px-6 py-4 flex gap-4">
                <div className="shrink-0 w-7 h-7 rounded-lg bg-[#d97757]/10 flex items-center justify-center mt-0.5">
                  <span className="text-[10px] font-bold text-[#d97757]">{step}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={13} className="text-[#b0aea5]" />
                    <h3 className="text-sm font-semibold text-[#141413]">{title}</h3>
                  </div>
                  <p className="text-xs text-[#b0aea5] leading-relaxed">{desc}</p>
                </div>
                <Link href={href} className="shrink-0 self-center text-xs font-semibold text-[#d97757] hover:underline hidden sm:block">
                  {cta}
                </Link>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 bg-[#faf9f5] border-t border-[#e8e6dc]">
            <p className="text-xs text-[#b0aea5]">
              <span className="font-semibold text-[#141413]">Tip:</span>{" "}
              Visitors only see content with status <span className="font-semibold text-[#141413]">Published</span>.
              Drafts are private.
            </p>
          </div>
        </details>
      )}

      {/* ── Recent posts table ── */}
      <div className="bg-white rounded-2xl border border-[#e8e6dc] overflow-hidden shadow-warm-sm">
        <div className="px-5 py-4 border-b border-[#e8e6dc] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#141413]">Recent Posts</h2>
          <Link
            href="/admin/posts/new"
            className="flex items-center gap-1 text-xs bg-[#141413] hover:bg-[#d97757] text-white px-3 py-1.5 rounded-xl transition-colors"
          >
            <Plus size={12} /> New Post
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#d97757]/10 flex items-center justify-center mx-auto mb-4">
              <PenLine size={20} className="text-[#d97757]" />
            </div>
            <p className="text-sm font-semibold text-[#141413] mb-1">No posts yet</p>
            <p className="text-sm text-[#b0aea5] mb-4">
              Your published posts will appear here once you create them.
            </p>
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-1.5 text-sm bg-[#141413] hover:bg-[#d97757] text-white px-4 py-2 rounded-xl transition-colors"
            >
              <Plus size={14} /> Write your first post
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-[#b0aea5] border-b border-[#e8e6dc] bg-[#faf9f5]">
                <th className="text-left px-5 py-3 font-medium">Title</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Views</th>
                <th className="text-left px-5 py-3 font-medium hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e6dc]">
              {recentPosts.map((post: any) => (
                <tr key={post.id} className="hover:bg-[#faf9f5] transition-colors">
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/posts/${post.id}`}
                      className="font-medium text-[#141413] hover:text-[#d97757] transition-colors"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      post.status === "published"
                        ? "bg-green-50 text-green-700"
                        : "bg-[#e8e6dc] text-[#b0aea5]"
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[#b0aea5] hidden sm:table-cell">
                    <span className="flex items-center gap-1">
                      <Eye size={13} /> {post.view_count}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[#b0aea5] hidden sm:table-cell">
                    {formatDate(post.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
