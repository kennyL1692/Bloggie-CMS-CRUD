"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, FileText, File,
  Image, Settings, ExternalLink, Feather,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", href: "/admin",         icon: LayoutDashboard },
  { label: "Posts",     href: "/admin/posts",    icon: FileText },
  { label: "Pages",     href: "/admin/pages",    icon: File },
  { label: "Media",     href: "/admin/media",    icon: Image },
  { label: "Settings",  href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 bg-white flex flex-col min-h-screen border-r border-[#e8e6dc]">

      {/* ── Logo ── */}
      <div className="h-14 flex items-center px-5 border-b border-[#e8e6dc]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#d97757] flex items-center justify-center shrink-0">
            <Feather size={13} className="text-white" strokeWidth={2.5} />
          </div>
          <span
            className="text-[15px] font-semibold text-[#141413] tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Bloggie
          </span>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors duration-150",
                active
                  ? "bg-[#faf9f5] text-[#141413] border border-[#e8e6dc]"
                  : "text-[#6b6966] hover:text-[#141413] hover:bg-[#faf9f5]"
              )}
            >
              <Icon
                size={15}
                className={cn(
                  "shrink-0 transition-colors",
                  active ? "text-[#d97757]" : "text-[#b0aea5]"
                )}
              />
              {label}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#d97757] shrink-0" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* ── View site ── */}
      <div className="px-3 py-4 border-t border-[#e8e6dc]">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-[#b0aea5] hover:text-[#141413] hover:bg-[#faf9f5] transition-colors"
        >
          <ExternalLink size={15} className="shrink-0" />
          View Site
        </Link>
      </div>
    </aside>
  )
}
