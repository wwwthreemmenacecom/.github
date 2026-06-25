// Types and fetch helpers for the Cloudflare Statuspage API.
// Docs: https://www.cloudflarestatus.com/api/v2/

const STATUS_BASE = "https://www.cloudflarestatus.com/api/v2"

export type IndicatorLevel = "none" | "minor" | "major" | "critical" | "maintenance"

export interface StatusPage {
  id: string
  name: string
  url: string
  updated_at: string
}

export interface OverallStatus {
  indicator: IndicatorLevel
  description: string
}

export type ComponentStatus =
  | "operational"
  | "degraded_performance"
  | "partial_outage"
  | "major_outage"
  | "under_maintenance"

export interface StatusComponent {
  id: string
  name: string
  status: ComponentStatus
  description: string | null
  group: boolean
  group_id: string | null
  position: number
  updated_at: string
  only_show_if_degraded: boolean
}

export interface IncidentUpdate {
  id: string
  status: string
  body: string
  created_at: string
  display_at: string
}

export interface Incident {
  id: string
  name: string
  status: string
  impact: IndicatorLevel
  shortlink: string
  created_at: string
  updated_at: string
  monitoring_at: string | null
  resolved_at: string | null
  incident_updates: IncidentUpdate[]
}

export interface ScheduledMaintenance {
  id: string
  name: string
  status: string
  impact: IndicatorLevel
  shortlink: string
  scheduled_for: string
  scheduled_until: string
  created_at: string
  updated_at: string
  incident_updates: IncidentUpdate[]
}

export interface StatusSummary {
  page: StatusPage
  status: OverallStatus
  components: StatusComponent[]
  incidents: Incident[]
  scheduled_maintenances: ScheduledMaintenance[]
}

export async function getStatusSummary(): Promise<StatusSummary> {
  const res = await fetch(`${STATUS_BASE}/summary.json`, {
    // Cloudflare publishes status data frequently; revalidate often.
    next: { revalidate: 60 },
    headers: { Accept: "application/json" },
  })

  if (!res.ok) {
    throw new Error(`Failed to load Cloudflare status (${res.status})`)
  }

  return res.json()
}

export const COMPONENT_STATUS_LABEL: Record<ComponentStatus, string> = {
  operational: "Operational",
  degraded_performance: "Degraded Performance",
  partial_outage: "Partial Outage",
  major_outage: "Major Outage",
  under_maintenance: "Under Maintenance",
}

export const INDICATOR_LABEL: Record<IndicatorLevel, string> = {
  none: "All Systems Operational",
  minor: "Minor Service Disruption",
  major: "Major Service Outage",
  critical: "Critical Service Outage",
  maintenance: "Maintenance Underway",
}

export type Tone = "ok" | "warn" | "orange" | "danger"

export function componentTone(status: ComponentStatus): Tone {
  switch (status) {
    case "operational":
      return "ok"
    case "degraded_performance":
      return "warn"
    case "partial_outage":
    case "under_maintenance":
      return "orange"
    case "major_outage":
      return "danger"
  }
}

export function indicatorTone(indicator: IndicatorLevel): Tone {
  switch (indicator) {
    case "none":
      return "ok"
    case "minor":
      return "warn"
    case "maintenance":
    case "major":
      return "orange"
    case "critical":
      return "danger"
  }
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  })
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const abs = Math.abs(diff)
  const mins = Math.round(abs / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ${diff >= 0 ? "ago" : "from now"}`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ${diff >= 0 ? "ago" : "from now"}`
  const days = Math.round(hours / 24)
  return `${days}d ${diff >= 0 ? "ago" : "from now"}`
}
