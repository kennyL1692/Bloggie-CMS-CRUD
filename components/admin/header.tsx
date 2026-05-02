"use client"

import { useTransition } from "react"
import { usePathname } from "next/navigation"
import { logout } from "@/app/login/actions"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User, Loader2, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"

function usePageTitle() {
  const pathname = usePathname()
  if (pathname === "/admin")                return "Dashboard"
  if (pathname === "/admin/posts/new")      return "New Post"
  if (pathname.startsWith("/admin/posts/")) return "Edit Post"
  if (pathname === "/admin/posts")          return "Posts"
  if (pathname === "/admin/pages/new")      return "New Page"
  if (pathname.startsWith("/admin/pages/")) return "Edit Page"
  if (pathname === "/admin/pages")          return "Pages"
  if (pathname === "/admin/media")          return "Media"
  if (pathname === "/admin/settings")       return "Settings"
  return "Admin"
}

interface AdminHeaderProps {
  email: string
}

export function AdminHeader({ email }: AdminHeaderProps) {
  const initials  = email.slice(0, 2).toUpperCase() || "AD"
  const router    = useRouter()
  const pageTitle = usePageTitle()
  const [isPending, startTransition] = useTransition()

  function handleLogout() {
    startTransition(async () => { await logout() })
  }

  return (
    <header className="h-14 bg-[#faf9f5] border-b border-[#e8e6dc] flex items-center justify-between px-6">
      <h1
        className="text-[15px] font-semibold text-[#141413]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {pageTitle}
      </h1>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 hover:bg-[#e8e6dc]/60 transition-colors outline-none">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-[#d97757] text-white text-[10px] font-semibold">
              {isPending ? <Loader2 size={11} className="animate-spin" /> : initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-[13px] text-[#6b6966] font-medium hidden sm:block max-w-[160px] truncate">
            {email}
          </span>
          <ChevronDown size={13} className="text-[#b0aea5] hidden sm:block" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => router.push("/admin/settings")}
            className="flex items-center gap-2 cursor-pointer text-sm"
          >
            <User size={14} />
            Profile &amp; Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            disabled={isPending}
            className="flex items-center gap-2 text-red-500 focus:text-red-500 cursor-pointer text-sm"
          >
            <LogOut size={14} />
            {isPending ? "Signing out…" : "Sign out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
