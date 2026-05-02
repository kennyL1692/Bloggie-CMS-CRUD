"use client"

import { useState } from "react"
import { login } from "@/app/login/actions"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError]               = useState<string | null>(null)
  const [loading, setLoading]           = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  const inputCls = [
    "w-full h-11 rounded-xl border px-3.5 text-sm outline-none transition-colors",
    "bg-[#faf9f5] border-[#e8e6dc] text-[#141413] placeholder:text-[#b0aea5]",
    "focus:border-[#d97757] focus:ring-2 focus:ring-[#d97757]/20",
    "dark:bg-[#141413] dark:border-[#2a2926] dark:text-[#faf9f5] dark:placeholder:text-[#6b6966]",
    "dark:focus:border-[#d97757] dark:focus:ring-2 dark:focus:ring-[#d97757]/30",
  ].join(" ")

  return (
    <form action={handleSubmit} className="space-y-5">

      {/* Email */}
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-[#141413] dark:text-[#faf9f5]"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="admin@example.com"
          required
          autoComplete="email"
          className={inputCls}
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-[#141413] dark:text-[#faf9f5]"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            className={`${inputCls} pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b0aea5] hover:text-[#141413] dark:hover:text-[#faf9f5] transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl px-3.5 py-2.5">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 rounded-xl bg-[#141413] hover:bg-[#d97757] dark:bg-[#d97757] dark:hover:bg-[#c96645] text-white text-sm font-semibold transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
      >
        {loading ? (
          <><Loader2 size={16} className="animate-spin" /> Signing in…</>
        ) : (
          "Sign in"
        )}
      </button>
    </form>
  )
}
