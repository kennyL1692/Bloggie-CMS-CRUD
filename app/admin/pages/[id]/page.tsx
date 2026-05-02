import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { PageForm } from "@/components/admin/page-form"
import { updatePage } from "@/app/admin/pages/actions"

interface Props {
  params: Promise<{ id: string }>
}

export const metadata = { title: "Edit Page" }

export default async function EditPagePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("id", id)
    .single()

  if (!page) notFound()

  return (
    <PageForm
      page={page}
      action={updatePage.bind(null, id)}
      mode="edit"
    />
  )
}
