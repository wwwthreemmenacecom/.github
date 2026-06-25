"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { RotateCw } from "lucide-react"

export function RefreshButton({ updatedAt }: { updatedAt: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [spinning, setSpinning] = useState(false)

  function refresh() {
    setSpinning(true)
    startTransition(() => {
      router.refresh()
    })
    setTimeout(() => setSpinning(false), 800)
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-xs text-muted-foreground sm:inline">
        Updated {new Date(updatedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
      </span>
      <button
        type="button"
        onClick={refresh}
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
      >
        <RotateCw className={`size-4 ${spinning ? "animate-spin" : ""}`} aria-hidden="true" />
        Refresh
      </button>
    </div>
  )
}
