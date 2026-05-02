import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { Toaster } from "sonner"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  return (
    <div className="min-h-screen flex bg-[#f5f4f0]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader email={user.email ?? ""} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#141413",
            color: "#faf9f5",
            border: "1px solid #2a2926",
            borderRadius: "12px",
            fontSize: "13px",
          },
        }}
      />
    </div>
  )
}
