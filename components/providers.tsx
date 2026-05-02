"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
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
    </ThemeProvider>
  )
}
