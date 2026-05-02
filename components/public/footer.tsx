import Link from "next/link"
import { Feather, Rss } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { NewsletterForm } from "./newsletter-form"

async function getPublishedPages() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("pages")
    .select("title, slug")
    .eq("status", "published")
    .order("created_at", { ascending: true })
  return data ?? []
}

export async function Footer() {
  const year  = new Date().getFullYear()
  const pages = await getPublishedPages()

  const navLinks = [
    { label: "Home",     href: "/" },
    { label: "Articles", href: "/search" },
    ...pages.map((p) => ({ label: p.title, href: `/${p.slug}` })),
  ]

  return (
    <footer className="mt-auto border-t border-[#e8e6dc] dark:border-[#2a2926]">

      {/* ── Newsletter band ── */}
      <div className="bg-[#141413] dark:bg-[#0e0e0d]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold text-[#d97757] uppercase tracking-widest mb-1">
              Stay in the loop
            </p>
            <h3
              className="text-lg font-semibold text-[#faf9f5]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Get new posts in your inbox
            </h3>
            <p className="text-sm text-[#8a8880] mt-1">
              No spam. Just good writing, whenever we publish.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* ── Main footer body ── */}
      <div className="bg-[#faf9f5] dark:bg-[#141413]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

            {/* Col 1 — Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#d97757] flex items-center justify-center shrink-0">
                  <Feather size={13} className="text-white" strokeWidth={2.5} />
                </div>
                <span
                  className="text-[15px] font-semibold text-[#141413] dark:text-[#faf9f5] tracking-tight"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Bloggie
                </span>
              </div>
              <p className="text-sm text-[#6b6966] dark:text-[#8a8880] leading-relaxed max-w-[220px]">
                A thoughtfully crafted space for writing that matters.
              </p>
            </div>

            {/* Col 2 — Pages (dynamic) */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-[#141413] dark:text-[#faf9f5] uppercase tracking-widest">
                Pages
              </p>
              <nav className="flex flex-col gap-2">
                {navLinks.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="text-sm text-[#6b6966] dark:text-[#8a8880] hover:text-[#141413] dark:hover:text-[#faf9f5] transition-colors w-fit"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Col 3 — Follow */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-[#141413] dark:text-[#faf9f5] uppercase tracking-widest">
                Follow
              </p>
              <nav className="flex flex-col gap-2">
                <a
                  href="/feed.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-[#6b6966] dark:text-[#8a8880] hover:text-[#d97757] transition-colors w-fit"
                >
                  <Rss size={13} /> RSS Feed
                </a>
              </nav>
            </div>
          </div>

          {/* Bottom rule + copyright */}
          <div className="mt-10 pt-6 border-t border-[#e8e6dc] dark:border-[#2a2926] flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-[#b0aea5]">
              &copy; {year} Bloggie. All rights reserved.
            </p>
            <p className="text-xs text-[#b0aea5]">
              Built with Next.js &amp; Supabase
            </p>
          </div>
        </div>
      </div>

    </footer>
  )
}
