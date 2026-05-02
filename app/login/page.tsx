import { LoginForm } from "@/components/admin/login-form"
import { Feather } from "lucide-react"

export const metadata = { title: "Login" }

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#141413] relative overflow-hidden px-4">

      {/* Gradient orb — top right */}
      <div
        className="orb orb-orange absolute -top-40 -right-40 w-[600px] h-[600px] opacity-25"
        aria-hidden
      />
      {/* Gradient orb — bottom left */}
      <div
        className="orb orb-cream absolute -bottom-60 -left-40 w-[500px] h-[500px] opacity-15"
        aria-hidden
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#d97757] flex items-center justify-center shadow-warm-orange-lg">
            <Feather size={26} className="text-white" strokeWidth={2} />
          </div>
          <div className="text-center">
            <h1
              className="text-2xl font-bold text-[#faf9f5]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Bloggie
            </h1>
            <p className="mt-1 text-sm text-[#6b6865]">Sign in to your admin panel</p>
          </div>
        </div>

        {/* Form card */}
        <div className="bg-[#1e1d1b] rounded-2xl border border-[#2a2926] shadow-warm-lg p-7">
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-[#4a4845]">
          Powered by Anthropic · Bloggie
        </p>
      </div>
    </main>
  )
}
