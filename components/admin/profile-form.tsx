"use client"

import { useState, useTransition } from "react"
import { createClient } from "@/lib/supabase/client"
import { updateProfile, changePassword } from "@/app/admin/settings/actions"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, Upload, User, Lock, Eye } from "lucide-react"
import Image from "next/image"
import type { Profile } from "@/types"
import { toast } from "sonner"

interface ProfileFormProps {
  profile: Profile
  email: string
}

export function ProfileForm({ profile, email }: ProfileFormProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "account">("profile")

  // Profile fields
  const [name,      setName]      = useState(profile.name ?? "")
  const [bio,       setBio]       = useState(profile.bio ?? "")
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? "")
  const [profilePending, startProfileTransition] = useTransition()
  const [avatarUploading, setAvatarUploading]     = useState(false)
  const [showPreview, setShowPreview]             = useState(false)

  // Account fields
  const [newPw,     setNewPw]     = useState("")
  const [confirmPw, setConfirmPw] = useState("")
  const [accountPending, startAccountTransition] = useTransition()

  async function handleAvatarUpload(file: File) {
    if (!file.type.startsWith("image/")) return
    setAvatarUploading(true)
    const supabase = createClient()
    const ext  = file.name.split(".").pop()
    const path = `${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, file, { cacheControl: "3600", upsert: true })
    if (!error) {
      const { data } = supabase.storage.from("avatars").getPublicUrl(path)
      setAvatarUrl(data.publicUrl)
      toast.success("Avatar uploaded!")
    } else {
      toast.error("Avatar upload failed")
    }
    setAvatarUploading(false)
  }

  function handleSaveProfile() {
    startProfileTransition(async () => {
      const fd = new FormData()
      fd.append("name",       name)
      fd.append("bio",        bio)
      fd.append("avatar_url", avatarUrl)
      const result = await updateProfile(fd)
      if (result?.error) toast.error(result.error)
      else toast.success("Profile updated!")
    })
  }

  function handleChangePassword() {
    startAccountTransition(async () => {
      const fd = new FormData()
      fd.append("new_password",     newPw)
      fd.append("confirm_password", confirmPw)
      const result = await changePassword(fd)
      if (result?.error) toast.error(result.error)
      else {
        toast.success("Password updated!")
        setNewPw("")
        setConfirmPw("")
      }
    })
  }

  const initials = (name || email).slice(0, 2).toUpperCase()

  const tabClass = (tab: "profile" | "account") =>
    `flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
      activeTab === tab
        ? "bg-[#141413] text-white"
        : "text-[#b0aea5] hover:text-[#141413] hover:bg-[#e8e6dc]"
    }`

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#141413]" style={{ fontFamily: "var(--font-heading)" }}>
          Settings
        </h1>
        <p className="text-sm text-[#b0aea5] mt-1">Manage your profile and account settings</p>
      </div>

      <div className="flex gap-2">
        <button className={tabClass("profile")} onClick={() => setActiveTab("profile")}>
          <User size={15} /> Profile
        </button>
        <button className={tabClass("account")} onClick={() => setActiveTab("account")}>
          <Lock size={15} /> Account
        </button>
      </div>

      {/* ── Profile Tab ── */}
      {activeTab === "profile" && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-[#e8e6dc] p-6 space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-5">
              <div className="relative">
                {avatarUrl ? (
                  <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-[#e8e6dc]">
                    <Image src={avatarUrl} alt="Avatar" width={80} height={80} className="object-cover w-full h-full" />
                  </div>
                ) : (
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-[#d97757] text-white text-xl font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                )}
                <label className="absolute -bottom-1 -right-1 p-1.5 bg-white border border-[#e8e6dc] rounded-full cursor-pointer hover:bg-[#faf9f5] transition-colors">
                  {avatarUploading
                    ? <Loader2 size={12} className="animate-spin text-[#b0aea5]" />
                    : <Upload size={12} className="text-[#b0aea5]" />}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
                  />
                </label>
              </div>
              <div>
                <p className="text-sm font-medium text-[#141413]">{name || "No name set"}</p>
                <p className="text-xs text-[#b0aea5]">{email}</p>
                <p className="text-xs text-[#b0aea5] mt-1">Click the icon to change your avatar</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[#141413]">Display Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="border-[#e8e6dc] focus-visible:ring-[#d97757]"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[#141413]">Email</Label>
                <Input
                  value={email}
                  disabled
                  className="border-[#e8e6dc] bg-[#faf9f5] text-[#b0aea5] cursor-not-allowed"
                />
                <p className="text-xs text-[#b0aea5]">Email cannot be changed here</p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-[#141413]">Bio</Label>
                  <button
                    type="button"
                    onClick={() => setShowPreview((v) => !v)}
                    className="flex items-center gap-1 text-xs text-[#b0aea5] hover:text-[#d97757] transition-colors"
                  >
                    <Eye size={12} />
                    {showPreview ? "Hide preview" : "Preview author card"}
                  </button>
                </div>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell readers a little about yourself..."
                  className="border-[#e8e6dc] focus-visible:ring-[#d97757] resize-none"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-[#e8e6dc]">
              <button
                onClick={handleSaveProfile}
                disabled={profilePending}
                className="px-4 py-2 text-sm rounded-lg bg-[#141413] hover:bg-[#d97757] text-white transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {profilePending && <Loader2 size={14} className="animate-spin" />}
                {profilePending ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>

          {/* ── Live Author Card Preview ── */}
          {showPreview && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-[#d97757]" />
                <p className="text-xs font-semibold text-[#b0aea5] uppercase tracking-widest">
                  Author card preview
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-[#e8e6dc] p-6 flex gap-4">
                {avatarUrl ? (
                  <div className="h-14 w-14 rounded-full overflow-hidden shrink-0">
                    <Image src={avatarUrl} alt={name || "Author"} width={56} height={56} className="object-cover w-full h-full" />
                  </div>
                ) : (
                  <div className="h-14 w-14 rounded-full bg-[#d97757] flex items-center justify-center shrink-0">
                    <span className="text-white text-lg font-bold">{initials}</span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-[#141413]">{name || "Your Name"}</p>
                  {bio ? (
                    <p className="text-sm text-[#b0aea5] mt-1 leading-relaxed">{bio}</p>
                  ) : (
                    <p className="text-sm text-[#e8e6dc] mt-1 italic">Your bio will appear here…</p>
                  )}
                </div>
              </div>
              <p className="text-xs text-[#b0aea5] text-center">
                This is how your author card appears at the bottom of every post.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Account Tab ── */}
      {activeTab === "account" && (
        <div className="bg-white rounded-xl border border-[#e8e6dc] p-6 space-y-6">
          <div>
            <h2 className="text-base font-semibold text-[#141413]">Change Password</h2>
            <p className="text-xs text-[#b0aea5] mt-1">Choose a strong password with at least 6 characters</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#141413]">New Password</Label>
              <Input
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="New password"
                className="border-[#e8e6dc] focus-visible:ring-[#d97757]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[#141413]">Confirm Password</Label>
              <Input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Confirm new password"
                className="border-[#e8e6dc] focus-visible:ring-[#d97757]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-2 border-t border-[#e8e6dc]">
            <button
              onClick={handleChangePassword}
              disabled={accountPending || !newPw}
              className="px-4 py-2 text-sm rounded-lg bg-[#141413] hover:bg-[#d97757] text-white transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {accountPending && <Loader2 size={14} className="animate-spin" />}
              {accountPending ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
