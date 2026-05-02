import { createClient } from "@/lib/supabase/server"
import { formatDate } from "@/lib/utils"
import { Pencil, Plus } from "lucide-react"
import Link from "next/link"
import { DeletePageButton } from "@/components/admin/delete-page-button"

export const metadata = { title: "Pages" }

export default async function PagesPage() {
  const supabase = await createClient()
  const { data: pages } = await supabase
    .from("pages")
    .select("id, title, slug, status, created_at, updated_at")
    .order("created_at", { ascending: false })

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#141413]" style={{ fontFamily: "var(--font-heading)" }}>
            Pages
          </h1>
          <p className="text-sm text-[#b0aea5] mt-1">{pages?.length ?? 0} total pages</p>
        </div>
        <Link
          href="/admin/pages/new"
          className="flex items-center gap-2 bg-[#141413] hover:bg-[#d97757] text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} /> New Page
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#e8e6dc] overflow-hidden">
        {!pages?.length ? (
          <div className="py-16 text-center text-sm text-[#b0aea5]">
            No pages yet.{" "}
            <Link href="/admin/pages/new" className="text-[#d97757] hover:underline">
              Create your first page →
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-[#b0aea5] border-b border-[#e8e6dc] bg-[#faf9f5]">
                <th className="text-left px-5 py-3 font-medium">Title</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Last Updated</th>
                <th className="text-right px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e6dc]">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-[#faf9f5] transition-colors">
                  <td className="px-5 py-3">
                    <span className="font-medium text-[#141413]">{page.title}</span>
                    <span className="block text-xs text-[#b0aea5] mt-0.5">/{page.slug}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      page.status === "published"
                        ? "bg-green-50 text-green-700"
                        : "bg-[#e8e6dc] text-[#b0aea5]"
                    }`}>
                      {page.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[#b0aea5] hidden md:table-cell">
                    {formatDate(page.updated_at)}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/pages/${page.id}`}
                        className="p-1.5 rounded-lg text-[#b0aea5] hover:text-[#141413] hover:bg-[#e8e6dc] transition-colors"
                        title="Edit page"
                      >
                        <Pencil size={15} />
                      </Link>
                      <DeletePageButton id={page.id} />
                    </div>
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
