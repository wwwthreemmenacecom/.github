import type { Tone } from "@/lib/cloudflare-status"

// Literal class strings so Tailwind can statically detect them.
export const toneText: Record<Tone, string> = {
  ok: "text-ok",
  warn: "text-warn",
  orange: "text-orange",
  danger: "text-danger",
}

export const toneDot: Record<Tone, string> = {
  ok: "bg-ok",
  warn: "bg-warn",
  orange: "bg-orange",
  danger: "bg-danger",
}

export const tonePill: Record<Tone, string> = {
  ok: "bg-ok-soft text-ok",
  warn: "bg-warn-soft text-warn",
  orange: "bg-orange-soft text-orange",
  danger: "bg-danger-soft text-danger",
}

export const toneBorder: Record<Tone, string> = {
  ok: "border-l-ok",
  warn: "border-l-warn",
  orange: "border-l-orange",
  danger: "border-l-danger",
}
