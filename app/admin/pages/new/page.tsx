import { PageForm } from "@/components/admin/page-form"
import { createPage } from "@/app/admin/pages/actions"

export const metadata = { title: "New Page" }

export default function NewPagePage() {
  return <PageForm action={createPage} mode="create" />
}
