import { createClient } from "@/lib/supabase/server"
import { MediaLibrary } from "@/components/admin/media-library"
import type { Media } from "@/types"

export const metadata = { title: "Media Library" }

export default async function MediaPage() {
  const supabase = await createClient()
  const { data: media } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#141413]" style={{ fontFamily: "var(--font-heading)" }}>
          Media Library
        </h1>
        <p className="text-sm text-[#b0aea5] mt-1">
          {media?.length ?? 0} file{media?.length !== 1 ? "s" : ""} uploaded
        </p>
      </div>

      <MediaLibrary initialMedia={(media ?? []) as Media[]} />
    </div>
  )
}
